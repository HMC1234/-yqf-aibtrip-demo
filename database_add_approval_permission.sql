-- ============================================
-- 添加审批权限字段到 users 表
-- ============================================
-- 说明：为出差申请单审批功能添加用户审批权限字段
-- 创建日期: 2025-11-22
-- ============================================

-- 1. 添加审批权限字段到 users 表
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS can_approve BOOLEAN DEFAULT true;

-- 2. 添加字段注释
COMMENT ON COLUMN users.can_approve IS '是否可以审批出差申请单权限：true=有权限，false=无权限';

-- 3. 创建索引（用于快速查询有审批权限的用户）
CREATE INDEX IF NOT EXISTS idx_users_can_approve ON users(can_approve) WHERE can_approve = true;

-- 4. 给测试用户 test@example.com 赋予审批权限
-- 注意：请先查找该用户的ID，然后执行UPDATE语句
-- UPDATE users SET can_approve = true WHERE email = 'test@example.com';

-- 5. 为所有现有用户设置默认值（如果有权限字段为NULL）
UPDATE users SET can_approve = true WHERE can_approve IS NULL;

-- ============================================
-- 验证脚本：检查字段是否添加成功
-- ============================================
-- SELECT 
--     id,
--     email,
--     full_name,
--     can_approve,
--     role
-- FROM users
-- WHERE email = 'test@example.com';

