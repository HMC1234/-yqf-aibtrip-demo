-- ============================================
-- 快速修复审批权限字段缺失问题
-- ============================================
-- 说明：此脚本会添加 can_approve 字段并设置默认值
-- 执行后等待 10-30 秒让 Supabase schema cache 刷新
-- ============================================

-- 步骤 1: 添加 can_approve 字段（如果不存在）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS can_approve BOOLEAN DEFAULT true;

-- 步骤 2: 为所有现有用户设置默认值（如果为NULL）
UPDATE users 
SET can_approve = true 
WHERE can_approve IS NULL;

-- 步骤 3: 确保 test@example.com 用户有审批权限
UPDATE users 
SET can_approve = true,
    updated_at = NOW()
WHERE email = 'test@example.com';

-- 步骤 4: 验证字段是否添加成功
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'can_approve';

-- 步骤 5: 验证用户权限设置
SELECT 
    email,
    can_approve,
    CASE 
        WHEN can_approve = true THEN '✅ 有权限'
        WHEN can_approve = false THEN '❌ 无权限'
        ELSE '⚠️ 未设置（NULL）'
    END AS 权限状态
FROM users
WHERE email = 'test@example.com';

-- ============================================
-- 执行说明：
-- 1. 在 Supabase SQL Editor 中执行此脚本
-- 2. 等待 10-30 秒让 schema cache 刷新
-- 3. 刷新浏览器页面（Ctrl+F5）
-- 4. 再次尝试切换审批权限开关
-- ============================================

