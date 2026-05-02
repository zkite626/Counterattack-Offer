import type { IUserRepository } from "./interface";
import { MemoryUserRepository } from "./memory";

// 工厂函数：当前仅支持内存实现，未来可切换到数据库
export function getUserRepository(): IUserRepository {
  if (process.env.DATABASE_URL) {
    // 未来：return new DatabaseUserRepository(db);
    throw new Error("数据库实现尚未就绪，请使用内存模式");
  }
  return MemoryUserRepository.getInstance();
}
