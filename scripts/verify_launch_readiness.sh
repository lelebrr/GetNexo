#!/bin/bash
# GetNexo Launch Readiness Verification
# Checklist automatizado pré-deploy e validação de prontidão

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções de log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" >> logs/launch_readiness.log
    echo -e "$1"
}

error() {
    echo -e "${RED}❌ ERRO:${NC} $1" >&2
    log "ERRO: $1"
}

warning() {
    echo -e "${YELLOW}⚠️  AVISO:${NC} $1"
    log "AVISO: $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCESSO: $1"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

header() {
    echo -e "${PURPLE}🚀 $1${NC}"
    echo "========================================"
}

# Verificações globais
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

check_result() {
    local name="$1"
    local result="$2"
    local message="$3"

    ((TOTAL_CHECKS++))

    if [ "$result" = "PASS" ]; then
        success "$name: $message"
        ((CHECKS_PASSED++))
    elif [ "$result" = "WARN" ]; then
        warning "$name: $message"
        ((CHECKS_PASSED++))  # Warnings count as passed but flag attention
    else
        error "$name: $message"
        ((CHECKS_FAILED++))
    fi
}

# Verificação de DNS
check_dns() {
    header "VERIFICAÇÃO DNS"
    local domain=${DOMAIN:-"getnexo.com.br"}

    info "Verificando resolução DNS para $domain..."

    # Verifica se o domínio resolve
    if nslookup "$domain" >/dev/null 2>&1; then
        check_result "DNS Resolution" "PASS" "$domain resolve corretamente"
    else
        check_result "DNS Resolution" "FAIL" "$domain não resolve"
        return
    fi

    # Verifica registros A
    local a_records
    a_records=$(dig +short A "$domain" | wc -l)
    if [ "$a_records" -gt 0 ]; then
        check_result "DNS A Records" "PASS" "$a_records registro(s) A encontrado(s)"
    else
        check_result "DNS A Records" "WARN" "Nenhum registro A encontrado"
    fi

    # Verifica registros CNAME (se aplicável)
    local cname_records
    cname_records=$(dig +short CNAME "$domain" | wc -l)
    if [ "$cname_records" -gt 0 ]; then
        check_result "DNS CNAME Records" "PASS" "$cname_records registro(s) CNAME encontrado(s)"
    fi
}

# Verificação SSL/TLS
check_ssl() {
    header "VERIFICAÇÃO SSL/TLS"
    local domain=${DOMAIN:-"getnexo.com.br"}
    local port=${SSL_PORT:-443}

    info "Verificando certificado SSL para $domain:$port..."

    # Verifica se a conexão SSL funciona
    if timeout 10 bash -c "echo | openssl s_client -connect $domain:$port -servername $domain >/dev/null 2>&1"; then
        check_result "SSL Connection" "PASS" "Conexão SSL estabelecida"
    else
        check_result "SSL Connection" "FAIL" "Falha na conexão SSL"
        return
    fi

    # Verifica validade do certificado
    local expiry_days
    expiry_days=$(openssl s_client -connect "$domain:$port" -servername "$domain" 2>/dev/null \
        | openssl x509 -noout -dates 2>/dev/null \
        | grep notAfter \
        | cut -d'=' -f2 \
        | xargs -I {} date -d {} +%s)

    local current_date
    current_date=$(date +%s)
    local days_remaining=$(( (expiry_days - current_date) / 86400 ))

    if [ "$days_remaining" -gt 30 ]; then
        check_result "SSL Certificate" "PASS" "Certificado válido por $days_remaining dias"
    elif [ "$days_remaining" -gt 7 ]; then
        check_result "SSL Certificate" "WARN" "Certificado expira em $days_remaining dias"
    else
        check_result "SSL Certificate" "FAIL" "Certificado expira em $days_remaining dias - renovar urgentemente"
    fi

    # Verifica força da criptografia
    local cipher
    cipher=$(openssl s_client -connect "$domain:$port" -servername "$domain" 2>/dev/null \
        | grep "Cipher.*:" \
        | head -1 \
        | awk '{print $3}')

    if [[ "$cipher" == *"ECDHE"* ]] || [[ "$cipher" == *"DHE"* ]]; then
        check_result "SSL Cipher" "PASS" "Cifra forte: $cipher"
    else
        check_result "SSL Cipher" "WARN" "Cifra potencialmente fraca: $cipher"
    fi
}

# Verificação de banco de dados
check_database() {
    header "VERIFICAÇÃO BANCO DE DADOS"

    # Verifica conexão com PostgreSQL
    if command -v psql >/dev/null 2>&1; then
        if PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-localhost} -U ${DB_USER:-chatwoot} -d ${DB_NAME:-chatwoot_production} -c "SELECT 1;" >/dev/null 2>&1; then
            check_result "PostgreSQL Connection" "PASS" "Conexão com banco de dados estabelecida"
        else
            check_result "PostgreSQL Connection" "FAIL" "Falha na conexão com PostgreSQL"
        fi
    else
        check_result "PostgreSQL Client" "WARN" "Cliente psql não encontrado"
    fi

    # Verifica conexão com Redis
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} ping >/dev/null 2>&1; then
            check_result "Redis Connection" "PASS" "Conexão com Redis estabelecida"
        else
            check_result "Redis Connection" "FAIL" "Falha na conexão com Redis"
        fi
    else
        check_result "Redis Client" "WARN" "Cliente redis-cli não encontrado"
    fi

    # Verifica espaço em disco
    local disk_usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        check_result "Disk Space" "PASS" "Uso de disco: ${disk_usage}%"
    elif [ "$disk_usage" -lt 95 ]; then
        check_result "Disk Space" "WARN" "Uso de disco alto: ${disk_usage}%"
    else
        check_result "Disk Space" "FAIL" "Uso de disco crítico: ${disk_usage}%"
    fi
}

