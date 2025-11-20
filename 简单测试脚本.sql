-- ============================================
-- 最简单的测试方法：逐个执行
-- ============================================
-- 在Supabase SQL Editor中，可以选中每个SELECT语句单独执行
-- 或者一次性执行所有语句（可能会显示多个结果）

-- 测试1
SELECT '1. 出差申请单-页面提交' AS 说明, generate_travel_request_no('JD') AS 单号;

-- 测试2
SELECT '2. 出差申请单-AI对话' AS 说明, generate_travel_request_no('AI') AS 单号;

-- 测试3
SELECT '3. 预订单-经典预订' AS 说明, generate_order_no('classic') AS 单号;

-- 测试4
SELECT '4. 预订单-AI推荐一键预订' AS 说明, generate_order_no('ai_recommendation') AS 单号;

-- 测试5
SELECT '5. AI推荐-申请单自动推荐' AS 说明, generate_recommendation_no('ZDT') AS 单号;

-- 测试6
SELECT '6. AI推荐-申请单重新推荐' AS 说明, generate_recommendation_no('GXH') AS 单号;

-- 测试7
SELECT '7. AI推荐-对话生成推荐' AS 说明, generate_recommendation_no('AIC') AS 单号;

-- 测试8
SELECT '8. AI推荐-对话重新推荐' AS 说明, generate_recommendation_no('GXC') AS 单号;

