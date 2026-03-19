// AI服务模块 - 集成DeepSeek API

class AIService {
    constructor() {
        this.baseUrl = 'https://api.deepseek.com/v1';
        this.apiKey = localStorage.getItem('deepseek_api_key') || '';
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('deepseek_api_key', apiKey);
    }
    
    getApiKey() {
        return this.apiKey;
    }
    
    /**
     * 调用DeepSeek API
     */
    async callAPI(messages, model = 'deepseek-chat', temperature = 0.7) {
        if (!this.apiKey) {
            throw new Error('请先设置DeepSeek API Key');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: temperature
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API调用失败');
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI API调用错误:', error);
            throw error;
        }
    }
    
    /**
     * AI提炼：修改错别字，优化文字表达
     */
    async refineText(text, category, source) {
        const messages = [
            {
                role: 'system',
                content: '你是一个专业的文字编辑，擅长修改错别字和优化文字表达。请保持原意，让文字更清晰、更有力。'
            },
            {
                role: 'user',
                content: `请帮我提炼和优化这段文字（分类：${category}，来源：${source}）：\n\n${text}`
            }
        ];
        
        return await this.callAPI(messages, 'deepseek-chat', 0.3);
    }
    
    /**
     * 场景化叙述：用故事重新表达这条判断
     */
    async generateScenario(quote) {
        const messages = [
            {
                role: 'system',
                content: '你是一个擅长讲故事的人，能够将抽象的判断和观点用生动的故事和场景表达出来。'
            },
            {
                role: 'user',
                content: `请用一个小故事或场景来重新表达这条判断，让读者更容易理解和共鸣：\n\n${quote.content}`
            }
        ];
        
        return await this.callAPI(messages);
    }
    
    /**
     * 商业化应用：推荐可落地的商业思路
     */
    async generateCommercial(quote) {
        const messages = [
            {
                role: 'system',
                content: '你是一个商业顾问，擅长从观点中提炼出可落地的商业思路和策略。'
            },
            {
                role: 'user',
                content: `请基于这条判断，推荐3-5个可落地的商业思路或应用场景：\n\n${quote.content}`
            }
        ];
        
        return await this.callAPI(messages);
    }
    
    /**
     * 找同行者：名人/书籍/真实案例印证
     */
    async findPeers(quote) {
        const messages = [
            {
                role: 'system',
                content: '你是一个博学的研究者，熟悉各领域的名人观点、经典书籍和真实案例。'
            },
            {
                role: 'user',
                content: `请找出3-5个支持或印证这条判断的名人观点、经典书籍或真实案例，并简要说明：\n\n${quote.content}`
            }
        ];
        
        return await this.callAPI(messages);
    }
    
    /**
     * 挑战观点：边界测试 + 反面案例
     */
    async challengeView(quote) {
        const messages = [
            {
                role: 'system',
                content: '你是一个批判性思考者，善于发现观点的边界条件和反面案例。'
            },
            {
                role: 'user',
                content: `请对这条判断进行批判性思考，指出它的边界条件、适用场景，以及可能的反面案例：\n\n${quote.content}`
            }
        ];
        
        return await this.callAPI(messages);
    }
    
    /**
     * 自由对话：直接和 AI 聊这条判断
     */
    async chatAboutQuote(quote, userMessage, chatHistory = []) {
        const messages = [
            {
                role: 'system',
                content: `你是一个思想深入的对话伙伴，正在和用户讨论这条判断：${quote.content}。请给出有深度、有启发性的回应。`
            },
            ...chatHistory,
            {
                role: 'user',
                content: userMessage
            }
        ];
        
        return await this.callAPI(messages);
    }
    
    /**
     * AI对话（输入想法页的"聊一聊"功能）
     */
    async chatAboutIdea(idea, userMessage, chatHistory = []) {
        const messages = [
            {
                role: 'system',
                content: `你是一个有洞察力的对话伙伴，正在和用户讨论这个想法：${idea}。请给出有价值、有启发性的回应。`
            },
            ...chatHistory,
            {
                role: 'user',
                content: userMessage
            }
        ];
        
        return await this.callAPI(messages);
    }
}

// 创建全局实例
window.aiService = new AIService();
