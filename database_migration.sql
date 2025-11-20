-- ============================================
-- YQFAIBTRIP 数据库迁移脚本
-- 版本: v1.0
-- 创建日期: 2024-12-19
-- 说明: 创建所有表、函数、触发器、RLS策略和初始化数据
-- ============================================

-- ============================================
-- 1. 启用扩展
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 创建数据表
-- ============================================

-- 2.1 用户相关表

-- 2.1.1 companies (公司表)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(code);

-- 2.1.2 departments (部门表)
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    parent_id UUID REFERENCES departments(id),
    manager_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_departments_company_id ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON departments(parent_id);

-- 2.1.3 cost_centers (成本中心表)
CREATE TABLE IF NOT EXISTS cost_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    budget_limit DECIMAL(12,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cost_centers_company_id ON cost_centers(company_id);
CREATE INDEX IF NOT EXISTS idx_cost_centers_code ON cost_centers(code);

-- 2.1.4 users (用户表)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    company_id UUID REFERENCES companies(id),
    department_id UUID REFERENCES departments(id),
    cost_center_id UUID REFERENCES cost_centers(id),
    role VARCHAR(50) DEFAULT 'employee',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 2.2 出差申请相关表

-- 2.2.1 travel_requests (出差申请单表)
CREATE TABLE IF NOT EXISTS travel_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    department_id UUID REFERENCES departments(id),
    cost_center_id UUID NOT NULL REFERENCES cost_centers(id),
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    reason TEXT NOT NULL,
    products JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(50) DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CHECK (return_date >= departure_date)
);

CREATE INDEX IF NOT EXISTS idx_travel_requests_user_id ON travel_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_requests_status ON travel_requests(status);
CREATE INDEX IF NOT EXISTS idx_travel_requests_request_no ON travel_requests(request_no);
CREATE INDEX IF NOT EXISTS idx_travel_requests_company_id ON travel_requests(company_id);

-- 2.2.2 approval_records (审批记录表)
CREATE TABLE IF NOT EXISTS approval_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    travel_request_id UUID NOT NULL REFERENCES travel_requests(id),
    approver_id UUID NOT NULL REFERENCES users(id),
    approval_level INTEGER DEFAULT 1,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_records_travel_request_id ON approval_records(travel_request_id);
CREATE INDEX IF NOT EXISTS idx_approval_records_approver_id ON approval_records(approver_id);

-- 2.3 预订相关表

