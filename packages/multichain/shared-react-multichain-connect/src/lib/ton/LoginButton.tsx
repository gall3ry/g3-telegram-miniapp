import { IconLogin } from '@gall3ry/g3-miniapp-icon';
import { Button } from '@radix-ui/themes';
import { useTonConnectModal } from '@tonconnect/ui-react';

const Inner = () => {
  const { open } = useTonConnectModal();
  return (
    <div>
      <Button size="3" onClick={open}>
        <span>Connect wallet</span>

        <div className="size-5">
          <IconLogin />
        </div>
      </Button>
    </div>
  );
};

export const LoginButton = () => {
  return <Inner />;
};
