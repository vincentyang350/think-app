// 首页组件
Alpine.data('homePage', () => ({
    quickRecordText: '',
    pendingFlashes: 0,
    stats: {
        quotes: 0,
        flashes: 0,
        notes: 0,
        collections: 0
    },
    recentCollections: [],
    homeCards: [],
    
    async init() {
        // 从用户设置加载首页卡片配置
        this.loadHomeCards();
        
        // 加载数据
        await this.loadData();
    },
    
    loadHomeCards() {
        const saved = localStorage.getItem('homeCards');
        if (saved) {
            this.homeCards = JSON.parse(saved);
        } else {
            // 默认配置（根据设备）
            const isMobile = window.innerWidth < 768;
            this.homeCards = isMobile 
                ? ['quick_record', 'pending_flashes']
                : ['quick_record', 'statistics', 'pending_flashes', 'recent_collections'];
        }
    },
    
    async loadData() {
        // TODO: 从Supabase加载数据
        // 这里先用模拟数据
        this.pendingFlashes = 5;
        this.stats = {
            quotes: 128,
            flashes: 15,
            notes: 42,
            collections: 8
        };
        this.recentCollections = [
            { id: 1, name: '产品思维', quoteCount: 12 },
            { id: 2, name: '品牌建设', quoteCount: 8 }
        ];
    },
    
    async saveFlash() {
        if (!this.quickRecordText.trim()) return;
        
        // TODO: 调用Supabase API保存闪念
        console.log('保存闪念:', this.quickRecordText);
        
        // 清空输入框
        this.quickRecordText = '';
        
        // 重新加载数据
        await this.loadData();
    },
    
    async saveQuote() {
        if (!this.quickRecordText.trim()) return;
        
        // TODO: 调用Supabase API保存金句
        console.log('保存金句:', this.quickRecordText);
        
        // 清空输入框
        this.quickRecordText = '';
        
        // 重新加载数据
        await this.loadData();
    },
    
    navigateToPage(page) {
        // 触发父组件的页面切换
        this.$dispatch('navigate', { page });
    }
}));

// 模板HTML（需要插入到主页面中）
const homePageTemplate = `
<template x-data="homePage">
    <div class="space-y-6">
        <!-- 欢迎语 -->
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            欢迎回来
        </h1>
        
        <!-- 快速记录卡片 -->
        <template x-if="homeCards.includes('quick_record')">
            <div class="glass rounded-xl p-6 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速记录</h2>
                <textarea 
                    x-model="quickRecordText"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="说出你的想法、观察或判断..."
                ></textarea>
                <div class="flex gap-3 mt-3">
                    <button 
                        @click="saveFlash()"
                        class="flex-1 py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                        存闪念
                    </button>
                    <button 
                        @click="saveQuote()"
                        class="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        存金句
                    </button>
                </div>
            </div>
        </template>
        
        <!-- 统计概览（仅电脑端） -->
        <template x-if="homeCards.includes('statistics') && !isMobile()">
            <div class="glass rounded-xl p-6 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">统计概览</h2>
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400" x-text="stats.quotes"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">金句</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400" x-text="stats.flashes"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">闪念</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400" x-text="stats.notes"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">笔记</div>
                    </div>
                    <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400" x-text="stats.collections"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">项目</div>
                    </div>
                </div>
            </div>
        </template>
        
        <!-- 待处理 -->
        <template x-if="homeCards.includes('pending_flashes')">
            <div class="glass rounded-xl p-6 bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
                 @click="navigateToPage('flashes')">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">待处理 (闪念→金句)</h2>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600 dark:text-gray-400">有</span>
                    <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400" x-text="pendingFlashes"></span>
                    <span class="text-gray-600 dark:text-gray-400">条闪念未处理</span>
                    <span class="text-gray-400">→</span>
                </div>
            </div>
        </template>
        
        <!-- 最近使用（仅电脑端） -->
        <template x-if="homeCards.includes('recent_collections') && !isMobile()">
            <div class="glass rounded-xl p-6 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">最近使用</h2>
                <div class="space-y-3">
                    <template x-for="collection in recentCollections" :key="collection.id">
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <span class="text-gray-900 dark:text-white" x-text="collection.name"></span>
                            <span class="text-sm text-gray-500 dark:text-gray-400" x-text="collection.quoteCount + ' 条金句'"></span>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
`;
