window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 全局锁，防止多次点击
let isDownloading = false;

document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    
    // 只处理 blob 链接
    if (a && a.href && a.href.startsWith('blob:')) {
        // 如果正在下载中，直接阻止，防止重复触发
        if (isDownloading) {
            console.log("下载正在进行中，请勿重复点击...");
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        isDownloading = true; // 上锁
        console.log("拦截 Blob，准备处理...");

        fetch(a.href)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const dataUrl = reader.result;
                    
                    // 1. 创建下载节点
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'character_card.json';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // 2. 显示提示 (Feedback)
                    let toast = document.createElement('div');
                    toast.innerText = "✅ 下载已触发，请查看系统下载目录";
                    toast.style = "position:fixed; bottom:20%; left:10%; right:10%; background:rgba(0,0,0,0.8); color:white; padding:15px; border-radius:10px; text-align:center; z-index:9999; pointer-events:none;";
                    document.body.appendChild(toast);
                    setTimeout(() => document.body.removeChild(toast), 2500);
                    
                    isDownloading = false; // 解锁
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                isDownloading = false; // 出错也必须解锁
                console.error(err);
                alert("下载失败，请重试");
            });
    }
}, true);
