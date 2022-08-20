export type JwtPayload = {
  userId: number;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
