-- ============================================
-- 创建测试用户脚本
-- ============================================
-- 说明：此脚本需要在Supabase Authentication中先创建用户后执行
-- 步骤：
-- 1. 在Supabase Dashboard中：Authentication → Users → Add user
-- 2. 创建用户：Email = test@example.com, Password = 123456
-- 3. 复制创建的用户ID（UUID格式）
-- 4. 将下面的 [USER_ID_FROM_AUTH] 替换为实际的用户ID
-- 5. 执行此脚本

-- ============================================
-- 步骤1：在users表中插入用户信息
-- ============================================
-- 注意：请先替换 [USER_ID_FROM_AUTH] 为从Authentication中获取的实际用户ID

INSERT INTO users (
    id,
    email,
    username,
    full_name,
    company_id,
    department_id,
    cost_center_id,
    role,
    is_active
) VALUES (
    '447a1da6-82c3-40ad-be57-f4705cddb112',  -- ⚠️ 请替换为实际的用户ID（从Authentication中获取，不需要方括号）
    'test@example.com',
    'test',
    '测试用户',
    '00000000-0000-0000-0000-000000000001',  -- 测试公司ID
    '00000000-0000-0000-0000-000000000002',  -- 测试部门ID
    '00000000-0000-0000-0000-000000000003',  -- 测试成本中心ID
    'employee',
    true
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    company_id = EXCLUDED.company_id,
    department_id = EXCLUDED.department_id,
    cost_center_id = EXCLUDED.cost_center_id,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ============================================
-- 步骤2：验证用户创建成功
-- ============================================

SELECT 
    u.id,
    u.email,
    u.username,
    u.full_name,
    u.role,
    c.name AS company_name,
    d.name AS department_name,
    cc.name AS cost_center_name,
    u.is_active,
    u.created_at
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN cost_centers cc ON u.cost_center_id = cc.id
WHERE u.email = 'test@example.com';

-- ============================================
-- 步骤3：测试用户完整信息视图
-- ============================================

SELECT * FROM v_user_full_info 
WHERE email = 'test@example.com';

