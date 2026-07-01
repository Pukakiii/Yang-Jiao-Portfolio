import FloralBackdrop from "@/components/floral/floral-backdrop";
import Providers from "@/lib/provider";
import rootMetadata from "@/metadata/root";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import localFont from "next/font/local";
import "./../globals.css";

export const metadata = rootMetadata;

const font = localFont({
  src: [
    {
      path: "../../../public/fonts/chirp/regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/chirp/medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/chirp/bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/chirp/heavy.woff",
      weight: "900",
      style: "normal",
    },
  ],
  //   preload: true,
  weight: "400 500 700 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className + " relative min-h-screen"}>
        <Providers>
          <FloralBackdrop />
          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 xs:px-10">
            <Header />
            <main className="h-full w-full justify-center items-center m-auto py-4 xs:py-10">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
