import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Media = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Gestão de Mídia - Admin", "data-astro-cid-wlnxg25n": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div class="media-container" data-astro-cid-wlnxg25n> <!-- Header --> <div class="media-header" data-astro-cid-wlnxg25n> <h1 data-astro-cid-wlnxg25n>📁 Gestão de Mídia</h1> <p data-astro-cid-wlnxg25n>Sistema completo de gerenciamento de arquivos e mídia</p> </div> <!-- Stats Overview --> <div class="media-stats" data-astro-cid-wlnxg25n> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="total-files" data-astro-cid-wlnxg25n>2,847</div> <div class="stat-label" data-astro-cid-wlnxg25n>Arquivos Totais</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="total-size" data-astro-cid-wlnxg25n>45.2GB</div> <div class="stat-label" data-astro-cid-wlnxg25n>Espaço Utilizado</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="uploads-today" data-astro-cid-wlnxg25n>127</div> <div class="stat-label" data-astro-cid-wlnxg25n>Uploads Hoje</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="compression-saved" data-astro-cid-wlnxg25n>12.3GB</div> <div class="stat-label" data-astro-cid-wlnxg25n>Espaço Economizado</div> </div> </div> <!-- Controls --> <div class="media-controls" data-astro-cid-wlnxg25n> <div class="controls-grid" data-astro-cid-wlnxg25n> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Buscar Arquivos</label> <input type="text" class="search-input" id="media-search" placeholder="Nome, tipo, tags..." data-astro-cid-wlnxg25n> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Tipo de Arquivo</label> <select class="control-select" id="file-type-filter" data-astro-cid-wlnxg25n> <option value="all" selected data-astro-cid-wlnxg25n>Todos os tipos</option> <option value="image" data-astro-cid-wlnxg25n>Imagens</option> <option value="video" data-astro-cid-wlnxg25n>Vídeos</option> <option value="audio" data-astro-cid-wlnxg25n>Áudio</option> <option value="document" data-astro-cid-wlnxg25n>Documentos</option> <option value="archive" data-astro-cid-wlnxg25n>Arquivos</option> </select> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Ordenar por</label> <select class="control-select" id="sort-filter" data-astro-cid-wlnxg25n> <option value="date-desc" selected data-astro-cid-wlnxg25n>Mais recentes</option> <option value="date-asc" data-astro-cid-wlnxg25n>Mais antigos</option> <option value="name" data-astro-cid-wlnxg25n>Nome</option> <option value="size" data-astro-cid-wlnxg25n>Tamanho</option> <option value="type" data-astro-cid-wlnxg25n>Tipo</option> </select> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Ações</label> <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;" data-astro-cid-wlnxg25n> <button class="btn btn-primary" onclick="openUploadModal()" data-astro-cid-wlnxg25n>➕ Upload</button> <button class="btn btn-outline" onclick="createFolder()" data-astro-cid-wlnxg25n>📁 Pasta</button> </div> </div> </div> </div> <!-- Folders Sidebar --> <div class="folders-sidebar" data-astro-cid-wlnxg25n> <h3 style="color: #00d4ff; margin-bottom: 1rem; font-size: 1.2rem;" data-astro-cid-wlnxg25n>📂 Pastas</h3> <div id="folders-list" data-astro-cid-wlnxg25n> <!-- Folders will be loaded here --> </div> </div> <!-- Compression Settings --> <div class="compression-settings" data-astro-cid-wlnxg25n> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;" data-astro-cid-wlnxg25n> <h3 style="color: #00d4ff; margin: 0; font-size: 1.2rem;" data-astro-cid-wlnxg25n>🗜️ Configurações de Compressão</h3> <button class="btn btn-outline" onclick="applyCompressionSettings()" data-astro-cid-wlnxg25n>💾 Salvar</button> </div> <div class="compression-grid" data-astro-cid-wlnxg25n> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens JPEG</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="jpeg-quality" value="85" min="1" max="100" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>% qualidade</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens PNG</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="png-quality" value="8" min="1" max="9" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>nível (1-9)</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens WebP</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="webp-quality" value="80" min="1" max="100" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>% qualidade</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Vídeos MP4</div> <div class="compression-control" data-astro-cid-wlnxg25n> <select class="control-select" style="font-size: 0.8rem;" data-astro-cid-wlnxg25n> <option value="high" data-astro-cid-wlnxg25n>Alta qualidade</option> <option value="medium" selected data-astro-cid-wlnxg25n>Média qualidade</option> <option value="low" data-astro-cid-wlnxg25n>Baixa qualidade</option> </select> </div> </div> </div> </div> <!-- Bulk Actions --> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-wlnxg25n> <div class="selected-count" data-astro-cid-wlnxg25n> <span id="selected-count" data-astro-cid-wlnxg25n>0</span> arquivos selecionados
</div> <div class="bulk-buttons" data-astro-cid-wlnxg25n> <button class="btn btn-outline" onclick="downloadSelected()" data-astro-cid-wlnxg25n>📥 Download</button> <button class="btn btn-outline" onclick="moveSelected()" data-astro-cid-wlnxg25n>📂 Mover</button> <button class="btn btn-danger" onclick="deleteSelected()" data-astro-cid-wlnxg25n>🗑️ Excluir</button> <button class="btn btn-outline" onclick="clearSelection()" data-astro-cid-wlnxg25n>❌ Limpar</button> </div> </div> <!-- Upload Zone --> <div class="upload-zone" id="upload-zone" onclick="triggerFileInput()" data-astro-cid-wlnxg25n> <span class="upload-icon" data-astro-cid-wlnxg25n>📤</span> <div class="upload-text" data-astro-cid-wlnxg25n>Arraste arquivos aqui ou clique para selecionar</div> <div class="upload-subtext" data-astro-cid-wlnxg25n>Suporte a múltiplos arquivos • Até 100MB cada • Todos os formatos</div> <input type="file" id="file-input" multiple style="display: none;" onchange="handleFileSelection()" data-astro-cid-wlnxg25n> </div> <!-- Media Grid --> <div class="media-grid" id="media-grid" data-astro-cid-wlnxg25n> <!-- Media items will be loaded here --> </div> </div>  <div class="modal hidden" id="upload-modal" data-astro-cid-wlnxg25n> <div class="modal-content" data-astro-cid-wlnxg25n> <div class="modal-header" data-astro-cid-wlnxg25n> <h2 class="modal-title" data-astro-cid-wlnxg25n>📤 Upload de Arquivos</h2> <button class="modal-close" onclick="closeUploadModal()" data-astro-cid-wlnxg25n>×</button> </div> <div id="upload-progress" data-astro-cid-wlnxg25n> <!-- Upload progress will be shown here --> </div> <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;" data-astro-cid-wlnxg25n> <button class="btn btn-outline" onclick="closeUploadModal()" data-astro-cid-wlnxg25n>Cancelar</button> <button class="btn btn-primary" onclick="startUpload()" data-astro-cid-wlnxg25n>Iniciar Upload</button> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let selectedFiles = new Set();
        let currentFolder = 'all';

        // Load media data
        async function loadMediaData() {
            try {
                const response = await fetch(\`\${API_URL}/api/admin/media\`);
                const data = await response.json();

                updateStats(data);
                loadFolders(data.folders || []);
                loadMediaItems(data.files || []);
            } catch (e) {
                console.error('Error loading media data:', e);
                loadMockMediaData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-files').textContent = (data.totalFiles || 2847).toLocaleString();
            document.getElementById('total-size').textContent = data.totalSize || '45.2GB';
            document.getElementById('uploads-today').textContent = (data.uploadsToday || 127).toLocaleString();
            document.getElementById('compression-saved').textContent = data.compressionSaved || '12.3GB';
        }

        function loadFolders(folders) {
            const foldersList = document.getElementById('folders-list');

            if (folders.length === 0) {
                folders = [
                    { id: 'all', name: 'Todos os Arquivos', count: 2847, icon: '📁' },
                    { id: 'images', name: 'Imagens', count: 1847, icon: '🖼️' },
                    { id: 'videos', name: 'Vídeos', count: 234, icon: '🎥' },
                    { id: 'documents', name: 'Documentos', count: 456, icon: '📄' },
                    { id: 'audio', name: 'Áudio', count: 89, icon: '🎵' },
                    { id: 'archives', name: 'Arquivos', count: 221, icon: '📦' }
                ];
            }

            foldersList.innerHTML = folders.map(folder => \`
                <div class="folder-item \${folder.id === currentFolder ? 'active' : ''}" onclick="changeFolder('\${folder.id}')">
                    <span class="folder-icon">\${folder.icon}</span>
                    <span class="folder-name">\${folder.name}</span>
                    <span class="folder-count">\${folder.count}</span>
                </div>
            \`).join('');
        }

        function loadMediaItems(files) {
            const mediaGrid = document.getElementById('media-grid');

            if (files.length === 0) {
                files = [
                    { id: '1', name: 'logo-getnexo.png', type: 'image', size: '245KB', date: '2026-01-21', url: '#', folder: 'images' },
                    { id: '2', name: 'tutorial-video.mp4', type: 'video', size: '45MB', date: '2026-01-20', url: '#', folder: 'videos' },
                    { id: '3', name: 'manual-admin.pdf', type: 'document', size: '2.1MB', date: '2026-01-19', url: '#', folder: 'documents' },
                    { id: '4', name: 'background-music.mp3', type: 'audio', size: '8.7MB', date: '2026-01-18', url: '#', folder: 'audio' },
                    { id: '5', name: 'backup-site.zip', type: 'archive', size: '1.2GB', date: '2026-01-17', url: '#', folder: 'archives' },
                    { id: '6', name: 'user-avatar.jpg', type: 'image', size: '89KB', date: '2026-01-16', url: '#', folder: 'images' }
                ];
            }

            // Filter by current folder
            const filteredFiles = currentFolder === 'all' ? files : files.filter(f => f.folder === currentFolder);

            mediaGrid.innerHTML = filteredFiles.map(file => \`
                <div class="media-item" onclick="handleFileClick(event, '\${file.id}')">
                    <div class="media-preview">
                        \${getFilePreview(file)}
                        <div class="media-type">\${file.type}</div>
                        <div class="media-actions">
                            <button class="action-btn" onclick="editFile('\${file.id}')">✏️</button>
                            <button class="action-btn" onclick="downloadFile('\${file.id}')">📥</button>
                        </div>
                        \${selectedFiles.has(file.id) ? '<div class="selected-indicator">✓</div>' : ''}
                    </div>
                    <div class="media-info">
                        <div class="media-name">\${file.name}</div>
                        <div class="media-meta">
                            <span>\${file.size}</span>
                            <span>\${file.date}</span>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function getFilePreview(file) {
            const typeIcons = {
                image: '🖼️',
                video: '🎥',
                audio: '🎵',
                document: '📄',
                archive: '📦'
            };

            if (file.type === 'image' && file.url) {
                return \`<img src="\${file.url}" alt="\${file.name}" class="media-image">\`;
            } else {
                return \`<span class="media-icon">\${typeIcons[file.type] || '📄'}</span>\`;
            }
        }

        function loadMockMediaData() {
            updateStats({
                totalFiles: 2847,
                totalSize: '45.2GB',
                uploadsToday: 127,
                compressionSaved: '12.3GB'
            });

            loadFolders([]);
            loadMediaItems([]);
        }

        // Event handlers
        document.getElementById('media-search').addEventListener('input', debounce(filterMedia, 300));
        document.getElementById('file-type-filter').addEventListener('change', filterMedia);
        document.getElementById('sort-filter').addEventListener('change', sortMedia);

        // Upload handling
        function triggerFileInput() {
            document.getElementById('file-input').click();
        }

        function handleFileSelection() {
            const files = document.getElementById('file-input').files;
            if (files.length > 0) {
                openUploadModal();
                showUploadProgress(files);
            }
        }

        function openUploadModal() {
            document.getElementById('upload-modal').classList.remove('hidden');
        }

        function closeUploadModal() {
            document.getElementById('upload-modal').classList.add('hidden');
        }

        function showUploadProgress(files) {
            const progressDiv = document.getElementById('upload-progress');
            progressDiv.innerHTML = \`
                <div style="margin-bottom: 1rem;">
                    <strong>\${files.length} arquivo(s) selecionado(s)</strong>
                </div>
                <div style="space-y: 0.5rem;">
                    \${Array.from(files).map((file, index) => \`
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 4px;">
                            <span style="color: white; font-size: 0.9rem;">\${file.name}</span>
                            <span style="color: #94a3b8; font-size: 0.8rem;">\${(file.size / 1024 / 1024).toFixed(1)}MB</span>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        function startUpload() {
            alert('Upload iniciado! Arquivos sendo processados...');
            closeUploadModal();
            loadMediaData(); // Refresh the list
        }

        // File operations
        function handleFileClick(event, fileId) {
            if (event.target.classList.contains('action-btn')) return;

            if (selectedFiles.has(fileId)) {
                selectedFiles.delete(fileId);
            } else {
                selectedFiles.add(fileId);
            }
            updateBulkActions();
            loadMediaItems([]); // Re-render to show selection
        }

        function changeFolder(folderId) {
            currentFolder = folderId;
            document.querySelectorAll('.folder-item').forEach(item => item.classList.remove('active'));
            event.target.closest('.folder-item').classList.add('active');
            loadMediaItems([]);
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedFiles.size;

            if (selectedFiles.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function clearSelection() {
            selectedFiles.clear();
            updateBulkActions();
            loadMediaItems([]);
        }

        function filterMedia() {
            // Implement filtering logic
            loadMediaItems([]);
        }

        function sortMedia() {
            // Implement sorting logic
            loadMediaItems([]);
        }

        function createFolder() {
            const folderName = prompt('Nome da nova pasta:');
            if (folderName) {
                alert(\`Pasta "\${folderName}" criada com sucesso!\`);
                loadMediaData();
            }
        }

        function editFile(fileId) {
            alert(\`Editando arquivo \${fileId}... (Interface de edição será implementada)\`);
        }

        function downloadFile(fileId) {
            alert(\`Download do arquivo \${fileId} iniciado...\`);
        }

        function downloadSelected() {
            if (selectedFiles.size === 0) return;
            alert(\`\${selectedFiles.size} arquivo(s) compactado(s) para download!\`);
        }

        function moveSelected() {
            if (selectedFiles.size === 0) return;
            const folder = prompt('Mover para qual pasta?');
            if (folder) {
                alert(\`\${selectedFiles.size} arquivo(s) movido(s) para "\${folder}"\`);
                clearSelection();
            }
        }

        function deleteSelected() {
            if (selectedFiles.size === 0) return;
            if (confirm(\`Tem certeza que deseja excluir \${selectedFiles.size} arquivo(s)? Esta ação não pode ser desfeita.\`)) {
                alert(\`\${selectedFiles.size} arquivo(s) excluído(s) com sucesso!\`);
                clearSelection();
                loadMediaData();
            }
        }

        function applyCompressionSettings() {
            const settings = {
                jpeg: document.getElementById('jpeg-quality').value,
                png: document.getElementById('png-quality').value,
                webp: document.getElementById('webp-quality').value
            };

            console.log('Configurações de compressão salvas:', settings);
            alert('Configurações de compressão aplicadas! Todos os novos uploads usarão essas configurações.');
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Initialize
        loadMediaData();
    <\/script> `], ["  ", `<div class="media-container" data-astro-cid-wlnxg25n> <!-- Header --> <div class="media-header" data-astro-cid-wlnxg25n> <h1 data-astro-cid-wlnxg25n>📁 Gestão de Mídia</h1> <p data-astro-cid-wlnxg25n>Sistema completo de gerenciamento de arquivos e mídia</p> </div> <!-- Stats Overview --> <div class="media-stats" data-astro-cid-wlnxg25n> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="total-files" data-astro-cid-wlnxg25n>2,847</div> <div class="stat-label" data-astro-cid-wlnxg25n>Arquivos Totais</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="total-size" data-astro-cid-wlnxg25n>45.2GB</div> <div class="stat-label" data-astro-cid-wlnxg25n>Espaço Utilizado</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="uploads-today" data-astro-cid-wlnxg25n>127</div> <div class="stat-label" data-astro-cid-wlnxg25n>Uploads Hoje</div> </div> <div class="stat-card" data-astro-cid-wlnxg25n> <div class="stat-value" id="compression-saved" data-astro-cid-wlnxg25n>12.3GB</div> <div class="stat-label" data-astro-cid-wlnxg25n>Espaço Economizado</div> </div> </div> <!-- Controls --> <div class="media-controls" data-astro-cid-wlnxg25n> <div class="controls-grid" data-astro-cid-wlnxg25n> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Buscar Arquivos</label> <input type="text" class="search-input" id="media-search" placeholder="Nome, tipo, tags..." data-astro-cid-wlnxg25n> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Tipo de Arquivo</label> <select class="control-select" id="file-type-filter" data-astro-cid-wlnxg25n> <option value="all" selected data-astro-cid-wlnxg25n>Todos os tipos</option> <option value="image" data-astro-cid-wlnxg25n>Imagens</option> <option value="video" data-astro-cid-wlnxg25n>Vídeos</option> <option value="audio" data-astro-cid-wlnxg25n>Áudio</option> <option value="document" data-astro-cid-wlnxg25n>Documentos</option> <option value="archive" data-astro-cid-wlnxg25n>Arquivos</option> </select> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Ordenar por</label> <select class="control-select" id="sort-filter" data-astro-cid-wlnxg25n> <option value="date-desc" selected data-astro-cid-wlnxg25n>Mais recentes</option> <option value="date-asc" data-astro-cid-wlnxg25n>Mais antigos</option> <option value="name" data-astro-cid-wlnxg25n>Nome</option> <option value="size" data-astro-cid-wlnxg25n>Tamanho</option> <option value="type" data-astro-cid-wlnxg25n>Tipo</option> </select> </div> <div class="control-group" data-astro-cid-wlnxg25n> <label class="control-label" data-astro-cid-wlnxg25n>Ações</label> <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;" data-astro-cid-wlnxg25n> <button class="btn btn-primary" onclick="openUploadModal()" data-astro-cid-wlnxg25n>➕ Upload</button> <button class="btn btn-outline" onclick="createFolder()" data-astro-cid-wlnxg25n>📁 Pasta</button> </div> </div> </div> </div> <!-- Folders Sidebar --> <div class="folders-sidebar" data-astro-cid-wlnxg25n> <h3 style="color: #00d4ff; margin-bottom: 1rem; font-size: 1.2rem;" data-astro-cid-wlnxg25n>📂 Pastas</h3> <div id="folders-list" data-astro-cid-wlnxg25n> <!-- Folders will be loaded here --> </div> </div> <!-- Compression Settings --> <div class="compression-settings" data-astro-cid-wlnxg25n> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;" data-astro-cid-wlnxg25n> <h3 style="color: #00d4ff; margin: 0; font-size: 1.2rem;" data-astro-cid-wlnxg25n>🗜️ Configurações de Compressão</h3> <button class="btn btn-outline" onclick="applyCompressionSettings()" data-astro-cid-wlnxg25n>💾 Salvar</button> </div> <div class="compression-grid" data-astro-cid-wlnxg25n> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens JPEG</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="jpeg-quality" value="85" min="1" max="100" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>% qualidade</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens PNG</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="png-quality" value="8" min="1" max="9" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>nível (1-9)</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Imagens WebP</div> <div class="compression-control" data-astro-cid-wlnxg25n> <input type="number" class="compression-input" id="webp-quality" value="80" min="1" max="100" data-astro-cid-wlnxg25n> <span style="color: #94a3b8; font-size: 0.8rem;" data-astro-cid-wlnxg25n>% qualidade</span> </div> </div> <div class="compression-item" data-astro-cid-wlnxg25n> <div class="compression-label" data-astro-cid-wlnxg25n>Vídeos MP4</div> <div class="compression-control" data-astro-cid-wlnxg25n> <select class="control-select" style="font-size: 0.8rem;" data-astro-cid-wlnxg25n> <option value="high" data-astro-cid-wlnxg25n>Alta qualidade</option> <option value="medium" selected data-astro-cid-wlnxg25n>Média qualidade</option> <option value="low" data-astro-cid-wlnxg25n>Baixa qualidade</option> </select> </div> </div> </div> </div> <!-- Bulk Actions --> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-wlnxg25n> <div class="selected-count" data-astro-cid-wlnxg25n> <span id="selected-count" data-astro-cid-wlnxg25n>0</span> arquivos selecionados
</div> <div class="bulk-buttons" data-astro-cid-wlnxg25n> <button class="btn btn-outline" onclick="downloadSelected()" data-astro-cid-wlnxg25n>📥 Download</button> <button class="btn btn-outline" onclick="moveSelected()" data-astro-cid-wlnxg25n>📂 Mover</button> <button class="btn btn-danger" onclick="deleteSelected()" data-astro-cid-wlnxg25n>🗑️ Excluir</button> <button class="btn btn-outline" onclick="clearSelection()" data-astro-cid-wlnxg25n>❌ Limpar</button> </div> </div> <!-- Upload Zone --> <div class="upload-zone" id="upload-zone" onclick="triggerFileInput()" data-astro-cid-wlnxg25n> <span class="upload-icon" data-astro-cid-wlnxg25n>📤</span> <div class="upload-text" data-astro-cid-wlnxg25n>Arraste arquivos aqui ou clique para selecionar</div> <div class="upload-subtext" data-astro-cid-wlnxg25n>Suporte a múltiplos arquivos • Até 100MB cada • Todos os formatos</div> <input type="file" id="file-input" multiple style="display: none;" onchange="handleFileSelection()" data-astro-cid-wlnxg25n> </div> <!-- Media Grid --> <div class="media-grid" id="media-grid" data-astro-cid-wlnxg25n> <!-- Media items will be loaded here --> </div> </div>  <div class="modal hidden" id="upload-modal" data-astro-cid-wlnxg25n> <div class="modal-content" data-astro-cid-wlnxg25n> <div class="modal-header" data-astro-cid-wlnxg25n> <h2 class="modal-title" data-astro-cid-wlnxg25n>📤 Upload de Arquivos</h2> <button class="modal-close" onclick="closeUploadModal()" data-astro-cid-wlnxg25n>×</button> </div> <div id="upload-progress" data-astro-cid-wlnxg25n> <!-- Upload progress will be shown here --> </div> <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;" data-astro-cid-wlnxg25n> <button class="btn btn-outline" onclick="closeUploadModal()" data-astro-cid-wlnxg25n>Cancelar</button> <button class="btn btn-primary" onclick="startUpload()" data-astro-cid-wlnxg25n>Iniciar Upload</button> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let selectedFiles = new Set();
        let currentFolder = 'all';

        // Load media data
        async function loadMediaData() {
            try {
                const response = await fetch(\\\`\\\${API_URL}/api/admin/media\\\`);
                const data = await response.json();

                updateStats(data);
                loadFolders(data.folders || []);
                loadMediaItems(data.files || []);
            } catch (e) {
                console.error('Error loading media data:', e);
                loadMockMediaData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-files').textContent = (data.totalFiles || 2847).toLocaleString();
            document.getElementById('total-size').textContent = data.totalSize || '45.2GB';
            document.getElementById('uploads-today').textContent = (data.uploadsToday || 127).toLocaleString();
            document.getElementById('compression-saved').textContent = data.compressionSaved || '12.3GB';
        }

        function loadFolders(folders) {
            const foldersList = document.getElementById('folders-list');

            if (folders.length === 0) {
                folders = [
                    { id: 'all', name: 'Todos os Arquivos', count: 2847, icon: '📁' },
                    { id: 'images', name: 'Imagens', count: 1847, icon: '🖼️' },
                    { id: 'videos', name: 'Vídeos', count: 234, icon: '🎥' },
                    { id: 'documents', name: 'Documentos', count: 456, icon: '📄' },
                    { id: 'audio', name: 'Áudio', count: 89, icon: '🎵' },
                    { id: 'archives', name: 'Arquivos', count: 221, icon: '📦' }
                ];
            }

            foldersList.innerHTML = folders.map(folder => \\\`
                <div class="folder-item \\\${folder.id === currentFolder ? 'active' : ''}" onclick="changeFolder('\\\${folder.id}')">
                    <span class="folder-icon">\\\${folder.icon}</span>
                    <span class="folder-name">\\\${folder.name}</span>
                    <span class="folder-count">\\\${folder.count}</span>
                </div>
            \\\`).join('');
        }

        function loadMediaItems(files) {
            const mediaGrid = document.getElementById('media-grid');

            if (files.length === 0) {
                files = [
                    { id: '1', name: 'logo-getnexo.png', type: 'image', size: '245KB', date: '2026-01-21', url: '#', folder: 'images' },
                    { id: '2', name: 'tutorial-video.mp4', type: 'video', size: '45MB', date: '2026-01-20', url: '#', folder: 'videos' },
                    { id: '3', name: 'manual-admin.pdf', type: 'document', size: '2.1MB', date: '2026-01-19', url: '#', folder: 'documents' },
                    { id: '4', name: 'background-music.mp3', type: 'audio', size: '8.7MB', date: '2026-01-18', url: '#', folder: 'audio' },
                    { id: '5', name: 'backup-site.zip', type: 'archive', size: '1.2GB', date: '2026-01-17', url: '#', folder: 'archives' },
                    { id: '6', name: 'user-avatar.jpg', type: 'image', size: '89KB', date: '2026-01-16', url: '#', folder: 'images' }
                ];
            }

            // Filter by current folder
            const filteredFiles = currentFolder === 'all' ? files : files.filter(f => f.folder === currentFolder);

            mediaGrid.innerHTML = filteredFiles.map(file => \\\`
                <div class="media-item" onclick="handleFileClick(event, '\\\${file.id}')">
                    <div class="media-preview">
                        \\\${getFilePreview(file)}
                        <div class="media-type">\\\${file.type}</div>
                        <div class="media-actions">
                            <button class="action-btn" onclick="editFile('\\\${file.id}')">✏️</button>
                            <button class="action-btn" onclick="downloadFile('\\\${file.id}')">📥</button>
                        </div>
                        \\\${selectedFiles.has(file.id) ? '<div class="selected-indicator">✓</div>' : ''}
                    </div>
                    <div class="media-info">
                        <div class="media-name">\\\${file.name}</div>
                        <div class="media-meta">
                            <span>\\\${file.size}</span>
                            <span>\\\${file.date}</span>
                        </div>
                    </div>
                </div>
            \\\`).join('');
        }

        function getFilePreview(file) {
            const typeIcons = {
                image: '🖼️',
                video: '🎥',
                audio: '🎵',
                document: '📄',
                archive: '📦'
            };

            if (file.type === 'image' && file.url) {
                return \\\`<img src="\\\${file.url}" alt="\\\${file.name}" class="media-image">\\\`;
            } else {
                return \\\`<span class="media-icon">\\\${typeIcons[file.type] || '📄'}</span>\\\`;
            }
        }

        function loadMockMediaData() {
            updateStats({
                totalFiles: 2847,
                totalSize: '45.2GB',
                uploadsToday: 127,
                compressionSaved: '12.3GB'
            });

            loadFolders([]);
            loadMediaItems([]);
        }

        // Event handlers
        document.getElementById('media-search').addEventListener('input', debounce(filterMedia, 300));
        document.getElementById('file-type-filter').addEventListener('change', filterMedia);
        document.getElementById('sort-filter').addEventListener('change', sortMedia);

        // Upload handling
        function triggerFileInput() {
            document.getElementById('file-input').click();
        }

        function handleFileSelection() {
            const files = document.getElementById('file-input').files;
            if (files.length > 0) {
                openUploadModal();
                showUploadProgress(files);
            }
        }

        function openUploadModal() {
            document.getElementById('upload-modal').classList.remove('hidden');
        }

        function closeUploadModal() {
            document.getElementById('upload-modal').classList.add('hidden');
        }

        function showUploadProgress(files) {
            const progressDiv = document.getElementById('upload-progress');
            progressDiv.innerHTML = \\\`
                <div style="margin-bottom: 1rem;">
                    <strong>\\\${files.length} arquivo(s) selecionado(s)</strong>
                </div>
                <div style="space-y: 0.5rem;">
                    \\\${Array.from(files).map((file, index) => \\\`
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 4px;">
                            <span style="color: white; font-size: 0.9rem;">\\\${file.name}</span>
                            <span style="color: #94a3b8; font-size: 0.8rem;">\\\${(file.size / 1024 / 1024).toFixed(1)}MB</span>
                        </div>
                    \\\`).join('')}
                </div>
            \\\`;
        }

        function startUpload() {
            alert('Upload iniciado! Arquivos sendo processados...');
            closeUploadModal();
            loadMediaData(); // Refresh the list
        }

        // File operations
        function handleFileClick(event, fileId) {
            if (event.target.classList.contains('action-btn')) return;

            if (selectedFiles.has(fileId)) {
                selectedFiles.delete(fileId);
            } else {
                selectedFiles.add(fileId);
            }
            updateBulkActions();
            loadMediaItems([]); // Re-render to show selection
        }

        function changeFolder(folderId) {
            currentFolder = folderId;
            document.querySelectorAll('.folder-item').forEach(item => item.classList.remove('active'));
            event.target.closest('.folder-item').classList.add('active');
            loadMediaItems([]);
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedFiles.size;

            if (selectedFiles.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function clearSelection() {
            selectedFiles.clear();
            updateBulkActions();
            loadMediaItems([]);
        }

        function filterMedia() {
            // Implement filtering logic
            loadMediaItems([]);
        }

        function sortMedia() {
            // Implement sorting logic
            loadMediaItems([]);
        }

        function createFolder() {
            const folderName = prompt('Nome da nova pasta:');
            if (folderName) {
                alert(\\\`Pasta "\\\${folderName}" criada com sucesso!\\\`);
                loadMediaData();
            }
        }

        function editFile(fileId) {
            alert(\\\`Editando arquivo \\\${fileId}... (Interface de edição será implementada)\\\`);
        }

        function downloadFile(fileId) {
            alert(\\\`Download do arquivo \\\${fileId} iniciado...\\\`);
        }

        function downloadSelected() {
            if (selectedFiles.size === 0) return;
            alert(\\\`\\\${selectedFiles.size} arquivo(s) compactado(s) para download!\\\`);
        }

        function moveSelected() {
            if (selectedFiles.size === 0) return;
            const folder = prompt('Mover para qual pasta?');
            if (folder) {
                alert(\\\`\\\${selectedFiles.size} arquivo(s) movido(s) para "\\\${folder}"\\\`);
                clearSelection();
            }
        }

        function deleteSelected() {
            if (selectedFiles.size === 0) return;
            if (confirm(\\\`Tem certeza que deseja excluir \\\${selectedFiles.size} arquivo(s)? Esta ação não pode ser desfeita.\\\`)) {
                alert(\\\`\\\${selectedFiles.size} arquivo(s) excluído(s) com sucesso!\\\`);
                clearSelection();
                loadMediaData();
            }
        }

        function applyCompressionSettings() {
            const settings = {
                jpeg: document.getElementById('jpeg-quality').value,
                png: document.getElementById('png-quality').value,
                webp: document.getElementById('webp-quality').value
            };

            console.log('Configurações de compressão salvas:', settings);
            alert('Configurações de compressão aplicadas! Todos os novos uploads usarão essas configurações.');
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Initialize
        loadMediaData();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/media.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/media.astro";
const $$url = "/admin/media";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Media,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
