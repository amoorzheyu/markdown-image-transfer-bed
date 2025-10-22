let allImages = [];
let selectedImages = new Set();

// 检查登录状态
async function checkAuth() {
    try {
        const res = await fetch('/api/check-auth', { credentials: 'include' });
        const data = await res.json();
        
        if (data.authenticated) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('mainContainer').style.display = 'block';
            document.getElementById('usernameDisplay').textContent = data.username;
            loadStats();
            loadImages();
        } else {
            document.getElementById('loginContainer').style.display = 'flex';
            document.getElementById('mainContainer').style.display = 'none';
        }
    } catch (err) {
        console.error('检查登录状态失败:', err);
    }
}

// 登录
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');

    btn.disabled = true;
    btn.textContent = '登录中...';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {
            showToast('登录成功', 'success');
            setTimeout(() => checkAuth(), 500);
        } else {
            showToast(data.error || '登录失败', 'error');
        }
    } catch (err) {
        showToast('登录失败: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = '登录';
    }
});

// 退出登录
async function logout() {
    try {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        showToast('已退出登录', 'info');
        setTimeout(() => checkAuth(), 500);
    } catch (err) {
        showToast('退出失败', 'error');
    }
}

// 加载统计信息
async function loadStats() {
    try {
        const res = await fetch('/api/stats', { credentials: 'include' });
        const data = await res.json();
        
        if (data.success) {
            document.getElementById('totalImages').textContent = data.stats.totalImages;
            document.getElementById('totalSize').textContent = data.stats.totalSizeFormatted;
        }
    } catch (err) {
        console.error('加载统计信息失败:', err);
    }
}

// 加载图片列表
async function loadImages() {
    const grid = document.getElementById('imagesGrid');
    grid.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载中...</p></div>';

    try {
        const res = await fetch('/api/images', { credentials: 'include' });
        const data = await res.json();

        if (data.success) {
            allImages = data.images;
            selectedImages.clear();
            renderImages(allImages);
            loadStats();
            updateSelectedCount();
        }
    } catch (err) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">❌</div><p>加载失败</p></div>';
        showToast('加载图片失败', 'error');
    }
}

// 渲染图片列表
function renderImages(images) {
    const grid = document.getElementById('imagesGrid');

    if (images.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>暂无图片</p></div>';
        return;
    }

    grid.innerHTML = images.map(img => `
        <div class="image-card ${selectedImages.has(img.filename) ? 'selected' : ''}" data-filename="${img.filename}">
            <input type="checkbox" class="image-checkbox" 
                   ${selectedImages.has(img.filename) ? 'checked' : ''}
                   onchange="toggleImageSelection('${img.filename}')">
            <div class="image-wrapper" onclick="previewImage('${img.url}')">
                <img src="${img.url}" alt="${img.filename}" loading="lazy">
            </div>
            <div class="image-info">
                <div class="image-filename" title="${img.filename}">${img.filename}</div>
                <div class="image-meta">
                    ${img.sizeFormatted} · ${formatDate(img.created)}
                </div>
                <div class="image-actions">
                    <button class="btn-small btn-copy" onclick="copyUrl('${img.url}')">复制链接</button>
                    <button class="btn-small btn-delete" onclick="deleteImage('${img.filename}')">删除</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 搜索过滤
function filterImages() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allImages.filter(img => 
        img.filename.toLowerCase().includes(keyword)
    );
    renderImages(filtered);
}

// 切换图片选择
function toggleImageSelection(filename) {
    if (selectedImages.has(filename)) {
        selectedImages.delete(filename);
    } else {
        selectedImages.add(filename);
    }
    updateSelectedCount();
    updateCardSelection(filename);
}

// 更新卡片选中状态
function updateCardSelection(filename) {
    const card = document.querySelector(`[data-filename="${filename}"]`);
    if (card) {
        if (selectedImages.has(filename)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
}

// 全选/取消全选
function toggleSelectAll() {
    const checkbox = document.getElementById('selectAllCheckbox');
    if (checkbox.checked) {
        allImages.forEach(img => selectedImages.add(img.filename));
    } else {
        selectedImages.clear();
    }
    updateSelectedCount();
    renderImages(allImages);
}

// 更新选中数量
function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = selectedImages.size;
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    batchDeleteBtn.disabled = selectedImages.size === 0;
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    selectAllCheckbox.checked = selectedImages.size > 0 && selectedImages.size === allImages.length;
}

// 上传图片
async function uploadImages() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
        formData.append('images', file);
    }

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {
            showToast(data.message, 'success');
            loadImages();
            fileInput.value = '';
        } else {
            showToast(data.error || '上传失败', 'error');
        }
    } catch (err) {
        showToast('上传失败: ' + err.message, 'error');
    }
}

// 复制链接
function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('链接已复制', 'success');
    }).catch(() => {
        showToast('复制失败', 'error');
    });
}

// 删除图片
async function deleteImage(filename) {
    if (!confirm(`确定要删除 ${filename} 吗？`)) return;

    try {
        const res = await fetch(`/api/images/${filename}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {
            showToast('删除成功', 'success');
            selectedImages.delete(filename);
            loadImages();
        } else {
            showToast(data.error || '删除失败', 'error');
        }
    } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
    }
}

// 批量删除
async function batchDelete() {
    if (selectedImages.size === 0) return;

    if (!confirm(`确定要删除选中的 ${selectedImages.size} 张图片吗？`)) return;

    try {
        const res = await fetch('/api/images/batch-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filenames: Array.from(selectedImages) }),
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {
            showToast(data.message, 'success');
            selectedImages.clear();
            loadImages();
        } else {
            showToast(data.error || '批量删除失败', 'error');
        }
    } catch (err) {
        showToast('批量删除失败: ' + err.message, 'error');
    }
}

// 预览图片
function previewImage(url) {
    document.getElementById('modalImage').src = url;
    document.getElementById('imageModal').classList.add('active');
}

// 关闭模态框
function closeModal() {
    document.getElementById('imageModal').classList.remove('active');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 页面加载时检查登录状态
window.onload = checkAuth;

// ESC 键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

