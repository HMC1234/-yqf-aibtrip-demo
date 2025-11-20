-- ============================================
-- 测试所有单号生成函数（合并结果）
-- ============================================
-- 使用UNION ALL将所有结果合并到一个结果集中

SELECT 
    '出差申请单-页面提交' AS 业务类型,
    generate_travel_request_no('JD') AS 生成的单号,
    'BTRQ+JD+年月日时分秒+四位顺序号' AS 单号规则
UNION ALL
SELECT 
    '出差申请单-AI对话' AS 业务类型,
    generate_travel_request_no('AI') AS 生成的单号,
    'BTRQ+AI+年月日时分秒+四位顺序号' AS 单号规则
UNION ALL
SELECT 
    '预订单-经典预订' AS 业务类型,
    generate_order_no('classic') AS 生成的单号,
    'BK+TR+年月日时分秒+五位顺序号' AS 单号规则
UNION ALL
SELECT 
    '预订单-AI推荐一键预订' AS 业务类型,
    generate_order_no('ai_recommendation') AS 生成的单号,
    'BK+AI+年月日时分秒+五位顺序号' AS 单号规则
UNION ALL
SELECT 
    'AI推荐-申请单自动推荐' AS 业务类型,
    generate_recommendation_no('ZDT') AS 生成的单号,
    'AIRD+ZDT+年月日时分秒+五位顺序号' AS 单号规则
UNION ALL
SELECT 
    'AI推荐-申请单重新推荐' AS 业务类型,
    generate_recommendation_no('GXH') AS 生成的单号,
    'AIRD+GXH+年月日时分秒+五位顺序号' AS 单号规则
UNION ALL
SELECT 
    'AI推荐-对话生成推荐' AS 业务类型,
    generate_recommendation_no('AIC') AS 生成的单号,
    'AIRD+AIC+年月日时分秒+五位顺序号' AS 单号规则
UNION ALL
SELECT 
    'AI推荐-对话重新推荐' AS 业务类型,
    generate_recommendation_no('GXC') AS 生成的单号,
    'AIRD+GXC+年月日时分秒+五位顺序号' AS 单号规则
ORDER BY 业务类型;

-- ============================================
-- 验证单号格式
-- ============================================
-- 单号应该符合以下格式：
-- 出差申请单：BTRQ+JD/AI+年月日时分秒+四位顺序号
-- 预订单：BK+TR/AI+年月日时分秒+五位顺序号
-- AI推荐：AIRD+ZDT/GXH/AIC/GXC+年月日时分秒+五位顺序号

-- ============================================
-- 测试多次调用（验证顺序号递增）
-- ============================================
SELECT generate_travel_request_no('JD') AS test1;
SELECT generate_travel_request_no('JD') AS test2;
SELECT generate_travel_request_no('JD') AS test3;
-- 顺序号应该递增：00001, 00002, 00003...