# Verificação de APIs
check_apis() {
    header "VERIFICAÇÃO APIs"

    # Lista de APIs para verificar
    declare -a apis=(
        "http://localhost:3000/api/health:Frontend API"
        "http://localhost:3001/api/health:Chat API"
        "https://api.getnexo.com.br/health:Production API"
    )

    for api_entry in "${apis[@]}"; do
        local url
        local name
        IFS=':' read -r url name <<< "$api_entry"

        info "Testando $name ($url)..."

        if curl -s --max-time 10 --head "$url" >/dev/null 2>&1; then
            # Verifica status code
            local status_code
            status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

            if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 400 ]; then
                check_result "$name" "PASS" "HTTP $status_code"
            else
                check_result "$name" "FAIL" "HTTP $status_code"
            fi
        else
            check_result "$name" "FAIL" "Não responde"
        fi
    done
}

# Verificação de containers Docker
check_containers() {
    header "VERIFICAÇÃO CONTAINERS DOCKER"

    if ! command -v docker >/dev/null 2>&1; then
        check_result "Docker" "WARN" "Docker não instalado"
        return
    fi

    # Lista de containers esperados
    declare -a expected_containers=(
        "getnexo-frontend"
        "getnexo-chat-api"
        "getnexo-postgres"
        "getnexo-redis"
        "getnexo-traefik"
    )

    local running_containers
    running_containers=$(docker ps --format "{{.Names}}" | tr '\n' ' ')

    for container in "${expected_containers[@]}"; do
        if echo "$running_containers" | grep -q "$container"; then
            check_result "Container $container" "PASS" "Rodando"

            # Verifica health check
            local health
            health=$(docker inspect "$container" --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
            if [ "$health" = "healthy" ]; then
                check_result "Health $container" "PASS" "Status: healthy"
            elif [ "$health" = "unknown" ]; then
                check_result "Health $container" "WARN" "Health check não configurado"
            else
                check_result "Health $container" "FAIL" "Status: $health"
            fi
        else
            check_result "Container $container" "FAIL" "Não está rodando"
        fi
    done
}

# Verificação de configurações
check_configurations() {
    header "VERIFICAÇÃO CONFIGURAÇÕES"

    # Arquivos de configuração esperados
    declare -a config_files=(
        ".env:Arquivo de ambiente"
        "docker-compose.yml:Configuração Docker"
        "nginx.conf:Configuração Nginx"
        "chat-api/ai-config.json:Configuração IA"
    )

    for config_entry in "${config_files[@]}"; do
        local file
        local description
        IFS=':' read -r file description <<< "$config_entry"

        if [ -f "$file" ]; then
            check_result "$description" "PASS" "Arquivo existe"

            # Verifica se não está vazio
            if [ -s "$file" ]; then
                check_result "$description Content" "PASS" "Arquivo não vazio"
            else
                check_result "$description Content" "WARN" "Arquivo vazio"
            fi
        else
            check_result "$description" "FAIL" "Arquivo não encontrado"
        fi
    done

    # Verifica variáveis de ambiente críticas
    declare -a required_env_vars=(
        "DATABASE_URL:Conexão banco de dados"
        "REDIS_URL:Conexão Redis"
        "JWT_SECRET:Chave JWT"
        "ENCRYPTION_KEY:Chave de criptografia"
    )

    for env_entry in "${required_env_vars[@]}"; do
        local var
        local description
        IFS=':' read -r var description <<< "$env_entry"

        if [ -n "${!var:-}" ]; then
            check_result "$description" "PASS" "Configurada"
        else
            check_result "$description" "FAIL" "Não configurada"
        fi
    done
}

# Verificação de segurança
check_security() {
    header "VERIFICAÇÃO SEGURANÇA"

    # Verifica se portas sensíveis estão fechadas
    declare -a sensitive_ports=(22 3306 5432 6379)
    for port in "${sensitive_ports[@]}"; do
        if nc -z localhost "$port" 2>/dev/null; then
            check_result "Port $port" "WARN" "Porta aberta externamente"
        else
            check_result "Port $port" "PASS" "Porta fechada/protegida"
        fi
    done

    # Verifica se firewall está ativo
    if command -v ufw >/dev/null 2>&1; then
        local ufw_status
        ufw_status=$(ufw status | head -1)
        if echo "$ufw_status" | grep -q "active"; then
            check_result "Firewall UFW" "PASS" "Ativo"
        else
            check_result "Firewall UFW" "WARN" "Inativo"
        fi
    else
        check_result "Firewall" "WARN" "UFW não encontrado"
    fi

    # Verifica atualizações de segurança
    if command -v apt >/dev/null 2>&1; then
        local updates
        updates=$(apt list --upgradable 2>/dev/null | grep -c "upgradable" || echo "0")
        if [ "$updates" -eq 0 ]; then
            check_result "Security Updates" "PASS" "Sistema atualizado"
        else
            check_result "Security Updates" "WARN" "$updates atualizações pendentes"
        fi
    fi
}

# Verificação de performance
check_performance() {
    header "VERIFICAÇÃO PERFORMANCE"

    # Verifica uso de CPU
    local cpu_usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    cpu_usage=${cpu_usage%.*}

    if [ "$cpu_usage" -lt 70 ]; then
        check_result "CPU Usage" "PASS" "${cpu_usage}%"
    elif [ "$cpu_usage" -lt 90 ]; then
        check_result "CPU Usage" "WARN" "${cpu_usage}% - uso elevado"
    else
        check_result "CPU Usage" "FAIL" "${cpu_usage}% - uso crítico"
    fi

    # Verifica uso de memória
    local mem_usage
    mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$mem_usage" -lt 80 ]; then
        check_result "Memory Usage" "PASS" "${mem_usage}%"
    elif [ "$mem_usage" -lt 95 ]; then
        check_result "Memory Usage" "WARN" "${mem_usage}% - uso alto"
    else
        check_result "Memory Usage" "FAIL" "${mem_usage}% - uso crítico"
    fi

    # Verifica conectividade de rede
    if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
        check_result "Network Connectivity" "PASS" "Conectividade OK"
    else
        check_result "Network Connectivity" "FAIL" "Sem conectividade"
    fi
}

# Verificação de backups
check_backups() {
    header "VERIFICAÇÃO BACKUPS"

    # Verifica se diretório de backups existe
    if [ -d "backups" ]; then
        check_result "Backup Directory" "PASS" "Diretório existe"

        # Verifica idade do último backup
        local latest_backup
        latest_backup=$(find backups -name "*.tar.gz*" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)

        if [ -n "$latest_backup" ]; then
            local backup_age_days
            backup_age_days=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 86400 ))

            if [ "$backup_age_days" -lt 7 ]; then
                check_result "Latest Backup" "PASS" "$backup_age_days dias atrás"
            elif [ "$backup_age_days" -lt 30 ]; then
                check_result "Latest Backup" "WARN" "$backup_age_days dias atrás"
            else
                check_result "Latest Backup" "FAIL" "$backup_age_days dias atrás - muito antigo"
            fi
        else
            check_result "Latest Backup" "FAIL" "Nenhum backup encontrado"
        fi
    else
        check_result "Backup Directory" "FAIL" "Diretório não existe"
    fi

    # Verifica tamanho dos backups
    local total_backup_size
    total_backup_size=$(du -sh backups 2>/dev/null | cut -f1 || echo "0")
    check_result "Backup Size" "INFO" "Tamanho total: $total_backup_size"
}

