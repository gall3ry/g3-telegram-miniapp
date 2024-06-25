'use client';
import { cn } from '@g3-miniapp/utils';
import { Footer, Header } from '@gall3ry/g3-miniapp-ui';
import { Box } from '@radix-ui/themes';
import {
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams,
} from '@tma.js/sdk-react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
const BackButton = dynamic(
  () => import('@twa-dev/sdk/react').then((mod) => mod.BackButton),
  {
    ssr: false,
  }
);

const fluidPages: RegExp[] = [
  // /create
  /\/create\/?/,
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const launchParams = retrieveLaunchParams();

        console.log(
          `Successfully retrieved launch params: ${JSON.stringify(
            launchParams
          )}`
        );
      } catch {
        const initDataRaw = `user=%7B%22id%22%3A1216103870%2C%22first_name%22%3A%22Tin%20Nguyen%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22pnpminstall%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8466138492746567038&chat_type=private&auth_date=1719290949&hash=4cc190ca41d42fa85b72bb5f23f320d5191a9c88291f43024e9c3cace3f2e157`;

        mockTelegramEnv({
          themeParams: {
            accentTextColor: '#6ab2f2',
            bgColor: '#17212b',
            buttonColor: '#5288c1',
            buttonTextColor: '#ffffff',
            destructiveTextColor: '#ec3942',
            headerBgColor: '#17212b',
            hintColor: '#708499',
            linkColor: '#6ab3f3',
            secondaryBgColor: '#232e3c',
            sectionBgColor: '#17212b',
            sectionHeaderTextColor: '#6ab3f3',
            subtitleTextColor: '#708499',
            textColor: '#f5f5f5',
          },
          initData: parseInitData(initDataRaw),
          initDataRaw,
          version: '7.2',
          platform: 'tdesktop',
        });
      }
    }
  }, []);

  return (
    <Box
      className="min-h-screen xl:py-2"
      style={{
        background: 'var(--black-a10)',
      }}
    >
      <Box className="container bg-white xl:rounded-lg" position="relative">
        {pathname !== '/' && <BackButton />}

        <div className="sticky top-0 z-50 bg-white p-4">
          <Header />
        </div>

        <div
          className={cn('flex min-h-[82vh] flex-col p-4', {
            'p-0': fluidPages.some((re) => re.test(pathname)),
          })}
        >
          {children}
        </div>

        <Footer />
      </Box>
    </Box>
  );
}
