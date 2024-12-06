document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const compressSettings = document.getElementById('compressSettings');
    const previewArea = document.getElementById('previewArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    if (!uploadArea || !fileInput || !compressSettings || !previewArea || !qualitySlider || !qualityValue || !downloadBtn) {
        console.error('必要的DOM元素未找到');
        return;
    }

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1976D2';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2196F3';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2196F3';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', function(e) {
        console.log('选择文件:', this.files);
        if (this.files && this.files.length > 0) {
            handleFiles(this.files);
        }
    });

    // 处理图片压缩
    function handleFiles(files) {
        console.log('处理文件:', files);
        if (!files || files.length === 0) {
            console.error('没有选择文件');
            return;
        }

        const file = files[0];
        console.log('选择的文件:', file.name, file.type, file.size);

        if (!file || !file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            console.error('文件类型不正确');
            return;
        }

        // 显示设置面板和预览区域
        compressSettings.style.display = 'block';
        previewArea.style.display = 'block';

        // 显示原图预览
        const reader = new FileReader();
        reader.onerror = function(error) {
            console.error('读取文件错误:', error);
            alert('读取文件失败，请重试！');
        };
        reader.onload = (e) => {
            console.log('文件读取成功');
            document.getElementById('originalPreview').src = e.target.result;
            document.getElementById('originalSize').textContent = 
                (file.size / 1024).toFixed(2) + ' KB';
            compressImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(dataUrl) {
        const img = new Image();
        img.onerror = function() {
            console.error('图片加载失败');
            alert('图片加载失败，请重试！');
        };
        img.onload = () => {
            console.log('图片加载成功，尺寸:', img.width, 'x', img.height);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置画布大小
            canvas.width = img.width;
            canvas.height = img.height;

            // 绘制图片
            ctx.drawImage(img, 0, 0);

            // 压缩图片
            const quality = qualitySlider.value / 100;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

            // 显示压缩后的预览
            document.getElementById('compressedPreview').src = compressedDataUrl;

            // 计算压缩后的大小
            const compressedSize = Math.round(compressedDataUrl.length * 3/4);
            document.getElementById('compressedSize').textContent = 
                (compressedSize / 1024).toFixed(2) + ' KB';

            // 设置下载链接
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = 'compressed-image.jpg';
                link.href = compressedDataUrl;
                link.click();
            };
        };
        img.src = dataUrl;
    }

    // 更新压缩质量显示
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        const originalDataUrl = document.getElementById('originalPreview').src;
        if (originalDataUrl && originalDataUrl !== window.location.href) {
            compressImage(originalDataUrl);
        }
    });

    // 初始化完成
    console.log('图片压缩工具初始化完成');
}); 