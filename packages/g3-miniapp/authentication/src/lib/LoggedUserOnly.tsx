import { Spinner, Text } from '@radix-ui/themes';
import { memo } from 'react';
import { useIsAuthenticated } from './useIsAuthenticated';

export const LoggedUserOnly = memo(
  ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useIsAuthenticated();

    if (isLoading) {
      return (
        <div className="flex justify-center">
          <Spinner />
        </div>
      );
    }

    return !isAuthenticated ? (
      <div>
        <div className="text-center">
          <Text color="gray">
            This page is only available to logged in users
          </Text>
        </div>
      </div>
    ) : (
      children
    );
  }
);

LoggedUserOnly.displayName = 'LoggedUserOnly';