# Relatório final
generate_report() {
    header "RELATÓRIO FINAL DE PRONTIDÃO"

    local success_rate=0
    if [ "$TOTAL_CHECKS" -gt 0 ]; then
        success_rate=$(( (CHECKS_PASSED * 100) / TOTAL_CHECKS ))
    fi

    echo "📊 Estatísticas:"
    echo "   Total de verificações: $TOTAL_CHECKS"
    echo "   Aprovadas: $CHECKS_PASSED"
    echo "   Falhas: $CHECKS_FAILED"
    echo "   Taxa de sucesso: ${success_rate}%"
    echo

    if [ "$CHECKS_FAILED" -eq 0 ]; then
        echo -e "${GREEN}🎉 SISTEMA TOTALMENTE PRONTO PARA LANÇAMENTO!${NC}"
        echo "✅ Todas as verificações passaram com sucesso."
        return 0
    elif [ "$success_rate" -ge 90 ]; then
        echo -e "${YELLOW}⚠️  SISTEMA QUASE PRONTO${NC}"
        echo "A maioria das verificações passou. Corrija as $CHECKS_FAILED falhas restantes."
        return 1
    else
        echo -e "${RED}❌ SISTEMA NÃO PRONTO PARA LANÇAMENTO${NC}"
        echo "$CHECKS_FAILED verificações falharam. Corrija antes do deploy."
        return 1
    fi
}

