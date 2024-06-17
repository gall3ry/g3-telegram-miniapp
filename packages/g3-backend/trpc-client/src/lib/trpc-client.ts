import { AppRouter } from '@gall3ry/trpc-server';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();
export { AppRouter };
