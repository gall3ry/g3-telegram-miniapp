import { Theme } from "@radix-ui/themes";
import "~/styles/globals.css";

import { cn } from "@repo/utils";
import { Kanit } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Providers } from "./_providers";

export const metadata = {
  title: "Gall3ry MiniApp",
  description: "Gall3ry MiniApp",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  preload: true,
  variable: "--font-kanit",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(kanit.variable)}>
      <body className="font-sans">
        <Providers>
          <Script src="https://telegram.org/js/telegram-web-app.js"></Script>
          <Toaster />
          <Theme radius="full" accentColor="lime">
            {children}
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
