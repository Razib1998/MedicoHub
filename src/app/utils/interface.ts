import { UserRole } from "@prisma/client";

export type TUser = {
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
} | null;