# Função principal
main() {
    log "Iniciando verificação de prontidão para lançamento"

    # Cria diretório de logs se não existir
    mkdir -p logs

    echo "🚀 GETNEXO LAUNCH READINESS VERIFICATION"
    echo "=========================================="
    echo "Verificando prontidão do sistema para lançamento..."
    echo

    # Executa todas as verificações
    check_dns
    echo

    check_ssl
    echo

    check_database
    echo

    check_apis
    echo

    check_containers
    echo

    check_configurations
    echo

    check_security
    echo

    check_performance
    echo

    check_backups
    echo

    # Gera relatório final
    generate_report
    exit_code=$?

    echo
    echo "📋 Logs salvos em: logs/launch_readiness.log"
    echo "=========================================="

    log "Verificação de prontidão concluída - Taxa de sucesso: $(( (CHECKS_PASSED * 100) / TOTAL_CHECKS ))%"

    exit "$exit_code"
}

# Processa argumentos
case "${1:-}" in
    "--help"|"-h")
        echo "GetNexo Launch Readiness Verification"
        echo
        echo "Uso: $0 [opções]"
        echo
        echo "Verificações realizadas:"
        echo "  - DNS e resolução de domínio"
        echo "  - Certificados SSL/TLS"
        echo "  - Conexões de banco de dados"
        echo "  - APIs e endpoints"
        echo "  - Containers Docker"
        echo "  - Arquivos de configuração"
        echo "  - Segurança e firewall"
        echo "  - Performance do sistema"
        echo "  - Sistema de backups"
        echo
        echo "Variáveis de ambiente:"
        echo "  DOMAIN              Domínio para verificar (padrão: getnexo.com.br)"
        echo "  DB_HOST             Host do banco de dados"
        echo "  DB_USER             Usuário do banco"
        echo "  DB_PASSWORD         Senha do banco"
        exit 0
        ;;

    "--quick")
        # Verificação rápida - apenas itens críticos
        check_dns
        check_ssl
        check_database
        generate_report
        ;;

    *)
        main
        ;;
esac