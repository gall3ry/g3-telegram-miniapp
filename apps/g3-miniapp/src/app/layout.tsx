import { Theme } from '@radix-ui/themes';
import '../styles/globals.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { cn } from '@g3-miniapp/utils';
import { Kanit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './_providers';

export const metadata = {
  title: 'Gall3ry MiniApp',
  description: 'Gall3ry MiniApp',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  style: 'normal',
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  variable: '--font-kanit',
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
          <Toaster />
          <Theme radius="large" accentColor="lime">
            {children}
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
