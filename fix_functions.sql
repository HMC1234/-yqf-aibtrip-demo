-- ============================================
-- 修复单号生成函数
-- 如果函数测试失败，执行此脚本
-- ============================================

-- 1. 首先检查sequence_numbers表是否存在
-- 如果不存在，创建它
CREATE TABLE IF NOT EXISTS sequence_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prefix VARCHAR(20) NOT NULL,
    date_str VARCHAR(8) NOT NULL,
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prefix, date_str)
);

CREATE INDEX IF NOT EXISTS idx_sequence_numbers_prefix_date ON sequence_numbers(prefix, date_str);

-- 2. 删除旧函数（如果存在）
DROP FUNCTION IF EXISTS generate_travel_request_no(VARCHAR);
DROP FUNCTION IF EXISTS generate_order_no(VARCHAR);
DROP FUNCTION IF EXISTS generate_recommendation_no(VARCHAR);

-- 3. 重新创建函数（修复版本）

-- 生成出差申请单号
CREATE OR REPLACE FUNCTION generate_travel_request_no(
    source_type VARCHAR -- 'JD' 或 'AI'
) RETURNS VARCHAR AS $$
DECLARE
    v_date_str VARCHAR(8);
    v_time_str VARCHAR(6);
    v_prefix VARCHAR(20);
    seq_num INTEGER;
    result_no VARCHAR(50);
BEGIN
    v_date_str := TO_CHAR(NOW(), 'YYYYMMDD');
    v_time_str := TO_CHAR(NOW(), 'HH24MISS');
    v_prefix := 'BTRQ+' || source_type;
    
    -- 获取或创建序列号
    INSERT INTO sequence_numbers (prefix, date_str, sequence)
    VALUES (v_prefix, v_date_str, 1)
    ON CONFLICT (prefix, date_str)
    DO UPDATE SET sequence = sequence_numbers.sequence + 1
    RETURNING sequence INTO seq_num;
    
    result_no := v_prefix || '+' || v_date_str || v_time_str || '+' || LPAD(seq_num::TEXT, 4, '0');
    RETURN result_no;
END;
$$ LANGUAGE plpgsql;

-- 生成预订单号
CREATE OR REPLACE FUNCTION generate_order_no(
    booking_source VARCHAR DEFAULT 'classic' -- 'classic' 或 'ai_recommendation'
) RETURNS VARCHAR AS $$
DECLARE
    v_date_str VARCHAR(8);
    v_time_str VARCHAR(6);
    v_prefix VARCHAR(20);
    seq_num INTEGER;
    result_no VARCHAR(50);
BEGIN
    v_date_str := TO_CHAR(NOW(), 'YYYYMMDD');
    v_time_str := TO_CHAR(NOW(), 'HH24MISS');
    
    -- 根据预订来源确定前缀
    IF booking_source = 'ai_recommendation' THEN
        v_prefix := 'BK+AI';
    ELSE
        v_prefix := 'BK+TR';
    END IF;
    
    INSERT INTO sequence_numbers (prefix, date_str, sequence)
    VALUES (v_prefix, v_date_str, 1)
    ON CONFLICT (prefix, date_str)
    DO UPDATE SET sequence = sequence_numbers.sequence + 1
    RETURNING sequence INTO seq_num;
    
    result_no := v_prefix || '+' || v_date_str || v_time_str || '+' || LPAD(seq_num::TEXT, 5, '0');
    RETURN result_no;
END;
$$ LANGUAGE plpgsql;

-- 生成AI推荐单号
CREATE OR REPLACE FUNCTION generate_recommendation_no(
    source_type VARCHAR -- 'ZDT', 'GXH', 'AIC', 'GXC'
) RETURNS VARCHAR AS $$
DECLARE
    v_date_str VARCHAR(8);
    v_time_str VARCHAR(6);
    v_prefix VARCHAR(20);
    seq_num INTEGER;
    result_no VARCHAR(50);
BEGIN
    v_date_str := TO_CHAR(NOW(), 'YYYYMMDD');
    v_time_str := TO_CHAR(NOW(), 'HH24MISS');
    v_prefix := 'AIRD+' || source_type;
    
    INSERT INTO sequence_numbers (prefix, date_str, sequence)
    VALUES (v_prefix, v_date_str, 1)
    ON CONFLICT (prefix, date_str)
    DO UPDATE SET sequence = sequence_numbers.sequence + 1
    RETURNING sequence INTO seq_num;
    
    result_no := v_prefix || '+' || v_date_str || v_time_str || '+' || LPAD(seq_num::TEXT, 5, '0');
    RETURN result_no;
END;
$$ LANGUAGE plpgsql;

-- 4. 测试函数
SELECT 'Testing functions...' AS status;

-- 测试生成出差申请单号
SELECT generate_travel_request_no('JD') AS travel_request_no_jd;
SELECT generate_travel_request_no('AI') AS travel_request_no_ai;

-- 测试生成预订单号
SELECT generate_order_no('classic') AS order_no_classic;
SELECT generate_order_no('ai_recommendation') AS order_no_ai;

-- 测试生成AI推荐单号
SELECT generate_recommendation_no('ZDT') AS recommendation_no_zdt;
SELECT generate_recommendation_no('GXH') AS recommendation_no_gxh;
SELECT generate_recommendation_no('AIC') AS recommendation_no_aic;
SELECT generate_recommendation_no('GXC') AS recommendation_no_gxc;

