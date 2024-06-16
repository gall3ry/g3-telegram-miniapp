import { AppRouter } from '@gall3ry/g3-backend/trpc-server';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();
