-- ============================================
-- 一键设置审批权限（推荐使用）
-- ============================================
-- 说明：此脚本会自动检查和设置所有必要的权限
-- 适用于：test@example.com 用户看不到审批按钮的问题
-- ============================================

-- 步骤 1: 确保 can_approve 字段存在
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

-- 步骤 4: 验证设置结果
SELECT 
    email,
    can_approve,
    CASE 
        WHEN can_approve = true THEN '✅ 有权限'
        WHEN can_approve = false THEN '❌ 无权限'
        ELSE '⚠️ 未设置（NULL）'
    END AS 权限状态,
    updated_at AS 最后更新时间
FROM users
WHERE email = 'test@example.com';

-- 如果上面的查询结果显示 "✅ 有权限"，说明设置成功！
-- 请刷新浏览器页面或重新登录，即可看到审批按钮。

