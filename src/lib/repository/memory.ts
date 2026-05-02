import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { User, CreateUserDTO } from "@/types/auth";
import type { IUserRepository, UserRecord } from "./interface";

// 内存实现的用户仓库（单例模式）
export class MemoryUserRepository implements IUserRepository {
  private users: Map<string, UserRecord> = new Map();
  private static instance: MemoryUserRepository | null = null;

  constructor() {
    // 从环境变量初始化默认管理员
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const hash = bcryptjs.hashSync(adminPassword, 10);
      const now = new Date().toISOString();
      this.users.set("admin-001", {
        id: "admin-001",
        email: adminEmail,
        name: "管理员",
        passwordHash: hash,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  static getInstance(): MemoryUserRepository {
    if (!MemoryUserRepository.instance) {
      MemoryUserRepository.instance = new MemoryUserRepository();
    }
    return MemoryUserRepository.instance;
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async create(
    dto: CreateUserDTO & { passwordHash: string }
  ): Promise<User> {
    const now = new Date().toISOString();
    const user: UserRecord = {
      id: uuidv4(),
      email: dto.email,
      name: dto.name,
      passwordHash: dto.passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    // 返回时不包含密码哈希
    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error("用户不存在");
    const updated: UserRecord = {
      ...existing,
      ...data,
      id: existing.id,
      passwordHash: existing.passwordHash,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    const { passwordHash: _, ...publicUser } = updated;
    return publicUser;
  }
}
