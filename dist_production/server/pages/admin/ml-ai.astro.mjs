import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$MlAi = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Machine Learning & IA - Admin", "data-astro-cid-fx2vmlsa": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", "  ", `<div class="ml-container" data-astro-cid-fx2vmlsa> <!-- Header --> <div class="ml-header" data-astro-cid-fx2vmlsa> <h1 data-astro-cid-fx2vmlsa>🤖 Machine Learning & IA</h1> <p data-astro-cid-fx2vmlsa>Gerencie modelos de IA, análise de sentimentos e algoritmos de machine learning</p> </div> <!-- Stats Overview --> <div class="ml-stats" data-astro-cid-fx2vmlsa> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="active-models" data-astro-cid-fx2vmlsa>12</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Modelos Ativos</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="predictions-today" data-astro-cid-fx2vmlsa>45.2K</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Predições Hoje</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="accuracy" data-astro-cid-fx2vmlsa>96.8%</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Acurácia Média</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="training-jobs" data-astro-cid-fx2vmlsa>3</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Treinos Ativos</div> </div> </div> <!-- Main Content Grid --> <div class="ml-grid" data-astro-cid-fx2vmlsa> <!-- Main Content --> <div class="ml-main" data-astro-cid-fx2vmlsa> <!-- Model Performance --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>📈 Performance dos Modelos</h2> <div style="display: flex; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <select class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" data-astro-cid-fx2vmlsa> <option data-astro-cid-fx2vmlsa>Últimas 24h</option> <option data-astro-cid-fx2vmlsa>Última semana</option> <option data-astro-cid-fx2vmlsa>Último mês</option> </select> <button class="btn btn-primary" onclick="refreshModels()" data-astro-cid-fx2vmlsa>🔄</button> </div> </div> <div class="performance-chart" data-astro-cid-fx2vmlsa> <div class="chart-container" data-astro-cid-fx2vmlsa> <canvas id="modelPerformanceChart" width="400" height="250" data-astro-cid-fx2vmlsa></canvas> </div> </div> <div id="models-list" data-astro-cid-fx2vmlsa> <!-- Models will be loaded here --> </div> </div> <!-- Sentiment Analysis --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>😊 Análise de Sentimentos</h2> <button class="btn btn-outline" onclick="configureSentiment()" data-astro-cid-fx2vmlsa>⚙️ Configurar</button> </div> <div class="sentiment-analysis" data-astro-cid-fx2vmlsa> <div class="sentiment-grid" data-astro-cid-fx2vmlsa> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-positive" id="positive-count" data-astro-cid-fx2vmlsa>68%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Positivo</div> </div> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-neutral" id="neutral-count" data-astro-cid-fx2vmlsa>22%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Neutro</div> </div> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-negative" id="negative-count" data-astro-cid-fx2vmlsa>10%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Negativo</div> </div> </div> </div> <div style="margin-top: 1rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-primary" onclick="viewSentimentDetails()" data-astro-cid-fx2vmlsa>Ver Detalhes</button> </div> </div> <!-- Training Jobs --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🎯 Jobs de Treinamento</h2> <button class="btn btn-primary" onclick="startNewTraining()" data-astro-cid-fx2vmlsa>➕ Novo Treino</button> </div> <div class="training-jobs" id="training-jobs" data-astro-cid-fx2vmlsa> <!-- Training jobs will be loaded here --> </div> </div> <!-- Recent Predictions --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🔮 Predições Recentes</h2> <button class="btn btn-outline" onclick="exportPredictions()" data-astro-cid-fx2vmlsa>📊 Exportar</button> </div> <div class="predictions-list" id="predictions-list" data-astro-cid-fx2vmlsa> <!-- Predictions will be loaded here --> </div> </div> </div> <!-- Sidebar --> <div class="ml-sidebar" data-astro-cid-fx2vmlsa> <!-- System Status --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>⚙️ Status do Sistema</h2> </div> <div class="system-status" data-astro-cid-fx2vmlsa> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>API de ML</h4> <p data-astro-cid-fx2vmlsa>Endpoint /api/ml</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Análise de Sentimentos</h4> <p data-astro-cid-fx2vmlsa>Motor Claude-3</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Sistema de Recomendações</h4> <p data-astro-cid-fx2vmlsa>Algoritmo K-means</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Clustering de Usuários</h4> <p data-astro-cid-fx2vmlsa>Processamento em lote</p> </div> <span class="status-indicator status-training" data-astro-cid-fx2vmlsa></span> </div> </div> </div> <!-- Quick Actions --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>⚡ Ações Rápidas</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-outline" onclick="retrainAllModels()" data-astro-cid-fx2vmlsa>🔄 Retreinar Modelos</button> <button class="btn btn-outline" onclick="clearCache()" data-astro-cid-fx2vmlsa>🗑️ Limpar Cache</button> <button class="btn btn-outline" onclick="runDiagnostics()" data-astro-cid-fx2vmlsa>🩺 Diagnóstico</button> <button class="btn btn-danger" onclick="emergencyStop()" data-astro-cid-fx2vmlsa>🚨 Parar Tudo</button> </div> </div> <!-- Model Controls --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🎛️ Controles</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-outline" onclick="pauseAllModels()" data-astro-cid-fx2vmlsa>⏸️ Pausar Todos</button> <button class="btn btn-outline" onclick="resumeAllModels()" data-astro-cid-fx2vmlsa>▶️ Retomar Todos</button> <button class="btn btn-outline" onclick="backupModels()" data-astro-cid-fx2vmlsa>💾 Backup</button> <button class="btn btn-outline" onclick="updateModels()" data-astro-cid-fx2vmlsa>⬆️ Atualizar</button> </div> </div> <!-- Resource Usage --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>📊 Recursos</h2> </div> <div style="space-y: 1rem;" data-astro-cid-fx2vmlsa> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>CPU</span> <span style="color: white;" data-astro-cid-fx2vmlsa>45%</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 45%" data-astro-cid-fx2vmlsa></div> </div> <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>Memória</span> <span style="color: white;" data-astro-cid-fx2vmlsa>2.8GB / 8GB</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 35%" data-astro-cid-fx2vmlsa></div> </div> <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>GPU</span> <span style="color: white;" data-astro-cid-fx2vmlsa>78%</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 78%; background: linear-gradient(90deg, #00ff9d, #00d4ff);" data-astro-cid-fx2vmlsa></div> </div> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load ML/AI data
        async function loadMLData() {
            try {
                const response = await fetch(\`\${API_URL}/api/admin/ml\`);
                const data = await response.json();

                updateStats(data);
                loadModels(data.models || []);
                loadTrainingJobs(data.trainingJobs || []);
                loadPredictions(data.predictions || []);
                loadPerformanceChart(data.performanceData || {});
            } catch (e) {
                console.error('Error loading ML data:', e);
                loadMockMLData();
            }
        }

        function updateStats(data) {
            document.getElementById('active-models').textContent = data.activeModels || 12;
            document.getElementById('predictions-today').textContent = (data.predictionsToday || 45200).toLocaleString();
            document.getElementById('accuracy').textContent = (data.accuracy || 96.8) + '%';
            document.getElementById('training-jobs').textContent = data.trainingJobs || 3;
        }

        function loadModels(models) {
            const modelsList = document.getElementById('models-list');

            if (models.length === 0) {
                models = [
                    { name: 'Sentiment Analysis v2.1', desc: 'Análise de sentimentos com BERT', status: 'active', accuracy: 94.2, predictions: 15420 },
                    { name: 'User Clustering', desc: 'Segmentação de usuários K-means', status: 'training', accuracy: 87.6, predictions: 8900 },
                    { name: 'Recommendation Engine', desc: 'Sistema de recomendações colaborativo', status: 'active', accuracy: 91.8, predictions: 22100 },
                    { name: 'Content Classifier', desc: 'Classificação automática de conteúdo', status: 'active', accuracy: 96.1, predictions: 12800 },
                    { name: 'Fraud Detection', desc: 'Detecção de fraudes com ML', status: 'inactive', accuracy: 0, predictions: 0 }
                ];
            }

            modelsList.innerHTML = models.map(model => \`
                <div class="model-item">
                    <div class="model-info">
                        <div class="model-name">
                            <span class="status-indicator status-\${model.status}"></span>
                            \${model.name}
                        </div>
                        <div class="model-desc">\${model.desc}</div>
                    </div>
                    <div class="model-metrics">
                        <div class="metric-badge">\${model.accuracy}% acc</div>
                        <div class="metric-badge">\${model.predictions.toLocaleString()} pred</div>
                        <button class="btn btn-outline" onclick="configureModel('\${model.name}')">⚙️</button>
                    </div>
                </div>
            \`).join('');
        }

        function loadPerformanceChart(performanceData) {
            const ctx = document.getElementById('modelPerformanceChart').getContext('2d');

            const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const accuracyData = performanceData.accuracy || [94, 95, 93, 96, 94, 97, 95];
            const latencyData = performanceData.latency || [120, 115, 130, 110, 125, 105, 118];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Acurácia (%)',
                        data: accuracyData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y'
                    }, {
                        label: 'Latência (ms)',
                        data: latencyData,
                        borderColor: '#00ff9d',
                        backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });
        }

        function loadTrainingJobs(jobs) {
            const jobsList = document.getElementById('training-jobs');

            if (jobs.length === 0) {
                jobs = [
                    { name: 'User Clustering v3.0', progress: 75, eta: '2h 30min', status: 'running' },
                    { name: 'Sentiment Model Fine-tuning', progress: 45, eta: '4h 15min', status: 'running' },
                    { name: 'Recommendation Engine Update', progress: 10, eta: '8h 45min', status: 'queued' }
                ];
            }

            jobsList.innerHTML = jobs.map(job => \`
                <div class="job-item">
                    <div class="job-info">
                        <h4>\${job.name}</h4>
                        <p>ETA: \${job.eta} • Status: \${job.status}</p>
                    </div>
                    <div class="job-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${job.progress}%"></div>
                        </div>
                        <div style="text-align: center; margin-top: 0.25rem; color: #94a3b8; font-size: 0.8rem;">\${job.progress}%</div>
                    </div>
                    <button class="btn btn-outline" onclick="viewJob('\${job.name}')">Ver</button>
                </div>
            \`).join('');
        }

        function loadPredictions(predictions) {
            const predictionsList = document.getElementById('predictions-list');

            if (predictions.length === 0) {
                predictions = [
                    { text: 'Produto excelente, muito satisfeito!', result: 'positive', confidence: 0.92, timestamp: '14:32:15' },
                    { text: 'A entrega demorou mais que o esperado', result: 'neutral', confidence: 0.78, timestamp: '14:31:42' },
                    { text: 'Péssimo atendimento, não recomendo', result: 'negative', confidence: 0.89, timestamp: '14:30:18' },
                    { text: 'Interface muito intuitiva e moderna', result: 'positive', confidence: 0.95, timestamp: '14:29:33' },
                    { text: 'Preço justo pela qualidade oferecida', result: 'positive', confidence: 0.87, timestamp: '14:28:51' }
                ];
            }

            predictionsList.innerHTML = predictions.map(pred => \`
                <div class="prediction-item">
                    <div class="prediction-content">
                        <div class="prediction-text">"\${pred.text}"</div>
                        <div class="prediction-meta">\${pred.timestamp} • \${Math.round(pred.confidence * 100)}% confiança</div>
                    </div>
                    <span class="prediction-result result-\${pred.result}">\${pred.result === 'positive' ? '😊' : pred.result === 'neutral' ? '😐' : '😠'} \${pred.result}</span>
                </div>
            \`).join('');
        }

        function loadMockMLData() {
            updateStats({
                activeModels: 12,
                predictionsToday: 45200,
                accuracy: 96.8,
                trainingJobs: 3
            });

            loadModels([]);
            loadTrainingJobs([]);
            loadPredictions([]);
            loadPerformanceChart({});
        }

        // Action functions
        function refreshModels() {
            loadMLData();
        }

        function configureModel(modelName) {
            alert(\`Configurando modelo: \${modelName}\\n\\nOpções disponíveis:\\n- Parâmetros de treinamento\\n- Thresholds de decisão\\n- Limites de recursos\\n- Logs e monitoramento\`);
        }

        function configureSentiment() {
            alert('Configuração de Análise de Sentimentos:\\n\\n- Modelos de linguagem (BERT, GPT, Claude)\\n- Línguas suportadas\\n- Sensibilidade de detecção\\n- Filtros de conteúdo\\n- Relatórios de performance');
        }

        function viewSentimentDetails() {
            alert('Detalhes da Análise de Sentimentos:\\n\\n📈 Tendências temporais\\n🎯 Distribuição por categoria\\n📊 Acurácia por idioma\\n🔍 Exemplos de classificações\\n📋 Relatórios de sentimento');
        }

        function startNewTraining() {
            alert('Iniciar Novo Treinamento:\\n\\n1. Selecionar tipo de modelo\\n2. Escolher dataset\\n3. Configurar hiperparâmetros\\n4. Definir recursos (CPU/GPU)\\n5. Agendar execução\\n\\nRedirecionando para assistente...');
        }

        function viewJob(jobName) {
            alert(\`Detalhes do job: \${jobName}\\n\\n📊 Progresso em tempo real\\n📋 Logs de execução\\n⚙️ Configurações atuais\\n🎯 Métricas de performance\\n⏰ Tempo estimado restante\`);
        }

        function exportPredictions() {
            alert('Exportando predições...\\n\\n📊 Dados das últimas 24h\\n📈 Análises de sentimento\\n🎯 Classificações por categoria\\n📋 Relatórios detalhados\\n\\nArquivo JSON gerado!');
        }

        function retrainAllModels() {
            if (confirm('Retreinar TODOS os modelos? Esta operação pode levar várias horas e consumir recursos significativos.')) {
                alert('Iniciando retreinamento de todos os modelos...\\n\\n🔄 Preparando datasets\\n⚙️ Configurando hiperparâmetros\\n🚀 Iniciando treinamento\\n📊 Monitoramento em tempo real\\n\\nVocê será notificado quando concluído.');
            }
        }

        function clearCache() {
            if (confirm('Limpar cache de ML? Isso pode afetar temporariamente a performance das predições.')) {
                alert('Cache de ML limpo com sucesso!\\n\\n🗑️ Dados temporários removidos\\n⚡ Performance otimizada\\n🔄 Modelos recarregados');
            }
        }

        function runDiagnostics() {
            alert('Executando diagnóstico completo do sistema ML...\\n\\n🤖 Verificando modelos\\n📊 Analisando performance\\n🔗 Testando conexões\\n⚡ Verificando recursos\\n📋 Gerando relatório\\n\\nDiagnóstico concluído: Sistema saudável!');
        }

        function emergencyStop() {
            if (confirm('🚨 PARADA DE EMERGÊNCIA: Isso irá parar TODOS os processos de ML, incluindo treinamentos em andamento. Continuar?')) {
                alert('Todos os processos de ML foram interrompidos!\\n\\n⏹️ Treinamentos pausados\\n🔄 Modelos descarregados\\n⚠️ Sistema em modo de segurança\\n\\nContate o administrador para reativação.');
            }
        }

        function pauseAllModels() {
            alert('Todos os modelos foram pausados!\\n\\n⏸️ Predições interrompidas\\n💾 Estado salvo\\n▶️ Pronto para retomar');
        }

        function resumeAllModels() {
            alert('Todos os modelos foram retomados!\\n\\n▶️ Predições ativas\\n⚡ Performance restaurada\\n📊 Monitoramento ativo');
        }

        function backupModels() {
            alert('Backup completo dos modelos criado!\\n\\n💾 Pesos e configurações salvos\\n📦 Arquivos compactados\\n☁️ Armazenamento seguro\\n🔄 Versão backup disponível');
        }

        function updateModels() {
            alert('Verificando atualizações de modelos...\\n\\n🔍 Buscando novas versões\\n⬇️ Baixando atualizações\\n⚙️ Aplicando patches\\n✅ Modelos atualizados\\n\\nSistema na versão mais recente!');
        }

        // Initialize
        loadMLData();
    <\/script> `], ["  ", "  ", `<div class="ml-container" data-astro-cid-fx2vmlsa> <!-- Header --> <div class="ml-header" data-astro-cid-fx2vmlsa> <h1 data-astro-cid-fx2vmlsa>🤖 Machine Learning & IA</h1> <p data-astro-cid-fx2vmlsa>Gerencie modelos de IA, análise de sentimentos e algoritmos de machine learning</p> </div> <!-- Stats Overview --> <div class="ml-stats" data-astro-cid-fx2vmlsa> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="active-models" data-astro-cid-fx2vmlsa>12</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Modelos Ativos</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="predictions-today" data-astro-cid-fx2vmlsa>45.2K</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Predições Hoje</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="accuracy" data-astro-cid-fx2vmlsa>96.8%</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Acurácia Média</div> </div> <div class="stat-card" data-astro-cid-fx2vmlsa> <div class="stat-value" id="training-jobs" data-astro-cid-fx2vmlsa>3</div> <div class="stat-label" data-astro-cid-fx2vmlsa>Treinos Ativos</div> </div> </div> <!-- Main Content Grid --> <div class="ml-grid" data-astro-cid-fx2vmlsa> <!-- Main Content --> <div class="ml-main" data-astro-cid-fx2vmlsa> <!-- Model Performance --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>📈 Performance dos Modelos</h2> <div style="display: flex; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <select class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" data-astro-cid-fx2vmlsa> <option data-astro-cid-fx2vmlsa>Últimas 24h</option> <option data-astro-cid-fx2vmlsa>Última semana</option> <option data-astro-cid-fx2vmlsa>Último mês</option> </select> <button class="btn btn-primary" onclick="refreshModels()" data-astro-cid-fx2vmlsa>🔄</button> </div> </div> <div class="performance-chart" data-astro-cid-fx2vmlsa> <div class="chart-container" data-astro-cid-fx2vmlsa> <canvas id="modelPerformanceChart" width="400" height="250" data-astro-cid-fx2vmlsa></canvas> </div> </div> <div id="models-list" data-astro-cid-fx2vmlsa> <!-- Models will be loaded here --> </div> </div> <!-- Sentiment Analysis --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>😊 Análise de Sentimentos</h2> <button class="btn btn-outline" onclick="configureSentiment()" data-astro-cid-fx2vmlsa>⚙️ Configurar</button> </div> <div class="sentiment-analysis" data-astro-cid-fx2vmlsa> <div class="sentiment-grid" data-astro-cid-fx2vmlsa> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-positive" id="positive-count" data-astro-cid-fx2vmlsa>68%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Positivo</div> </div> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-neutral" id="neutral-count" data-astro-cid-fx2vmlsa>22%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Neutro</div> </div> <div class="sentiment-item" data-astro-cid-fx2vmlsa> <div class="sentiment-value sentiment-negative" id="negative-count" data-astro-cid-fx2vmlsa>10%</div> <div class="sentiment-label" data-astro-cid-fx2vmlsa>Negativo</div> </div> </div> </div> <div style="margin-top: 1rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-primary" onclick="viewSentimentDetails()" data-astro-cid-fx2vmlsa>Ver Detalhes</button> </div> </div> <!-- Training Jobs --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🎯 Jobs de Treinamento</h2> <button class="btn btn-primary" onclick="startNewTraining()" data-astro-cid-fx2vmlsa>➕ Novo Treino</button> </div> <div class="training-jobs" id="training-jobs" data-astro-cid-fx2vmlsa> <!-- Training jobs will be loaded here --> </div> </div> <!-- Recent Predictions --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🔮 Predições Recentes</h2> <button class="btn btn-outline" onclick="exportPredictions()" data-astro-cid-fx2vmlsa>📊 Exportar</button> </div> <div class="predictions-list" id="predictions-list" data-astro-cid-fx2vmlsa> <!-- Predictions will be loaded here --> </div> </div> </div> <!-- Sidebar --> <div class="ml-sidebar" data-astro-cid-fx2vmlsa> <!-- System Status --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>⚙️ Status do Sistema</h2> </div> <div class="system-status" data-astro-cid-fx2vmlsa> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>API de ML</h4> <p data-astro-cid-fx2vmlsa>Endpoint /api/ml</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Análise de Sentimentos</h4> <p data-astro-cid-fx2vmlsa>Motor Claude-3</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Sistema de Recomendações</h4> <p data-astro-cid-fx2vmlsa>Algoritmo K-means</p> </div> <span class="status-indicator status-active" data-astro-cid-fx2vmlsa></span> </div> <div class="status-item" data-astro-cid-fx2vmlsa> <div class="status-info" data-astro-cid-fx2vmlsa> <h4 data-astro-cid-fx2vmlsa>Clustering de Usuários</h4> <p data-astro-cid-fx2vmlsa>Processamento em lote</p> </div> <span class="status-indicator status-training" data-astro-cid-fx2vmlsa></span> </div> </div> </div> <!-- Quick Actions --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>⚡ Ações Rápidas</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-outline" onclick="retrainAllModels()" data-astro-cid-fx2vmlsa>🔄 Retreinar Modelos</button> <button class="btn btn-outline" onclick="clearCache()" data-astro-cid-fx2vmlsa>🗑️ Limpar Cache</button> <button class="btn btn-outline" onclick="runDiagnostics()" data-astro-cid-fx2vmlsa>🩺 Diagnóstico</button> <button class="btn btn-danger" onclick="emergencyStop()" data-astro-cid-fx2vmlsa>🚨 Parar Tudo</button> </div> </div> <!-- Model Controls --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>🎛️ Controles</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-fx2vmlsa> <button class="btn btn-outline" onclick="pauseAllModels()" data-astro-cid-fx2vmlsa>⏸️ Pausar Todos</button> <button class="btn btn-outline" onclick="resumeAllModels()" data-astro-cid-fx2vmlsa>▶️ Retomar Todos</button> <button class="btn btn-outline" onclick="backupModels()" data-astro-cid-fx2vmlsa>💾 Backup</button> <button class="btn btn-outline" onclick="updateModels()" data-astro-cid-fx2vmlsa>⬆️ Atualizar</button> </div> </div> <!-- Resource Usage --> <div class="ml-card" data-astro-cid-fx2vmlsa> <div class="card-header" data-astro-cid-fx2vmlsa> <h2 class="card-title" data-astro-cid-fx2vmlsa>📊 Recursos</h2> </div> <div style="space-y: 1rem;" data-astro-cid-fx2vmlsa> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>CPU</span> <span style="color: white;" data-astro-cid-fx2vmlsa>45%</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 45%" data-astro-cid-fx2vmlsa></div> </div> <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>Memória</span> <span style="color: white;" data-astro-cid-fx2vmlsa>2.8GB / 8GB</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 35%" data-astro-cid-fx2vmlsa></div> </div> <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" data-astro-cid-fx2vmlsa> <span style="color: #94a3b8;" data-astro-cid-fx2vmlsa>GPU</span> <span style="color: white;" data-astro-cid-fx2vmlsa>78%</span> </div> <div class="progress-bar" data-astro-cid-fx2vmlsa> <div class="progress-fill" style="width: 78%; background: linear-gradient(90deg, #00ff9d, #00d4ff);" data-astro-cid-fx2vmlsa></div> </div> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load ML/AI data
        async function loadMLData() {
            try {
                const response = await fetch(\\\`\\\${API_URL}/api/admin/ml\\\`);
                const data = await response.json();

                updateStats(data);
                loadModels(data.models || []);
                loadTrainingJobs(data.trainingJobs || []);
                loadPredictions(data.predictions || []);
                loadPerformanceChart(data.performanceData || {});
            } catch (e) {
                console.error('Error loading ML data:', e);
                loadMockMLData();
            }
        }

        function updateStats(data) {
            document.getElementById('active-models').textContent = data.activeModels || 12;
            document.getElementById('predictions-today').textContent = (data.predictionsToday || 45200).toLocaleString();
            document.getElementById('accuracy').textContent = (data.accuracy || 96.8) + '%';
            document.getElementById('training-jobs').textContent = data.trainingJobs || 3;
        }

        function loadModels(models) {
            const modelsList = document.getElementById('models-list');

            if (models.length === 0) {
                models = [
                    { name: 'Sentiment Analysis v2.1', desc: 'Análise de sentimentos com BERT', status: 'active', accuracy: 94.2, predictions: 15420 },
                    { name: 'User Clustering', desc: 'Segmentação de usuários K-means', status: 'training', accuracy: 87.6, predictions: 8900 },
                    { name: 'Recommendation Engine', desc: 'Sistema de recomendações colaborativo', status: 'active', accuracy: 91.8, predictions: 22100 },
                    { name: 'Content Classifier', desc: 'Classificação automática de conteúdo', status: 'active', accuracy: 96.1, predictions: 12800 },
                    { name: 'Fraud Detection', desc: 'Detecção de fraudes com ML', status: 'inactive', accuracy: 0, predictions: 0 }
                ];
            }

            modelsList.innerHTML = models.map(model => \\\`
                <div class="model-item">
                    <div class="model-info">
                        <div class="model-name">
                            <span class="status-indicator status-\\\${model.status}"></span>
                            \\\${model.name}
                        </div>
                        <div class="model-desc">\\\${model.desc}</div>
                    </div>
                    <div class="model-metrics">
                        <div class="metric-badge">\\\${model.accuracy}% acc</div>
                        <div class="metric-badge">\\\${model.predictions.toLocaleString()} pred</div>
                        <button class="btn btn-outline" onclick="configureModel('\\\${model.name}')">⚙️</button>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadPerformanceChart(performanceData) {
            const ctx = document.getElementById('modelPerformanceChart').getContext('2d');

            const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const accuracyData = performanceData.accuracy || [94, 95, 93, 96, 94, 97, 95];
            const latencyData = performanceData.latency || [120, 115, 130, 110, 125, 105, 118];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Acurácia (%)',
                        data: accuracyData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y'
                    }, {
                        label: 'Latência (ms)',
                        data: latencyData,
                        borderColor: '#00ff9d',
                        backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });
        }

        function loadTrainingJobs(jobs) {
            const jobsList = document.getElementById('training-jobs');

            if (jobs.length === 0) {
                jobs = [
                    { name: 'User Clustering v3.0', progress: 75, eta: '2h 30min', status: 'running' },
                    { name: 'Sentiment Model Fine-tuning', progress: 45, eta: '4h 15min', status: 'running' },
                    { name: 'Recommendation Engine Update', progress: 10, eta: '8h 45min', status: 'queued' }
                ];
            }

            jobsList.innerHTML = jobs.map(job => \\\`
                <div class="job-item">
                    <div class="job-info">
                        <h4>\\\${job.name}</h4>
                        <p>ETA: \\\${job.eta} • Status: \\\${job.status}</p>
                    </div>
                    <div class="job-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \\\${job.progress}%"></div>
                        </div>
                        <div style="text-align: center; margin-top: 0.25rem; color: #94a3b8; font-size: 0.8rem;">\\\${job.progress}%</div>
                    </div>
                    <button class="btn btn-outline" onclick="viewJob('\\\${job.name}')">Ver</button>
                </div>
            \\\`).join('');
        }

        function loadPredictions(predictions) {
            const predictionsList = document.getElementById('predictions-list');

            if (predictions.length === 0) {
                predictions = [
                    { text: 'Produto excelente, muito satisfeito!', result: 'positive', confidence: 0.92, timestamp: '14:32:15' },
                    { text: 'A entrega demorou mais que o esperado', result: 'neutral', confidence: 0.78, timestamp: '14:31:42' },
                    { text: 'Péssimo atendimento, não recomendo', result: 'negative', confidence: 0.89, timestamp: '14:30:18' },
                    { text: 'Interface muito intuitiva e moderna', result: 'positive', confidence: 0.95, timestamp: '14:29:33' },
                    { text: 'Preço justo pela qualidade oferecida', result: 'positive', confidence: 0.87, timestamp: '14:28:51' }
                ];
            }

            predictionsList.innerHTML = predictions.map(pred => \\\`
                <div class="prediction-item">
                    <div class="prediction-content">
                        <div class="prediction-text">"\\\${pred.text}"</div>
                        <div class="prediction-meta">\\\${pred.timestamp} • \\\${Math.round(pred.confidence * 100)}% confiança</div>
                    </div>
                    <span class="prediction-result result-\\\${pred.result}">\\\${pred.result === 'positive' ? '😊' : pred.result === 'neutral' ? '😐' : '😠'} \\\${pred.result}</span>
                </div>
            \\\`).join('');
        }

        function loadMockMLData() {
            updateStats({
                activeModels: 12,
                predictionsToday: 45200,
                accuracy: 96.8,
                trainingJobs: 3
            });

            loadModels([]);
            loadTrainingJobs([]);
            loadPredictions([]);
            loadPerformanceChart({});
        }

        // Action functions
        function refreshModels() {
            loadMLData();
        }

        function configureModel(modelName) {
            alert(\\\`Configurando modelo: \\\${modelName}\\\\n\\\\nOpções disponíveis:\\\\n- Parâmetros de treinamento\\\\n- Thresholds de decisão\\\\n- Limites de recursos\\\\n- Logs e monitoramento\\\`);
        }

        function configureSentiment() {
            alert('Configuração de Análise de Sentimentos:\\\\n\\\\n- Modelos de linguagem (BERT, GPT, Claude)\\\\n- Línguas suportadas\\\\n- Sensibilidade de detecção\\\\n- Filtros de conteúdo\\\\n- Relatórios de performance');
        }

        function viewSentimentDetails() {
            alert('Detalhes da Análise de Sentimentos:\\\\n\\\\n📈 Tendências temporais\\\\n🎯 Distribuição por categoria\\\\n📊 Acurácia por idioma\\\\n🔍 Exemplos de classificações\\\\n📋 Relatórios de sentimento');
        }

        function startNewTraining() {
            alert('Iniciar Novo Treinamento:\\\\n\\\\n1. Selecionar tipo de modelo\\\\n2. Escolher dataset\\\\n3. Configurar hiperparâmetros\\\\n4. Definir recursos (CPU/GPU)\\\\n5. Agendar execução\\\\n\\\\nRedirecionando para assistente...');
        }

        function viewJob(jobName) {
            alert(\\\`Detalhes do job: \\\${jobName}\\\\n\\\\n📊 Progresso em tempo real\\\\n📋 Logs de execução\\\\n⚙️ Configurações atuais\\\\n🎯 Métricas de performance\\\\n⏰ Tempo estimado restante\\\`);
        }

        function exportPredictions() {
            alert('Exportando predições...\\\\n\\\\n📊 Dados das últimas 24h\\\\n📈 Análises de sentimento\\\\n🎯 Classificações por categoria\\\\n📋 Relatórios detalhados\\\\n\\\\nArquivo JSON gerado!');
        }

        function retrainAllModels() {
            if (confirm('Retreinar TODOS os modelos? Esta operação pode levar várias horas e consumir recursos significativos.')) {
                alert('Iniciando retreinamento de todos os modelos...\\\\n\\\\n🔄 Preparando datasets\\\\n⚙️ Configurando hiperparâmetros\\\\n🚀 Iniciando treinamento\\\\n📊 Monitoramento em tempo real\\\\n\\\\nVocê será notificado quando concluído.');
            }
        }

        function clearCache() {
            if (confirm('Limpar cache de ML? Isso pode afetar temporariamente a performance das predições.')) {
                alert('Cache de ML limpo com sucesso!\\\\n\\\\n🗑️ Dados temporários removidos\\\\n⚡ Performance otimizada\\\\n🔄 Modelos recarregados');
            }
        }

        function runDiagnostics() {
            alert('Executando diagnóstico completo do sistema ML...\\\\n\\\\n🤖 Verificando modelos\\\\n📊 Analisando performance\\\\n🔗 Testando conexões\\\\n⚡ Verificando recursos\\\\n📋 Gerando relatório\\\\n\\\\nDiagnóstico concluído: Sistema saudável!');
        }

        function emergencyStop() {
            if (confirm('🚨 PARADA DE EMERGÊNCIA: Isso irá parar TODOS os processos de ML, incluindo treinamentos em andamento. Continuar?')) {
                alert('Todos os processos de ML foram interrompidos!\\\\n\\\\n⏹️ Treinamentos pausados\\\\n🔄 Modelos descarregados\\\\n⚠️ Sistema em modo de segurança\\\\n\\\\nContate o administrador para reativação.');
            }
        }

        function pauseAllModels() {
            alert('Todos os modelos foram pausados!\\\\n\\\\n⏸️ Predições interrompidas\\\\n💾 Estado salvo\\\\n▶️ Pronto para retomar');
        }

        function resumeAllModels() {
            alert('Todos os modelos foram retomados!\\\\n\\\\n▶️ Predições ativas\\\\n⚡ Performance restaurada\\\\n📊 Monitoramento ativo');
        }

        function backupModels() {
            alert('Backup completo dos modelos criado!\\\\n\\\\n💾 Pesos e configurações salvos\\\\n📦 Arquivos compactados\\\\n☁️ Armazenamento seguro\\\\n🔄 Versão backup disponível');
        }

        function updateModels() {
            alert('Verificando atualizações de modelos...\\\\n\\\\n🔍 Buscando novas versões\\\\n⬇️ Baixando atualizações\\\\n⚙️ Aplicando patches\\\\n✅ Modelos atualizados\\\\n\\\\nSistema na versão mais recente!');
        }

        // Initialize
        loadMLData();
    <\/script> `])), renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/admin/ml-ai.astro?astro&type=script&index=0&lang.ts"), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/ml-ai.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/ml-ai.astro";
const $$url = "/admin/ml-ai";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$MlAi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
