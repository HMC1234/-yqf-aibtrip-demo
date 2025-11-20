-- ============================================
-- 诊断脚本 - 检查数据库状态
-- 执行此脚本查看问题所在
-- ============================================

-- 1. 检查sequence_numbers表是否存在
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sequence_numbers')
        THEN '✅ sequence_numbers表存在'
        ELSE '❌ sequence_numbers表不存在'
    END AS table_status;

-- 2. 检查函数是否存在
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name IN ('generate_travel_request_no', 'generate_order_no', 'generate_recommendation_no')
        THEN '✅ 存在'
        ELSE '❌ 不存在'
    END AS status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('generate_travel_request_no', 'generate_order_no', 'generate_recommendation_no');

-- 3. 检查sequence_numbers表结构
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'sequence_numbers'
ORDER BY ordinal_position;

-- 4. 检查sequence_numbers表是否有唯一约束
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'sequence_numbers';

-- 5. 尝试手动插入一条测试数据
INSERT INTO sequence_numbers (prefix, date_str, sequence)
VALUES ('TEST', TO_CHAR(NOW(), 'YYYYMMDD'), 1)
ON CONFLICT (prefix, date_str)
DO UPDATE SET sequence = sequence_numbers.sequence + 1
RETURNING *;

-- 6. 查看sequence_numbers表中的数据
SELECT * FROM sequence_numbers ORDER BY created_at DESC LIMIT 10;

-- 7. 测试函数（如果存在）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'generate_travel_request_no') THEN
        RAISE NOTICE 'Testing generate_travel_request_no: %', generate_travel_request_no('JD');
    ELSE
        RAISE NOTICE 'Function generate_travel_request_no does not exist';
    END IF;
END $$;

