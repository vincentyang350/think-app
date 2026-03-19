// Supabase数据库服务模块

class SupabaseService {
    constructor() {
        this.client = null;
        this.supabaseUrl = localStorage.getItem('supabase_url') || '';
        this.supabaseKey = localStorage.getItem('supabase_key') || '';
    }
    
    /**
     * 初始化Supabase客户端
     */
    async init(url = null, key = null) {
        if (url) this.supabaseUrl = url;
        if (key) this.supabaseKey = key;
        
        if (this.supabaseUrl && this.supabaseKey) {
            this.client = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            localStorage.setItem('supabase_url', this.supabaseUrl);
            localStorage.setItem('supabase_key', this.supabaseKey);
            return true;
        }
        return false;
    }
    
    /**
     * 检查是否已初始化
     */
    isInitialized() {
        return this.client !== null;
    }
    
    // ==================== 金句操作 ====================
    
    /**
     * 获取所有金句
     */
    async getQuotes(filters = {}) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        let query = this.client.from('quotes').select('*');
        
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        
        if (filters.source) {
            query = query.eq('source', filters.source);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 获取单个金句
     */
    async getQuote(id) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('quotes')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 创建金句
     */
    async createQuote(quote) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('quotes')
            .insert([{
                content: quote.content,
                original_text: quote.originalText,
                refined_text: quote.refinedText,
                category: quote.category,
                source: quote.source,
                tags: quote.tags || []
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 更新金句
     */
    async updateQuote(id, updates) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('quotes')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 删除金句
     */
    async deleteQuote(id) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { error } = await this.client
            .from('quotes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }
    
    // ==================== 闪念操作 ====================
    
    /**
     * 获取所有闪念
     */
    async getFlashes() {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('flashes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 创建闪念
     */
    async createFlash(flash) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('flashes')
            .insert([{
                original_text: flash.originalText,
                refined_text: flash.refinedText,
                category: flash.category,
                source: flash.source,
                tags: flash.tags || []
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 更新闪念
     */
    async updateFlash(id, updates) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('flashes')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 删除闪念
     */
    async deleteFlash(id) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { error } = await this.client
            .from('flashes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }
    
    // ==================== 笔记操作 ====================
    
    /**
     * 获取金句的关联笔记
     */
    async getNotesByQuote(quoteId) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('notes')
            .select('*')
            .eq('quote_id', quoteId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 获取所有笔记
     */
    async getNotes() {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 创建笔记
     */
    async createNote(note) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('notes')
            .insert([{
                content: note.content,
                type: note.type,
                quote_id: note.quoteId,
                collection_ids: note.collectionIds || []
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 删除笔记
     */
    async deleteNote(id) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { error } = await this.client
            .from('notes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }
    
    // ==================== 项目（合集）操作 ====================
    
    /**
     * 获取所有项目
     */
    async getCollections() {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('collections')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 创建项目
     */
    async createCollection(collection) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { data, error } = await this.client
            .from('collections')
            .insert([{
                name: collection.name,
                description: collection.description
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * 获取项目的金句数量
     */
    async getCollectionQuoteCount(collectionId) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { count, error } = await this.client
            .from('quote_collections')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collectionId);
        
        if (error) throw error;
        return count || 0;
    }
    
    /**
     * 将金句添加到项目
     */
    async addQuoteToCollection(quoteId, collectionId) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { error } = await this.client
            .from('quote_collections')
            .insert([{
                quote_id: quoteId,
                collection_id: collectionId
            }]);
        
        if (error) throw error;
    }
    
    /**
     * 从项目移除金句
     */
    async removeQuoteFromCollection(quoteId, collectionId) {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const { error } = await this.client
            .from('quote_collections')
            .delete()
            .eq('quote_id', quoteId)
            .eq('collection_id', collectionId);
        
        if (error) throw error;
    }
    
    // ==================== 统计信息 ====================
    
    /**
     * 获取统计信息
     */
    async getStats() {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        const [quotes, flashes, notes, collections] = await Promise.all([
            this.client.from('quotes').select('*', { count: 'exact', head: true }),
            this.client.from('flashes').select('*', { count: 'exact', head: true }),
            this.client.from('notes').select('*', { count: 'exact', head: true }),
            this.client.from('collections').select('*', { count: 'exact', head: true })
        ]);
        
        return {
            quotes: quotes.count || 0,
            flashes: flashes.count || 0,
            notes: notes.count || 0,
            collections: collections.count || 0
        };
    }
    
    /**
     * 获取待处理闪念数量
     */
    async getPendingFlashesCount() {
        if (!this.isInitialized()) throw new Error('Supabase未初始化');
        
        // 简单实现：返回所有闪念数量
        const { count, error } = await this.client
            .from('flashes')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return count || 0;
    }
}

// 创建全局实例
window.supabaseService = new SupabaseService();
