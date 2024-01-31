import { UnauthorizedException } from '@nestjs/common';

export const authContext = ({ req }) => {
  try {
    if (req.headers.authorization) {
      return {
        authorization: `${req.headers.authorization}`,
      };
    }
  } catch (err) {
    throw new UnauthorizedException(
      'Invalid authorization Headers',
    );
  }
};