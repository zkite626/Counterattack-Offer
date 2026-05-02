import type { User, CreateUserDTO } from "@/types/auth";

// 用户持久化记录（包含密码哈希）
export interface UserRecord extends User {
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  create(dto: CreateUserDTO & { passwordHash: string }): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}
