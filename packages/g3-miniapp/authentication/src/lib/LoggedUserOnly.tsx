import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { IconLogin } from '@gall3ry/g3-miniapp-icon';
import { Button, Spinner, Text } from '@radix-ui/themes';
import { useTonConnectModal } from '@tonconnect/ui-react';

export const LoggedUserOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const { open } = useTonConnectModal();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <div className="text-center">
          <Text color="gray">
            This page is only available to logged in users
          </Text>
        </div>

        <div className="mt-4 flex justify-center">
          <Button size="3" onClick={open}>
            <span>Connect wallet</span>
            <div className="size-5">
              <IconLogin />
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return children;
};
