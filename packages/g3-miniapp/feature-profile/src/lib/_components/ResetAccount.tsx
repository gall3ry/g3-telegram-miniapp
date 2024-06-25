'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button } from '@radix-ui/themes';
import { toast } from 'react-hot-toast';

export const ResetAccount = () => {
  const utils = api.useUtils();
  const { mutateAsync: resetAccount } = api.occ.resetAccount.useMutation({
    onSuccess: () => {
      utils.occ.invalidate();
      utils.auth.invalidate();
    },
  });

  return (
    <Button
      variant="surface"
      size="3"
      className="w-full my-2"
      color="red"
      onClick={() => {
        toast.promise(resetAccount(), {
          loading: 'Resetting account...',
          success: 'Account reset successfully',
          error: 'Failed to reset account',
        });
      }}
    >
      Reset account
    </Button>
  );
};
