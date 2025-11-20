-- ============================================
-- 修复RLS策略 - 允许用户插入和更新自己的数据
-- ============================================

-- 1. 允许用户插入自己的出差申请
CREATE POLICY "Users can insert own travel requests" ON travel_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. 允许用户更新自己的出差申请（在审批前）
CREATE POLICY "Users can update own travel requests" ON travel_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. 允许用户插入自己的订单
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. 允许用户更新自己的订单
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. 允许用户插入自己的AI推荐方案
CREATE POLICY "Users can insert own recommendations" ON ai_recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. 允许用户更新自己的AI推荐方案
CREATE POLICY "Users can update own recommendations" ON ai_recommendations
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. 允许用户插入推荐方案详情（通过推荐方案关联）
CREATE POLICY "Users can insert recommendation details" ON recommendation_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM ai_recommendations 
            WHERE ai_recommendations.id = recommendation_details.ai_recommendation_id 
            AND ai_recommendations.user_id = auth.uid()
        )
    );

-- 8. 允许用户查看推荐方案详情（通过推荐方案关联）
CREATE POLICY "Users can view recommendation details" ON recommendation_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ai_recommendations 
            WHERE ai_recommendations.id = recommendation_details.ai_recommendation_id 
            AND ai_recommendations.user_id = auth.uid()
        )
    );

-- 9. 允许用户查看自己的审批记录
CREATE POLICY "Users can view own approval records" ON approval_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM travel_requests 
            WHERE travel_requests.id = approval_records.travel_request_id 
            AND travel_requests.user_id = auth.uid()
        )
    );

-- 10. 允许用户插入自己的搜索记录
CREATE POLICY "Users can insert own search records" ON search_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. 允许用户更新自己的搜索记录
CREATE POLICY "Users can update own search records" ON search_records
    FOR UPDATE USING (auth.uid() = user_id);

-- 12. 验证策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('travel_requests', 'orders', 'ai_recommendations', 'recommendation_details', 'approval_records', 'search_records')
ORDER BY tablename, policyname;