-- 2.3.1 orders (预订单表)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    travel_request_id UUID REFERENCES travel_requests(id),
    ai_recommendation_id UUID,
    product_type VARCHAR(50) NOT NULL,
    product_details JSONB NOT NULL,
    origin VARCHAR(100),
    destination VARCHAR(100),
    departure_date DATE,
    return_date DATE,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'CNY',
    status VARCHAR(50) DEFAULT 'pending',
    booking_source VARCHAR(50) DEFAULT 'classic',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_travel_request_id ON orders(travel_request_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 2.3.2 search_records (用户搜索记录表)
CREATE TABLE IF NOT EXISTS search_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_type VARCHAR(50) NOT NULL,
    origin VARCHAR(100),
    destination VARCHAR(100),
    departure_date DATE,
    return_date DATE,
    check_in_date DATE,
    check_out_date DATE,
    passenger_count INTEGER DEFAULT 1,
    search_params JSONB,
    search_source VARCHAR(50) DEFAULT 'independent',
    travel_request_id UUID REFERENCES travel_requests(id),
    has_order BOOLEAN DEFAULT false,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_search_records_user_id ON search_records(user_id);
CREATE INDEX IF NOT EXISTS idx_search_records_product_type ON search_records(product_type);
CREATE INDEX IF NOT EXISTS idx_search_records_created_at ON search_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_records_travel_request_id ON search_records(travel_request_id);
CREATE INDEX IF NOT EXISTS idx_search_records_destination ON search_records(destination);
CREATE INDEX IF NOT EXISTS idx_search_records_user_product ON search_records(user_id, product_type);

-- 2.4 AI推荐相关表

-- 2.4.1 ai_recommendations (AI推荐方案表)
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    travel_request_id UUID REFERENCES travel_requests(id),
    source VARCHAR(50) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    keywords JSONB,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    products JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'generated',
    generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_travel_request_id ON ai_recommendations(travel_request_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_recommendation_no ON ai_recommendations(recommendation_no);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);

-- 2.4.2 recommendation_details (推荐方案详情表)
CREATE TABLE IF NOT EXISTS recommendation_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_recommendation_id UUID NOT NULL REFERENCES ai_recommendations(id),
    option_index INTEGER NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    product_data JSONB NOT NULL,
    keywords TEXT[],
    reason TEXT,
    price DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'CNY',
    policy_compliance BOOLEAN DEFAULT true,
    score DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendation_details_ai_recommendation_id ON recommendation_details(ai_recommendation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_details_product_type ON recommendation_details(product_type);

-- 2.4.3 chat_messages (对话记录表)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 2.4.4 keywords (关键字表)
CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_keywords_category ON keywords(category);
CREATE INDEX IF NOT EXISTS idx_keywords_priority ON keywords(priority DESC);

-- 2.5 差旅政策相关表

-- 2.5.1 travel_policies (差旅政策表)
CREATE TABLE IF NOT EXISTS travel_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    policy_name VARCHAR(200) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    policy_rules JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_travel_policies_company_id ON travel_policies(company_id);
CREATE INDEX IF NOT EXISTS idx_travel_policies_policy_type ON travel_policies(policy_type);

-- 2.6 系统配置表

-- 2.6.1 sequence_numbers (单号序列表)
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

-- ============================================
-- 3. 创建数据库函数
-- ============================================

-- 3.1 自动更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.2 单号生成函数

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

-- ============================================
-- 4. 创建触发器
-- ============================================

-- 为所有表添加自动更新时间戳触发器
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_centers_updated_at BEFORE UPDATE ON cost_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_requests_updated_at BEFORE UPDATE ON travel_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_records_updated_at BEFORE UPDATE ON approval_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON keywords
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_policies_updated_at BEFORE UPDATE ON travel_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequence_numbers_updated_at BEFORE UPDATE ON sequence_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 启用Row Level Security (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. 创建RLS策略
-- ============================================

-- 用户只能查看自己的数据
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own travel requests" ON travel_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own search records" ON search_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search records" ON search_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own search records" ON search_records
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON ai_recommendations
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 7. 初始化数据
-- ============================================

-- 7.1 插入测试公司
INSERT INTO companies (id, name, code) 
VALUES ('00000000-0000-0000-0000-000000000001', '测试公司', 'TEST001')
ON CONFLICT (id) DO NOTHING;

-- 7.2 插入测试部门
INSERT INTO departments (id, company_id, name, code)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '技术部', 'TECH001')
ON CONFLICT (id) DO NOTHING;

-- 7.3 插入测试成本中心
INSERT INTO cost_centers (id, company_id, code, name)
VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'CC001', '技术成本中心')
ON CONFLICT (id) DO NOTHING;

-- 7.4 插入预设关键字数据
INSERT INTO keywords (category, keyword, description, priority) VALUES
-- 机票关键字
('flight', '选择大飞机', '优先选择大型客机', 10),
('flight', '上午最低价', '选择上午时段最低价格航班', 9),
('flight', '下午出发', '优先选择下午出发的航班', 8),
('flight', '直飞优先', '优先选择直飞航班', 10),
('flight', '经济舱', '选择经济舱', 5),
('flight', '商务舱', '选择商务舱', 7),
('flight', '头等舱', '选择头等舱', 9),
('flight', '最短飞行时间', '优先选择飞行时间最短的航班', 9),
('flight', '最低价格', '优先选择价格最低的航班', 10),
-- 酒店关键字
('hotel', '五星级酒店', '选择五星级酒店', 10),
('hotel', '四星级酒店', '选择四星级酒店', 8),
('hotel', '市中心位置', '优先选择市中心位置的酒店', 9),
('hotel', '机场附近', '优先选择机场附近的酒店', 7),
('hotel', '最低价格', '优先选择价格最低的酒店', 10),
('hotel', '最高评分', '优先选择评分最高的酒店', 9),
('hotel', '含早餐', '选择含早餐的酒店', 6),
('hotel', '免费WiFi', '选择提供免费WiFi的酒店', 5),
('hotel', '健身房', '选择有健身房的酒店', 4),
('hotel', '商务中心', '选择有商务中心的酒店', 5),
-- 火车票关键字
('train', '高铁优先', '优先选择高铁', 10),
('train', '动车优先', '优先选择动车', 8),
('train', '最短时间', '优先选择时间最短的车次', 9),
('train', '最低价格', '优先选择价格最低的车次', 10),
('train', '商务座', '选择商务座', 7),
('train', '一等座', '选择一等座', 6),
-- 用车关键字
('car', '经济型', '选择经济型车辆', 5),
('car', '舒适型', '选择舒适型车辆', 7),
('car', '豪华型', '选择豪华型车辆', 9),
('car', '7座商务车', '选择7座商务车', 8),
('car', '专车服务', '选择专车服务', 10)
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. 创建视图
-- ============================================

-- 用户完整信息视图
CREATE OR REPLACE VIEW v_user_full_info AS
SELECT 
    u.id,
    u.email,
    u.username,
    u.full_name,
    u.phone,
    c.name AS company_name,
    d.name AS department_name,
    cc.name AS cost_center_name,
    u.role,
    u.is_active
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN cost_centers cc ON u.cost_center_id = cc.id
WHERE u.deleted_at IS NULL;

-- 出差申请单详情视图
CREATE OR REPLACE VIEW v_travel_request_detail AS
SELECT 
    tr.id,
    tr.request_no,
    tr.origin,
    tr.destination,
    tr.departure_date,
    tr.return_date,
    tr.reason,
    tr.products,
    tr.status,
    u.full_name AS applicant_name,
    c.name AS company_name,
    d.name AS department_name,
    cc.name AS cost_center_name,
    tr.created_at,
    tr.updated_at
FROM travel_requests tr
LEFT JOIN users u ON tr.user_id = u.id
LEFT JOIN companies c ON tr.company_id = c.id
LEFT JOIN departments d ON tr.department_id = d.id
LEFT JOIN cost_centers cc ON tr.cost_center_id = cc.id
WHERE tr.deleted_at IS NULL;

-- ============================================
-- 完成
-- ============================================
-- 数据库迁移脚本执行完成！
-- 所有表、函数、触发器、RLS策略和初始化数据已创建

