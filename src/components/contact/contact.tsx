'use client';

import ArrowUpRightIcon from '@/assets/icons/arrow-up-right';
import MailIcon from '@/assets/icons/mail';
import { mail } from '@/constants/strings';
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from '@/constants/contact';
import { AlertDialog } from '@/shared/components/alerts/alert-dialog';
import { useAlert } from '@/shared/components/alerts/alert-hook';
import { AlertEnum, AlertType } from '@/shared/components/alerts/types';
import CardTitle from '@/shared/components/titles/card-title';
import { useLoadingButton } from '@/shared/hooks/loading-button-hook';
import cardStyle from '@/shared/styles/card';
import inputStyle from '@/shared/styles/input';
import '@/shared/styles/input.css';
import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import LinksGridCard from '../cards/links/links-grid';

const hasRecaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const getTextById = (id: string): string | undefined => {
  try {
    const element = document.getElementById(id) as HTMLInputElement;
    return element.value;
  } catch {}
};

const clearFormFields = () => {
  ['name', 'email', 'message'].forEach((id) => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) element.value = '';
  });
};

const formatResetTime = (resetAt: number): string =>
  new Date(resetAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

type ExecuteRecaptcha = (action?: string) => Promise<string>;

type LimitState = {
  remaining: number;
  resetAt: number | null;
  blocked: boolean;
};

function ContactForm({
  executeRecaptcha,
}: {
  executeRecaptcha?: ExecuteRecaptcha;
}) {
  const [limit, setLimit] = useState<LimitState>({
    remaining: 2,
    resetAt: null,
    blocked: false,
  });
  const [justSent, setJustSent] = useState(false);

  const alertDialog = useAlert({
    Alert: AlertDialog,
    iniAlert: { type: AlertEnum.ERROR, className: '' },
  });

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data: LimitState) => setLimit(data))
      .catch(() => {});
  }, []);

  const formDisabled = limit.blocked;

  const loadingButton = useLoadingButton({
    props: {
      className:
        'justify-center items-center rounded-full bg-dark dark:bg-white text-white dark:text-dark',
      button: (
        <button
          type="submit"
          disabled={formDisabled || justSent}
          onClick={() => {
            try {
              ['name', 'email', 'message'].forEach((id) => {
                if (!getTextById(id))
                  throw {
                    title:
                      id.charAt(0).toUpperCase() + id.slice(1) + ' is required',
                    description: 'Please enter your ' + id + ' to continue',
                    type: AlertEnum.WARNING,
                  };
              });
              const message = getTextById('message')?.trim() ?? '';
              if (message.length < MESSAGE_MIN_LENGTH)
                throw {
                  title: 'Message too short',
                  description: `Please write at least ${MESSAGE_MIN_LENGTH} characters (a sentence or two).`,
                  type: AlertEnum.WARNING,
                };
              if (message.length > MESSAGE_MAX_LENGTH)
                throw {
                  title: 'Message too long',
                  description: `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`,
                  type: AlertEnum.WARNING,
                };
            } catch (error) {
              alertDialog.setAlertWithTimeout(error as AlertType);
            }
          }}
          className={
            'rounded-full flex font-normal text-sm text-center gap-3 px-6 py-3 hover:bg-neutral-500/20' +
            (justSent
              ? ' bg-green-500 text-white font-medium hover:bg-green-500'
              : '') +
            (formDisabled ? ' opacity-50 cursor-not-allowed' : '')
          }>
          {justSent ? 'Sent' : 'Send'}
          {justSent ? (
            <MailIcon className="w-5 h-5" strokeWidth={2} />
          ) : (
            <ArrowUpRightIcon className="w-5 h-5" />
          )}
        </button>
      ),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formDisabled) return;

    try {
      loadingButton.setLoading(true);
      const name = getTextById('name');
      const email = getTextById('email');
      const message = getTextById('message')?.trim();

      if (!message || message.length < MESSAGE_MIN_LENGTH)
        throw {
          title: 'Message too short',
          description: `Please write at least ${MESSAGE_MIN_LENGTH} characters (a sentence or two).`,
          type: AlertEnum.WARNING,
        };
      if (message.length > MESSAGE_MAX_LENGTH)
        throw {
          title: 'Message too long',
          description: `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`,
          type: AlertEnum.WARNING,
        };

      let recaptcha_token: string | undefined;
      if (hasRecaptcha) {
        if (!executeRecaptcha) {
          throw {
            title: 'Security check loading',
            description: 'Please wait a moment and try again',
            type: AlertEnum.WARNING,
          };
        }
        recaptcha_token = await executeRecaptcha('contact');
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, recaptcha_token }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setLimit({
          remaining: 0,
          resetAt: data.resetAt ?? null,
          blocked: true,
        });
        throw {
          title: 'Daily limit reached',
          description:
            data.error ??
            'You have used your 2 messages for today. Please try again later.',
          type: AlertEnum.WARNING,
          seconds: 6,
        };
      }

      if (!data.ok)
        throw {
          title: 'Failed to send message',
          description: `${data.error ?? 'Something went wrong'}`,
          type: AlertEnum.ERROR,
        };

      setLimit({
        remaining: data.remaining ?? 0,
        resetAt: data.resetAt ?? null,
        blocked: !!data.blocked,
      });

      if (data.blocked) {
        setJustSent(true);
        throw {
          title: 'Sent',
          description:
            'Your message has been sent successfully. You can contact again in 24 hours.',
          type: AlertEnum.SUCCESS,
          seconds: 6,
        };
      }

      clearFormFields();
      setJustSent(false);
      loadingButton.setLoading(false);
      throw {
        title: 'Sent',
        description:
          'Your message has been sent successfully. You have 1 message left for today.',
        type: AlertEnum.SUCCESS,
        seconds: 5,
      };
    } catch (error) {
      loadingButton.setLoading(false);
      alertDialog.setAlertWithTimeout(error as AlertType);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className={cardStyle + ' gap-7'}>
        <CardTitle title="CONTACT" icon={<MailIcon />} />
        <p className="text-md pb-1">
          <span className="opacity-70">
            Contact me by filling out the form below, or by sending to{' '}
          </span>
          <a
            className="hover:underline font-medium opacity-70 dark:!opacity-80"
            href={'mailto:' + mail}>
            {mail}
          </a>
        </p>
        {limit.blocked && limit.resetAt && (
          <p className="text-sm rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 opacity-90">
            You&apos;ve used your 2 messages for today. You can contact again at{' '}
            {formatResetTime(limit.resetAt)}.
          </p>
        )}
        <TextInput
          required
          disabled={formDisabled}
          id="name"
          type="text"
          label="Name"
          placeholder="Enter your name"
        />
        <TextInput
          required
          disabled={formDisabled}
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
        />
        <TextInput
          required
          disabled={formDisabled}
          isTextArea
          id="message"
          minLength={MESSAGE_MIN_LENGTH}
          maxLength={MESSAGE_MAX_LENGTH}
          rows={3}
          label="Message"
          placeholder="A sentence or two is enough — e.g. what you're reaching out about."
        />
        <div className="w-full flex justify-end">
          {loadingButton.loadingButton}
        </div>
        {alertDialog.alert}
      </form>
      {hasRecaptcha && (
        <p className="text-xs ml-4 pr-4 pl-2 opacity-50 pt-2">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer">
            Terms of Service
          </a>{' '}
          apply.
        </p>
      )}
      <div className="py-3" />
      <LinksGridCard />
    </div>
  );
}

function ContactWithRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  return <ContactForm executeRecaptcha={executeRecaptcha} />;
}

export default function Contact() {
  if (hasRecaptcha) {
    return <ContactWithRecaptcha />;
  }
  return <ContactForm />;
}

function TextInput(props: any) {
  const inputProps = Object.assign({}, props);
  delete inputProps.isTextArea;
  delete inputProps.label;
  return (
    <div className="input-container relative w-full">
      {props.isTextArea ? (
        <textarea {...inputProps} className={inputStyle} />
      ) : (
        <input {...inputProps} className={inputStyle} />
      )}
      <label
        className={
          'input-label absolute pointer-events-none text-xs top-[-10px] left-3 border-0 bg-white dark:bg-dark w-fit px-0.5 rounded-md'
        }>
        {props.label}
      </label>
    </div>
  );
}
