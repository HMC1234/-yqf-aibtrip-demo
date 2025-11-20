-- ============================================
-- 测试所有单号生成函数（改进版）
-- 使用DO块确保所有函数都被调用
-- ============================================

DO $$
DECLARE
    result_text TEXT := '';
BEGIN
    -- 测试1：出差申请单-页面提交
    result_text := result_text || '1. 出差申请单-页面提交: ' || generate_travel_request_no('JD') || E'\n';
    
    -- 测试2：出差申请单-AI对话
    result_text := result_text || '2. 出差申请单-AI对话: ' || generate_travel_request_no('AI') || E'\n';
    
    -- 测试3：预订单-经典预订
    result_text := result_text || '3. 预订单-经典预订: ' || generate_order_no('classic') || E'\n';
    
    -- 测试4：预订单-AI推荐一键预订
    result_text := result_text || '4. 预订单-AI推荐一键预订: ' || generate_order_no('ai_recommendation') || E'\n';
    
    -- 测试5：AI推荐-申请单自动推荐
    result_text := result_text || '5. AI推荐-申请单自动推荐: ' || generate_recommendation_no('ZDT') || E'\n';
    
    -- 测试6：AI推荐-申请单重新推荐
    result_text := result_text || '6. AI推荐-申请单重新推荐: ' || generate_recommendation_no('GXH') || E'\n';
    
    -- 测试7：AI推荐-对话生成推荐
    result_text := result_text || '7. AI推荐-对话生成推荐: ' || generate_recommendation_no('AIC') || E'\n';
    
    -- 测试8：AI推荐-对话重新推荐
    result_text := result_text || '8. AI推荐-对话重新推荐: ' || generate_recommendation_no('GXC') || E'\n';
    
    -- 输出所有结果
    RAISE NOTICE '%', result_text;
END $$;

-- ============================================
-- 或者使用表格式输出（推荐）
-- ============================================

-- 创建临时表存储结果
CREATE TEMP TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    业务类型 TEXT,
    生成的单号 TEXT,
    单号规则 TEXT
);

-- 清空临时表
TRUNCATE TABLE test_results;

-- 插入测试结果
INSERT INTO test_results (业务类型, 生成的单号, 单号规则) VALUES
('出差申请单-页面提交', generate_travel_request_no('JD'), 'BTRQ+JD+年月日时分秒+四位顺序号'),
('出差申请单-AI对话', generate_travel_request_no('AI'), 'BTRQ+AI+年月日时分秒+四位顺序号'),
('预订单-经典预订', generate_order_no('classic'), 'BK+TR+年月日时分秒+五位顺序号'),
('预订单-AI推荐一键预订', generate_order_no('ai_recommendation'), 'BK+AI+年月日时分秒+五位顺序号'),
('AI推荐-申请单自动推荐', generate_recommendation_no('ZDT'), 'AIRD+ZDT+年月日时分秒+五位顺序号'),
('AI推荐-申请单重新推荐', generate_recommendation_no('GXH'), 'AIRD+GXH+年月日时分秒+五位顺序号'),
('AI推荐-对话生成推荐', generate_recommendation_no('AIC'), 'AIRD+AIC+年月日时分秒+五位顺序号'),
('AI推荐-对话重新推荐', generate_recommendation_no('GXC'), 'AIRD+GXC+年月日时分秒+五位顺序号');

-- 显示所有结果
SELECT 
    业务类型,
    生成的单号,
    单号规则
FROM test_results
ORDER BY id;

