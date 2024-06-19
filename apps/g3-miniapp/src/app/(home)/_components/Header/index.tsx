'use client';
import { Button, Flex } from '@radix-ui/themes';
import { useTonConnectModal } from '@tonconnect/ui-react';
import Image from 'next/image';
import Link from 'next/link';
import { useIsAuthenticated } from '../../../_providers/useAuth';
import { IconLogin } from '../../_icons/IconLogin';
import { LoggedButton } from './LoggedButton';

export const Header = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { open } = useTonConnectModal();

  return (
    <Flex justify="between" gap="2" align="center" className="relative z-50">
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={92}
          height={44}
          priority={true}
          objectFit="contain"
        />
      </Link>

      {isAuthenticated ? (
        <LoggedButton />
      ) : (
        <>
          <Button size="3" onClick={open}>
            <span>Connect wallet</span>

            <div className="size-5">
              <IconLogin />
            </div>
          </Button>
        </>
      )}
    </Flex>
  );
};
