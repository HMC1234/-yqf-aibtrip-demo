-- ============================================
-- 单独测试每个函数（如果上面的合并查询有问题，可以用这个）
-- ============================================
-- 注意：在Supabase SQL Editor中，需要逐个执行每个SELECT语句
-- 或者选中所有语句一起执行

-- 测试1：生成出差申请单号（页面提交）
SELECT 
    '测试1：出差申请单-页面提交' AS 说明,
    generate_travel_request_no('JD') AS 生成的单号;

-- 测试2：生成出差申请单号（AI对话）
SELECT 
    '测试2：出差申请单-AI对话' AS 说明,
    generate_travel_request_no('AI') AS 生成的单号;

-- 测试3：生成预订单号（经典预订）
SELECT 
    '测试3：预订单-经典预订' AS 说明,
    generate_order_no('classic') AS 生成的单号;

-- 测试4：生成预订单号（AI推荐一键预订）
SELECT 
    '测试4：预订单-AI推荐一键预订' AS 说明,
    generate_order_no('ai_recommendation') AS 生成的单号;

-- 测试5：生成AI推荐单号（申请单自动推荐）
SELECT 
    '测试5：AI推荐-申请单自动推荐' AS 说明,
    generate_recommendation_no('ZDT') AS 生成的单号;

-- 测试6：生成AI推荐单号（申请单重新推荐）
SELECT 
    '测试6：AI推荐-申请单重新推荐' AS 说明,
    generate_recommendation_no('GXH') AS 生成的单号;

-- 测试7：生成AI推荐单号（对话生成推荐）
SELECT 
    '测试7：AI推荐-对话生成推荐' AS 说明,
    generate_recommendation_no('AIC') AS 生成的单号;

-- 测试8：生成AI推荐单号（对话重新推荐）
SELECT 
    '测试8：AI推荐-对话重新推荐' AS 说明,
    generate_recommendation_no('GXC') AS 生成的单号;

