-- ============================================
-- 检查并设置 test@example.com 用户的审批权限
-- ============================================
-- 说明：此脚本会检查用户的审批权限，如果不存在或为false，则设置为true
-- 创建日期: 2025-11-22
-- ============================================

-- 1. 首先检查 users 表是否有 can_approve 字段
-- 如果没有字段，先添加字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'can_approve'
    ) THEN
        ALTER TABLE users ADD COLUMN can_approve BOOLEAN DEFAULT true;
        RAISE NOTICE '已添加 can_approve 字段到 users 表';
    ELSE
        RAISE NOTICE 'can_approve 字段已存在';
    END IF;
END $$;

-- 2. 检查 test@example.com 用户的当前权限状态
SELECT 
    id,
    email,
    full_name,
    can_approve,
    role,
    created_at
FROM users
WHERE email = 'test@example.com';

-- 3. 设置 test@example.com 用户的审批权限为 true
UPDATE users 
SET can_approve = true,
    updated_at = NOW()
WHERE email = 'test@example.com';

-- 4. 再次验证权限设置
SELECT 
    id,
    email,
    full_name,
    can_approve,
    role,
    updated_at
FROM users
WHERE email = 'test@example.com';

-- 5. 为所有现有用户设置默认审批权限（如果为NULL）
UPDATE users 
SET can_approve = true,
    updated_at = NOW()
WHERE can_approve IS NULL;

-- 6. 验证所有用户的权限状态
SELECT 
    email,
    can_approve,
    CASE 
        WHEN can_approve IS NULL THEN '未设置（将默认为true）'
        WHEN can_approve = true THEN '有权限'
        ELSE '无权限'
    END AS 权限状态
FROM users
ORDER BY email;

