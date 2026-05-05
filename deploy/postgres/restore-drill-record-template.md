# PostgreSQL 恢复演练记录模板

## 基本信息

- 演练日期：
- 演练负责人：
- 备份文件路径：
- 备份生成时间：
- 目标测试库：`counterattack_offer_restore_check`
- 执行环境：本机 / Docker / 服务器

## 执行命令

```bash
BACKUP_ENCRYPTION_PASSPHRASE='***' \
RESTORE_CHECK_DATABASE=counterattack_offer_restore_check \
deploy/postgres/restore-backup-check.sh /var/backups/counterattack-offer/postgres/counterattack_offer-YYYYMMDDTHHMMSSZ.dump.enc
```

## 校验结果

- 脚本退出码：
- `users` 行数：
- `audit_logs` 行数：
- `ai_call_logs` 行数：
- `mail_events` 行数：
- 恢复耗时：
- 测试库是否只在测试环境使用：是 / 否

## 结论

- 恢复是否成功：是 / 否
- 发现的问题：
- 后续行动：
- 下次演练计划：
