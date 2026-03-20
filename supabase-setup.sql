-- Supabase 数据库初始化脚本
-- 创建数据表和权限

-- 1. 金句表
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category TEXT,
    source TEXT,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 闪念表
CREATE TABLE IF NOT EXISTS flashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 笔记表
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    type TEXT,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 项目/合集表
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 金句与项目的关联表
CREATE TABLE IF NOT EXISTS quote_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(quote_id, collection_id)
);

-- 启用 RLS (行级安全)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_collections ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略 (简化版，生产环境应限制)
CREATE POLICY "Allow all" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON flashes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON quote_collections FOR ALL USING (true) WITH CHECK (true);
