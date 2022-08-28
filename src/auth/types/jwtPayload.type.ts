import { Role } from '../../roles/roles.model';

export type JwtPayload = {
  id: number;
  roles: Role[];
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
