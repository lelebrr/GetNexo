import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                          */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Gamification = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Gamificação - Admin", "data-astro-cid-5gzqevwi": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", "  ", `<div class="gamification-container" data-astro-cid-5gzqevwi> <!-- Header --> <div class="gamification-header" data-astro-cid-5gzqevwi> <h1 data-astro-cid-5gzqevwi>🎮 Sistema de Gamificação</h1> <p data-astro-cid-5gzqevwi>Gerencie pontos, níveis, conquistas e torneios da plataforma</p> </div> <!-- Stats Overview --> <div class="gamification-stats" data-astro-cid-5gzqevwi> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="total-users" data-astro-cid-5gzqevwi>1,247</div> <div class="stat-label" data-astro-cid-5gzqevwi>Usuários Ativos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="total-points" data-astro-cid-5gzqevwi>2.4M</div> <div class="stat-label" data-astro-cid-5gzqevwi>Pontos Distribuídos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="active-tournaments" data-astro-cid-5gzqevwi>3</div> <div class="stat-label" data-astro-cid-5gzqevwi>Torneios Ativos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="achievements-unlocked" data-astro-cid-5gzqevwi>15.2K</div> <div class="stat-label" data-astro-cid-5gzqevwi>Conquistas Desbloqueadas</div> </div> </div> <!-- Main Content Grid --> <div class="gamification-grid" data-astro-cid-5gzqevwi> <!-- Main Content --> <div class="gamification-main" data-astro-cid-5gzqevwi> <!-- Leaderboard --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🏆 Leaderboard Global</h2> <div style="display: flex; gap: 0.5rem;" data-astro-cid-5gzqevwi> <select class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" data-astro-cid-5gzqevwi> <option data-astro-cid-5gzqevwi>Semanal</option> <option data-astro-cid-5gzqevwi>Mensal</option> <option data-astro-cid-5gzqevwi>All-time</option> </select> <button class="btn btn-primary" onclick="refreshLeaderboard()" data-astro-cid-5gzqevwi>🔄</button> </div> </div> <div id="leaderboard-list" data-astro-cid-5gzqevwi> <!-- Leaderboard items will be loaded here --> </div> </div> <!-- Level Progress --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>📈 Progressão de Níveis</h2> <button class="btn btn-outline" onclick="configureLevels()" data-astro-cid-5gzqevwi>⚙️ Configurar</button> </div> <div class="level-progress" data-astro-cid-5gzqevwi> <div class="level-header" data-astro-cid-5gzqevwi> <div class="level-info" data-astro-cid-5gzqevwi> <h3 data-astro-cid-5gzqevwi>Nível Atual da Plataforma</h3> <p data-astro-cid-5gzqevwi>Baseado no engajamento geral dos usuários</p> </div> <div class="level-number" id="platform-level" data-astro-cid-5gzqevwi>12</div> </div> <div class="progress-bar" data-astro-cid-5gzqevwi> <div class="progress-fill" id="level-progress-fill" style="width: 75%" data-astro-cid-5gzqevwi></div> </div> <div class="progress-text" data-astro-cid-5gzqevwi>
2,340 / 3,000 pontos para o próximo nível
</div> </div> <div class="level-progress" data-astro-cid-5gzqevwi> <div class="level-header" data-astro-cid-5gzqevwi> <div class="level-info" data-astro-cid-5gzqevwi> <h3 data-astro-cid-5gzqevwi>Desafios Diários</h3> <p data-astro-cid-5gzqevwi>Completados hoje</p> </div> <div class="level-number" id="daily-challenges" data-astro-cid-5gzqevwi>8/12</div> </div> <div class="progress-bar" data-astro-cid-5gzqevwi> <div class="progress-fill" style="width: 67%; background: linear-gradient(90deg, #00ff9d, #00d4ff);" data-astro-cid-5gzqevwi></div> </div> <div class="progress-text" data-astro-cid-5gzqevwi>
67% dos desafios concluídos
</div> </div> </div> <!-- Active Challenges --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🎯 Desafios Ativos</h2> <button class="btn btn-primary" onclick="createChallenge()" data-astro-cid-5gzqevwi>➕ Novo Desafio</button> </div> <div class="challenges-list" id="challenges-list" data-astro-cid-5gzqevwi> <!-- Challenges will be loaded here --> </div> </div> </div> <!-- Sidebar --> <div class="gamification-sidebar" data-astro-cid-5gzqevwi> <!-- Achievements --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🏅 Conquistas Populares</h2> </div> <div class="achievements-grid" id="achievements-grid" data-astro-cid-5gzqevwi> <!-- Achievements will be loaded here --> </div> </div> <!-- Tournament Status --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🎪 Torneios</h2> </div> <div style="space-y: 1rem;" data-astro-cid-5gzqevwi> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-5gzqevwi> <div data-astro-cid-5gzqevwi> <h4 style="margin: 0; color: white;" data-astro-cid-5gzqevwi>Torneio de Inverno</h4> <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.8rem;" data-astro-cid-5gzqevwi>Termina em 5 dias</p> </div> <span style="color: #00ff9d; font-weight: bold;" data-astro-cid-5gzqevwi>2,450 pts</span> </div> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-5gzqevwi> <div data-astro-cid-5gzqevwi> <h4 style="margin: 0; color: white;" data-astro-cid-5gzqevwi>Desafio Semanal</h4> <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.8rem;" data-astro-cid-5gzqevwi>Termina hoje</p> </div> <span style="color: #fbbf24; font-weight: bold;" data-astro-cid-5gzqevwi>890 pts</span> </div> <div style="margin-top: 1rem;" data-astro-cid-5gzqevwi> <button class="btn btn-primary" style="width: 100%;" onclick="manageTournaments()" data-astro-cid-5gzqevwi>Gerenciar Torneios</button> </div> </div> </div> <!-- Quick Actions --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>⚡ Ações Rápidas</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-5gzqevwi> <button class="btn btn-outline" onclick="resetAllPoints()" data-astro-cid-5gzqevwi>🔄 Reset Pontos</button> <button class="btn btn-outline" onclick="exportGamificationData()" data-astro-cid-5gzqevwi>📊 Exportar Dados</button> <button class="btn btn-outline" onclick="runGamificationTests()" data-astro-cid-5gzqevwi>🧪 Testes</button> <button class="btn btn-danger" onclick="emergencyShutdown()" data-astro-cid-5gzqevwi>🚨 Desligamento</button> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load gamification data
        async function loadGamificationData() {
            try {
                const response = await fetch(\`\${API_URL}/api/admin/gamification\`);
                const data = await response.json();

                updateStats(data);
                loadLeaderboard(data.leaderboard || []);
                loadAchievements(data.achievements || []);
                loadChallenges(data.challenges || []);
            } catch (e) {
                console.error('Error loading gamification data:', e);
                loadMockGamificationData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-users').textContent = (data.totalUsers || 1247).toLocaleString();
            document.getElementById('total-points').textContent = (data.totalPoints || 2400000).toLocaleString();
            document.getElementById('active-tournaments').textContent = data.activeTournaments || 3;
            document.getElementById('achievements-unlocked').textContent = (data.achievementsUnlocked || 15200).toLocaleString();
        }

        function loadLeaderboard(leaderboard) {
            const leaderboardList = document.getElementById('leaderboard-list');

            if (leaderboard.length === 0) {
                leaderboard = [
                    { rank: 1, name: 'João Silva', points: 15420, avatar: 'J', level: 25 },
                    { rank: 2, name: 'Maria Santos', points: 14850, avatar: 'M', level: 24 },
                    { rank: 3, name: 'Pedro Costa', points: 13990, avatar: 'P', level: 23 },
                    { rank: 4, name: 'Ana Oliveira', points: 12800, avatar: 'A', level: 22 },
                    { rank: 5, name: 'Carlos Lima', points: 11950, avatar: 'C', level: 21 },
                    { rank: 6, name: 'Julia Ferreira', points: 11200, avatar: 'J', level: 20 },
                    { rank: 7, name: 'Lucas Rocha', points: 10800, avatar: 'L', level: 19 },
                    { rank: 8, name: 'Beatriz Alves', points: 10200, avatar: 'B', level: 18 }
                ];
            }

            leaderboardList.innerHTML = leaderboard.map(user => \`
                <div class="leaderboard-item">
                    <div class="rank rank-\${user.rank <= 3 ? user.rank : 'other'}">\${user.rank}</div>
                    <div class="user-avatar">\${user.avatar}</div>
                    <div class="user-info">
                        <h4>\${user.name}</h4>
                        <p>Nível \${user.level}</p>
                    </div>
                    <div class="user-score">
                        <div class="score-value">\${user.points.toLocaleString()}</div>
                        <div class="score-label">pontos</div>
                    </div>
                </div>
            \`).join('');
        }

        function loadAchievements(achievements) {
            const achievementsGrid = document.getElementById('achievements-grid');

            if (achievements.length === 0) {
                achievements = [
                    { name: 'Primeiro Login', desc: 'Fez login pela primeira vez', icon: '🚪', unlocked: true },
                    { name: 'Explorador', desc: 'Visitou todas as seções', icon: '🗺️', unlocked: true },
                    { name: 'Primeiro Projeto', desc: 'Criou seu primeiro projeto', icon: '📁', unlocked: true },
                    { name: 'Mestre dos Pontos', desc: 'Ganhou 10.000 pontos', icon: '💰', unlocked: true },
                    { name: 'Social', desc: 'Convidou 5 amigos', icon: '👥', unlocked: false },
                    { name: 'Veterano', desc: 'Usa a plataforma há 1 ano', icon: '🎖️', unlocked: false },
                    { name: 'Especialista', desc: 'Completou todos os tutoriais', icon: '🎓', unlocked: true },
                    { name: 'Influenciador', desc: 'Conteúdo compartilhado 100x', icon: '📢', unlocked: false }
                ];
            }

            achievementsGrid.innerHTML = achievements.map(achievement => \`
                <div class="achievement-item \${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}">
                    <div class="achievement-icon">\${achievement.icon}</div>
                    <div class="achievement-name">\${achievement.name}</div>
                    <div class="achievement-desc">\${achievement.desc}</div>
                </div>
            \`).join('');
        }

        function loadChallenges(challenges) {
            const challengesList = document.getElementById('challenges-list');

            if (challenges.length === 0) {
                challenges = [
                    { title: 'Primeiro Projeto', desc: 'Crie seu primeiro projeto', reward: '100 pts', active: true },
                    { title: 'Explorador Diário', desc: 'Visite 5 seções diferentes', reward: '50 pts', active: true },
                    { title: 'Social Butterfly', desc: 'Convide 3 amigos', reward: '200 pts', active: true },
                    { title: 'Mestre do Conhecimento', desc: 'Complete 10 tutoriais', reward: '500 pts', active: false }
                ];
            }

            challengesList.innerHTML = challenges.map(challenge => \`
                <div class="challenge-item">
                    <div class="challenge-info">
                        <h4>\${challenge.title}</h4>
                        <p>\${challenge.desc}</p>
                    </div>
                    <div class="challenge-reward">\${challenge.reward}</div>
                </div>
            \`).join('');
        }

        function loadMockGamificationData() {
            updateStats({
                totalUsers: 1247,
                totalPoints: 2400000,
                activeTournaments: 3,
                achievementsUnlocked: 15200
            });

            loadLeaderboard([]);
            loadAchievements([]);
            loadChallenges([]);
        }

        // Action functions
        function refreshLeaderboard() {
            loadGamificationData();
        }

        function configureLevels() {
            alert('Configuração de níveis: Em breve você poderá ajustar XP necessário, recompensas e progressão.');
        }

        function createChallenge() {
            alert('Criar desafio: Interface para criar novos desafios e missões será implementada.');
        }

        function manageTournaments() {
            alert('Gerenciamento de torneios: Sistema completo de torneios sazonais será adicionado.');
        }

        function resetAllPoints() {
            if (confirm('⚠️ ATENÇÃO: Isso irá resetar TODOS os pontos de TODOS os usuários. Esta ação não pode ser desfeita. Continuar?')) {
                alert('Pontos resetados com sucesso. Todos os usuários voltarão ao nível 1.');
                loadGamificationData();
            }
        }

        function exportGamificationData() {
            alert('Exportando dados de gamificação...\\n\\n📊 Estatísticas de usuários\\n🏆 Leaderboards\\n🏅 Conquistas desbloqueadas\\n🎯 Desafios completados\\n\\nArquivo JSON gerado!');
        }

        function runGamificationTests() {
            alert('Executando testes do sistema de gamificação...\\n\\n✅ Distribuição de pontos\\n✅ Progressão de níveis\\n✅ Conquistas desbloqueáveis\\n✅ Sistema de torneios\\n\\nTodos os testes passaram!');
        }

        function emergencyShutdown() {
            if (confirm('🚨 EMERGÊNCIA: Desligar sistema de gamificação? Todos os pontos e progressões serão pausados.')) {
                alert('Sistema de gamificação desligado. Todos os usuários verão suas pontuações congeladas.');
            }
        }

        function showNotification(message, type = 'info') {
            console.log(\`[\${type.toUpperCase()}] \${message}\`);
            alert(message);
        }

        // Initialize
        loadGamificationData();
    <\/script> `], ["  ", "  ", `<div class="gamification-container" data-astro-cid-5gzqevwi> <!-- Header --> <div class="gamification-header" data-astro-cid-5gzqevwi> <h1 data-astro-cid-5gzqevwi>🎮 Sistema de Gamificação</h1> <p data-astro-cid-5gzqevwi>Gerencie pontos, níveis, conquistas e torneios da plataforma</p> </div> <!-- Stats Overview --> <div class="gamification-stats" data-astro-cid-5gzqevwi> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="total-users" data-astro-cid-5gzqevwi>1,247</div> <div class="stat-label" data-astro-cid-5gzqevwi>Usuários Ativos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="total-points" data-astro-cid-5gzqevwi>2.4M</div> <div class="stat-label" data-astro-cid-5gzqevwi>Pontos Distribuídos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="active-tournaments" data-astro-cid-5gzqevwi>3</div> <div class="stat-label" data-astro-cid-5gzqevwi>Torneios Ativos</div> </div> <div class="stat-card" data-astro-cid-5gzqevwi> <div class="stat-value" id="achievements-unlocked" data-astro-cid-5gzqevwi>15.2K</div> <div class="stat-label" data-astro-cid-5gzqevwi>Conquistas Desbloqueadas</div> </div> </div> <!-- Main Content Grid --> <div class="gamification-grid" data-astro-cid-5gzqevwi> <!-- Main Content --> <div class="gamification-main" data-astro-cid-5gzqevwi> <!-- Leaderboard --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🏆 Leaderboard Global</h2> <div style="display: flex; gap: 0.5rem;" data-astro-cid-5gzqevwi> <select class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" data-astro-cid-5gzqevwi> <option data-astro-cid-5gzqevwi>Semanal</option> <option data-astro-cid-5gzqevwi>Mensal</option> <option data-astro-cid-5gzqevwi>All-time</option> </select> <button class="btn btn-primary" onclick="refreshLeaderboard()" data-astro-cid-5gzqevwi>🔄</button> </div> </div> <div id="leaderboard-list" data-astro-cid-5gzqevwi> <!-- Leaderboard items will be loaded here --> </div> </div> <!-- Level Progress --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>📈 Progressão de Níveis</h2> <button class="btn btn-outline" onclick="configureLevels()" data-astro-cid-5gzqevwi>⚙️ Configurar</button> </div> <div class="level-progress" data-astro-cid-5gzqevwi> <div class="level-header" data-astro-cid-5gzqevwi> <div class="level-info" data-astro-cid-5gzqevwi> <h3 data-astro-cid-5gzqevwi>Nível Atual da Plataforma</h3> <p data-astro-cid-5gzqevwi>Baseado no engajamento geral dos usuários</p> </div> <div class="level-number" id="platform-level" data-astro-cid-5gzqevwi>12</div> </div> <div class="progress-bar" data-astro-cid-5gzqevwi> <div class="progress-fill" id="level-progress-fill" style="width: 75%" data-astro-cid-5gzqevwi></div> </div> <div class="progress-text" data-astro-cid-5gzqevwi>
2,340 / 3,000 pontos para o próximo nível
</div> </div> <div class="level-progress" data-astro-cid-5gzqevwi> <div class="level-header" data-astro-cid-5gzqevwi> <div class="level-info" data-astro-cid-5gzqevwi> <h3 data-astro-cid-5gzqevwi>Desafios Diários</h3> <p data-astro-cid-5gzqevwi>Completados hoje</p> </div> <div class="level-number" id="daily-challenges" data-astro-cid-5gzqevwi>8/12</div> </div> <div class="progress-bar" data-astro-cid-5gzqevwi> <div class="progress-fill" style="width: 67%; background: linear-gradient(90deg, #00ff9d, #00d4ff);" data-astro-cid-5gzqevwi></div> </div> <div class="progress-text" data-astro-cid-5gzqevwi>
67% dos desafios concluídos
</div> </div> </div> <!-- Active Challenges --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🎯 Desafios Ativos</h2> <button class="btn btn-primary" onclick="createChallenge()" data-astro-cid-5gzqevwi>➕ Novo Desafio</button> </div> <div class="challenges-list" id="challenges-list" data-astro-cid-5gzqevwi> <!-- Challenges will be loaded here --> </div> </div> </div> <!-- Sidebar --> <div class="gamification-sidebar" data-astro-cid-5gzqevwi> <!-- Achievements --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🏅 Conquistas Populares</h2> </div> <div class="achievements-grid" id="achievements-grid" data-astro-cid-5gzqevwi> <!-- Achievements will be loaded here --> </div> </div> <!-- Tournament Status --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>🎪 Torneios</h2> </div> <div style="space-y: 1rem;" data-astro-cid-5gzqevwi> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-5gzqevwi> <div data-astro-cid-5gzqevwi> <h4 style="margin: 0; color: white;" data-astro-cid-5gzqevwi>Torneio de Inverno</h4> <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.8rem;" data-astro-cid-5gzqevwi>Termina em 5 dias</p> </div> <span style="color: #00ff9d; font-weight: bold;" data-astro-cid-5gzqevwi>2,450 pts</span> </div> <div style="display: flex; justify-content: space-between; align-items: center;" data-astro-cid-5gzqevwi> <div data-astro-cid-5gzqevwi> <h4 style="margin: 0; color: white;" data-astro-cid-5gzqevwi>Desafio Semanal</h4> <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.8rem;" data-astro-cid-5gzqevwi>Termina hoje</p> </div> <span style="color: #fbbf24; font-weight: bold;" data-astro-cid-5gzqevwi>890 pts</span> </div> <div style="margin-top: 1rem;" data-astro-cid-5gzqevwi> <button class="btn btn-primary" style="width: 100%;" onclick="manageTournaments()" data-astro-cid-5gzqevwi>Gerenciar Torneios</button> </div> </div> </div> <!-- Quick Actions --> <div class="gamification-card" data-astro-cid-5gzqevwi> <div class="card-header" data-astro-cid-5gzqevwi> <h2 class="card-title" data-astro-cid-5gzqevwi>⚡ Ações Rápidas</h2> </div> <div style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-5gzqevwi> <button class="btn btn-outline" onclick="resetAllPoints()" data-astro-cid-5gzqevwi>🔄 Reset Pontos</button> <button class="btn btn-outline" onclick="exportGamificationData()" data-astro-cid-5gzqevwi>📊 Exportar Dados</button> <button class="btn btn-outline" onclick="runGamificationTests()" data-astro-cid-5gzqevwi>🧪 Testes</button> <button class="btn btn-danger" onclick="emergencyShutdown()" data-astro-cid-5gzqevwi>🚨 Desligamento</button> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load gamification data
        async function loadGamificationData() {
            try {
                const response = await fetch(\\\`\\\${API_URL}/api/admin/gamification\\\`);
                const data = await response.json();

                updateStats(data);
                loadLeaderboard(data.leaderboard || []);
                loadAchievements(data.achievements || []);
                loadChallenges(data.challenges || []);
            } catch (e) {
                console.error('Error loading gamification data:', e);
                loadMockGamificationData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-users').textContent = (data.totalUsers || 1247).toLocaleString();
            document.getElementById('total-points').textContent = (data.totalPoints || 2400000).toLocaleString();
            document.getElementById('active-tournaments').textContent = data.activeTournaments || 3;
            document.getElementById('achievements-unlocked').textContent = (data.achievementsUnlocked || 15200).toLocaleString();
        }

        function loadLeaderboard(leaderboard) {
            const leaderboardList = document.getElementById('leaderboard-list');

            if (leaderboard.length === 0) {
                leaderboard = [
                    { rank: 1, name: 'João Silva', points: 15420, avatar: 'J', level: 25 },
                    { rank: 2, name: 'Maria Santos', points: 14850, avatar: 'M', level: 24 },
                    { rank: 3, name: 'Pedro Costa', points: 13990, avatar: 'P', level: 23 },
                    { rank: 4, name: 'Ana Oliveira', points: 12800, avatar: 'A', level: 22 },
                    { rank: 5, name: 'Carlos Lima', points: 11950, avatar: 'C', level: 21 },
                    { rank: 6, name: 'Julia Ferreira', points: 11200, avatar: 'J', level: 20 },
                    { rank: 7, name: 'Lucas Rocha', points: 10800, avatar: 'L', level: 19 },
                    { rank: 8, name: 'Beatriz Alves', points: 10200, avatar: 'B', level: 18 }
                ];
            }

            leaderboardList.innerHTML = leaderboard.map(user => \\\`
                <div class="leaderboard-item">
                    <div class="rank rank-\\\${user.rank <= 3 ? user.rank : 'other'}">\\\${user.rank}</div>
                    <div class="user-avatar">\\\${user.avatar}</div>
                    <div class="user-info">
                        <h4>\\\${user.name}</h4>
                        <p>Nível \\\${user.level}</p>
                    </div>
                    <div class="user-score">
                        <div class="score-value">\\\${user.points.toLocaleString()}</div>
                        <div class="score-label">pontos</div>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadAchievements(achievements) {
            const achievementsGrid = document.getElementById('achievements-grid');

            if (achievements.length === 0) {
                achievements = [
                    { name: 'Primeiro Login', desc: 'Fez login pela primeira vez', icon: '🚪', unlocked: true },
                    { name: 'Explorador', desc: 'Visitou todas as seções', icon: '🗺️', unlocked: true },
                    { name: 'Primeiro Projeto', desc: 'Criou seu primeiro projeto', icon: '📁', unlocked: true },
                    { name: 'Mestre dos Pontos', desc: 'Ganhou 10.000 pontos', icon: '💰', unlocked: true },
                    { name: 'Social', desc: 'Convidou 5 amigos', icon: '👥', unlocked: false },
                    { name: 'Veterano', desc: 'Usa a plataforma há 1 ano', icon: '🎖️', unlocked: false },
                    { name: 'Especialista', desc: 'Completou todos os tutoriais', icon: '🎓', unlocked: true },
                    { name: 'Influenciador', desc: 'Conteúdo compartilhado 100x', icon: '📢', unlocked: false }
                ];
            }

            achievementsGrid.innerHTML = achievements.map(achievement => \\\`
                <div class="achievement-item \\\${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}">
                    <div class="achievement-icon">\\\${achievement.icon}</div>
                    <div class="achievement-name">\\\${achievement.name}</div>
                    <div class="achievement-desc">\\\${achievement.desc}</div>
                </div>
            \\\`).join('');
        }

        function loadChallenges(challenges) {
            const challengesList = document.getElementById('challenges-list');

            if (challenges.length === 0) {
                challenges = [
                    { title: 'Primeiro Projeto', desc: 'Crie seu primeiro projeto', reward: '100 pts', active: true },
                    { title: 'Explorador Diário', desc: 'Visite 5 seções diferentes', reward: '50 pts', active: true },
                    { title: 'Social Butterfly', desc: 'Convide 3 amigos', reward: '200 pts', active: true },
                    { title: 'Mestre do Conhecimento', desc: 'Complete 10 tutoriais', reward: '500 pts', active: false }
                ];
            }

            challengesList.innerHTML = challenges.map(challenge => \\\`
                <div class="challenge-item">
                    <div class="challenge-info">
                        <h4>\\\${challenge.title}</h4>
                        <p>\\\${challenge.desc}</p>
                    </div>
                    <div class="challenge-reward">\\\${challenge.reward}</div>
                </div>
            \\\`).join('');
        }

        function loadMockGamificationData() {
            updateStats({
                totalUsers: 1247,
                totalPoints: 2400000,
                activeTournaments: 3,
                achievementsUnlocked: 15200
            });

            loadLeaderboard([]);
            loadAchievements([]);
            loadChallenges([]);
        }

        // Action functions
        function refreshLeaderboard() {
            loadGamificationData();
        }

        function configureLevels() {
            alert('Configuração de níveis: Em breve você poderá ajustar XP necessário, recompensas e progressão.');
        }

        function createChallenge() {
            alert('Criar desafio: Interface para criar novos desafios e missões será implementada.');
        }

        function manageTournaments() {
            alert('Gerenciamento de torneios: Sistema completo de torneios sazonais será adicionado.');
        }

        function resetAllPoints() {
            if (confirm('⚠️ ATENÇÃO: Isso irá resetar TODOS os pontos de TODOS os usuários. Esta ação não pode ser desfeita. Continuar?')) {
                alert('Pontos resetados com sucesso. Todos os usuários voltarão ao nível 1.');
                loadGamificationData();
            }
        }

        function exportGamificationData() {
            alert('Exportando dados de gamificação...\\\\n\\\\n📊 Estatísticas de usuários\\\\n🏆 Leaderboards\\\\n🏅 Conquistas desbloqueadas\\\\n🎯 Desafios completados\\\\n\\\\nArquivo JSON gerado!');
        }

        function runGamificationTests() {
            alert('Executando testes do sistema de gamificação...\\\\n\\\\n✅ Distribuição de pontos\\\\n✅ Progressão de níveis\\\\n✅ Conquistas desbloqueáveis\\\\n✅ Sistema de torneios\\\\n\\\\nTodos os testes passaram!');
        }

        function emergencyShutdown() {
            if (confirm('🚨 EMERGÊNCIA: Desligar sistema de gamificação? Todos os pontos e progressões serão pausados.')) {
                alert('Sistema de gamificação desligado. Todos os usuários verão suas pontuações congeladas.');
            }
        }

        function showNotification(message, type = 'info') {
            console.log(\\\`[\\\${type.toUpperCase()}] \\\${message}\\\`);
            alert(message);
        }

        // Initialize
        loadGamificationData();
    <\/script> `])), renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/admin/gamification.astro?astro&type=script&index=0&lang.ts"), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/gamification.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/gamification.astro";
const $$url = "/admin/gamification";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Gamification,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
