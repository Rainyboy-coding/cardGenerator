// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const contentTextarea = document.getElementById('content');
    const templateSelect = document.getElementById('template');
    const generateButton = document.getElementById('generate');
    const htmlCode = document.getElementById('html-code');
    const preview = document.getElementById('preview');
    const copyButton = document.querySelector('.bg-gray-600');
    
    // 复制代码按钮功能
    copyButton.addEventListener('click', function() {
        const codeText = htmlCode.textContent;
        navigator.clipboard.writeText(codeText)
            .then(() => {
                // 复制成功提示
                const originalText = copyButton.textContent;
                copyButton.textContent = '复制成功!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('复制失败: ', err);
            });
    });
    
    // 生成卡片按钮点击事件
    generateButton.addEventListener('click', function() {
        const content = contentTextarea.value.trim();
        const templateType = templateSelect.value;
        
        // 验证输入
        if (!content) {
            alert('请输入卡片内容');
            return;
        }
        
        if (!templateType) {
            alert('请选择卡片类型');
            return;
        }
        
        // 模拟生成过程
        simulateCardGeneration(content, templateType);
    });
    
    // 模拟卡片生成函数
    function simulateCardGeneration(content, templateType) {
        // 显示加载状态
        preview.innerHTML = '<div class="flex justify-center items-center h-full"><p>正在生成卡片...</p></div>';
        
        // 模拟API请求延迟
        setTimeout(() => {
            let cardHTML = '';
            
            // 根据不同模板类型生成不同的卡片HTML
            switch (templateType) {
                case 'profile':
                    cardHTML = generateProfileCard(content);
                    break;
                case 'product':
                    cardHTML = generateProductCard(content);
                    break;
                case 'meeting':
                    cardHTML = generateMeetingCard(content);
                    break;
                case 'event':
                    cardHTML = generateEventCard(content);
                    break;
                default:
                    cardHTML = `<div class="card"><p>${content}</p></div>`;
            }
            
            // 更新HTML代码显示
            htmlCode.innerHTML = escapeHTML(cardHTML);
            
            // 更新预览区域
            preview.innerHTML = cardHTML;
        }, 1000);
    }
    
    // 生成个人资料卡片
    function generateProfileCard(content) {
        return `<div class="card">
  <h2>个人资料</h2>
  <p>${content}</p>
</div>`;
    }
    
    // 生成产品展示卡片
    function generateProductCard(content) {
        return `<div class="card">
  <h2>产品展示</h2>
  <p>${content}</p>
</div>`;
    }
    
    // 生成会议通知卡片
    function generateMeetingCard(content) {
        return `<div class="card">
  <h2>会议通知</h2>
  <p>${content}</p>
</div>`;
    }
    
    // 生成活动宣传卡片
    function generateEventCard(content) {
        return `<div class="card">
  <h2>活动宣传</h2>
  <p>${content}</p>
</div>`;
    }
    
    // HTML转义函数
    function escapeHTML(html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}); 