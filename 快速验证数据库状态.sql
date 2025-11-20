-- ============================================
-- 快速验证数据库状态
-- ============================================

-- 1. 检查表数量（应该返回14）
SELECT 
    COUNT(*) AS 表数量,
    CASE 
        WHEN COUNT(*) = 14 THEN '✅ 所有表已创建'
        ELSE '❌ 表数量不正确，应该是14张'
    END AS 状态
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 2. 检查函数数量（应该返回4）
SELECT 
    COUNT(*) AS 函数数量,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ 函数已创建'
        ELSE '❌ 函数数量不足'
    END AS 状态
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN ('update_updated_at_column', 'generate_travel_request_no', 'generate_order_no', 'generate_recommendation_no');

-- 3. 检查初始化数据
SELECT 
    'companies' AS 表名,
    COUNT(*) AS 记录数,
    CASE WHEN COUNT(*) >= 1 THEN '✅' ELSE '❌' END AS 状态
FROM companies
UNION ALL
SELECT 
    'departments' AS 表名,
    COUNT(*) AS 记录数,
    CASE WHEN COUNT(*) >= 1 THEN '✅' ELSE '❌' END AS 状态
FROM departments
UNION ALL
SELECT 
    'cost_centers' AS 表名,
    COUNT(*) AS 记录数,
    CASE WHEN COUNT(*) >= 1 THEN '✅' ELSE '❌' END AS 状态
FROM cost_centers
UNION ALL
SELECT 
    'keywords' AS 表名,
    COUNT(*) AS 记录数,
    CASE WHEN COUNT(*) >= 26 THEN '✅' ELSE '❌' END AS 状态
FROM keywords;

-- 4. 检查sequence_numbers表
SELECT 
    COUNT(*) AS 序列记录数,
    'sequence_numbers表' AS 说明
FROM sequence_numbers;

-- 5. 列出所有表名
SELECT 
    table_name AS 表名,
    '✅ 已创建' AS 状态
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

