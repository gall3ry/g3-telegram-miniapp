'use client';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { Flex } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { LoggedButton } from './LoggedButton';

const Header = () => {
  const { isAuthenticated } = useIsAuthenticated();

  return (
    <Flex justify="between" gap="2" align="center" className="relative z-50">
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={92}
          height={44}
          priority={true}
        />
      </Link>

      {isAuthenticated && <LoggedButton />}
    </Flex>
  );
};

const HeaderWrapper = () => {
  return <Header />;
};

export { HeaderWrapper as Header };
