'use client';
import { Button } from '@radix-ui/themes';
import { toast } from 'react-hot-toast';
import { api } from '../../../trpc/react';

export const ResetAccount = () => {
  const { mutateAsync: resetAccount } = api.occ.resetAccount.useMutation();

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
