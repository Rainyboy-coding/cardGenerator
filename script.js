// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const content = document.getElementById('content');
    const template = document.getElementById('template');
    const generateButton = document.getElementById('generate');
    const htmlCodeElement = document.getElementById('html-code');
    const previewElement = document.getElementById('preview');
    const copyCodeButton = document.getElementById('copy-code');
    const saveImageButton = document.getElementById('save-image');
    
    // 卡片类型与对应的提示词文件映射
    const templateFiles = {
        'profile': 'cardPrompts/profile_card.md',
        'product': 'cardPrompts/product_card.md',
        'meeting': 'cardPrompts/meeting_notice_card.md',
        'event': 'cardPrompts/event_promotion_card.md',
        'wechat': 'cardPrompts/wechat_article_card.md',
        '1080_800_knowledge': 'cardPrompts/1080_800_knowledge_card.md',
        '750_knowledge': 'cardPrompts/750_knowledge_card.md'
    };
    
    // 生成卡片按钮点击事件
    generateButton.addEventListener('click', async function() {
        const selectedTemplate = template.value;
        const selectedContent = content.value.trim(); // trim()方法用于删除字符串两端的空白字符
        
        // 检查是否选择了模板和输入了内容
        if (!selectedTemplate) {
            alert('请选择卡片类型');
            return;
        }
        
        if (!selectedContent) {
            alert('请输入卡片内容');
            return;
        }
        
        try {
            // 获取对应的提示词模板
            const templateFile = templateFiles[selectedTemplate];
            const templateResponse = await fetch(templateFile);
            
            if (!templateResponse.ok) {
                throw new Error('模板加载失败');
            }
            
            let templateText = await templateResponse.text();
            
            // 将用户输入内容替换到模板中的{content}部分
            const promptWithContent = templateText.replace('{content}', selectedContent);
            
            // 调用API生成卡片
            await generateCardWithAI(promptWithContent);
            
        } catch (error) {
            console.error('生成卡片时出错:', error);
            alert('生成卡片时出错: ' + error.message);
        }
    });
    
    // 复制代码按钮点击事件
    copyCodeButton.addEventListener('click', function() {
        const codeText = htmlCodeElement.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            alert('代码已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    });
    
    // 保存图片按钮点击事件
    saveImageButton.addEventListener('click', function() {
        html2canvas(previewElement).then(canvas => {
            const link = document.createElement('a');
            link.download = 'card-' + new Date().getTime() + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('保存图片失败:', err);
            alert('保存图片失败: ' + err.message);
        });
    });
    
    // 调用AI API生成卡片
    async function generateCardWithAI(prompt) {
        try {
            // 这里使用OpenAI API发送请求
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-d4ab2c4214c444b7aa02ce538e675517'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            
            if (!response.ok) {
                throw new Error('API请求失败');
            }
            
            const data = await response.json();
            const generatedHTML = data.choices[0].message.content;
            
            // 显示生成的HTML代码
            htmlCodeElement.textContent = generatedHTML;
            
            // 在预览区域显示卡片
            previewElement.innerHTML = generatedHTML;
            
        } catch (error) {
            console.error('API调用失败:', error);
            alert('API调用失败: ' + error.message);
        }
    }
});