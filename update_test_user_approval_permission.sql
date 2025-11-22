-- ============================================
-- 给测试用户 test@example.com 赋予审批权限
-- ============================================
-- 说明：为测试用户设置审批权限
-- 创建日期: 2025-11-22
-- ============================================

-- 1. 给测试用户赋予审批权限
UPDATE users 
SET can_approve = true 
WHERE email = 'test@example.com';

-- 2. 验证更新结果
SELECT 
    id,
    email,
    full_name,
    can_approve,
    role,
    created_at
FROM users
WHERE email = 'test@example.com';

