import { env } from '@gall3ry/g3-miniapp-env';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}

class JwtService {
  private static instance: JwtService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }

  public signUser({ userId }: { userId: string }): string {
    return sign(
      {
        userId,
      },
      env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
  }

  public verifyUser(token: string): JwtPayload {
    return verify(token, env.JWT_SECRET) as JwtPayload;
  }
}

export const jwtService = JwtService.getInstance();
