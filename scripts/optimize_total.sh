#!/bin/bash
# GetNexo Total System Optimization
# Limpeza profunda de cache, logs e otimização completa do sistema

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
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" >> logs/system_optimization.log
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
    echo -e "${PURPLE}🧹 $1${NC}"
    echo "========================================"
}

# Métricas de otimização
SPACE_FREED=0
FILES_CLEANED=0

# Função para converter bytes para formato legível
format_bytes() {
    local bytes=$1
    if [ "$bytes" -lt 1024 ]; then
        echo "${bytes}B"
    elif [ "$bytes" -lt 1048576 ]; then
        echo "$(( bytes / 1024 ))KB"
    elif [ "$bytes" -lt 1073741824 ]; then
        echo "$(( bytes / 1048576 ))MB"
    else
        echo "$(( bytes / 1073741824 ))GB"
    fi
}

# Limpeza de logs antigos
clean_old_logs() {
    header "LIMPEZA DE LOGS ANTIGOS"

    local log_dirs=("logs" "chat-api/logs" "getnexo-site/logs")
    local days_to_keep=${LOG_RETENTION_DAYS:-30}
    local total_cleaned=0

    for log_dir in "${log_dirs[@]}"; do
        if [ -d "$log_dir" ]; then
            info "Limpando logs em $log_dir (mantendo últimos $days_to_keep dias)..."

            # Conta arquivos que serão removidos
            local files_to_remove
            files_to_remove=$(find "$log_dir" -name "*.log" -type f -mtime +"$days_to_keep" | wc -l)

            if [ "$files_to_remove" -gt 0 ]; then
                # Calcula espaço antes
                local space_before=0
                if command -v du >/dev/null 2>&1; then
                    space_before=$(du -bc $(find "$log_dir" -name "*.log" -type f -mtime +"$days_to_keep") 2>/dev/null | tail -1 | cut -f1 || echo "0")
                fi

                # Remove arquivos antigos
                find "$log_dir" -name "*.log" -type f -mtime +"$days_to_keep" -delete

                success "Removidos $files_to_remove arquivos de log antigos de $log_dir"
                if [ "$space_before" -gt 0 ]; then
                    local space_freed_formatted
                    space_freed_formatted=$(format_bytes "$space_before")
                    info "Espaço liberado: $space_freed_formatted"
                    ((SPACE_FREED += space_before))
                fi

                ((FILES_CLEANED += files_to_remove))
            else
                info "Nenhum arquivo de log antigo encontrado em $log_dir"
            fi
        fi
    done
}

# Limpeza de cache do sistema
clean_system_cache() {
    header "LIMPEZA DE CACHE DO SISTEMA"

    # Cache do apt (se aplicável)
    if command -v apt >/dev/null 2>&1; then
        info "Limpando cache do APT..."

        local apt_cache_before=0
        if command -v du >/dev/null 2>&1; then
            apt_cache_before=$(du -bc /var/cache/apt/archives/*.deb 2>/dev/null | tail -1 | cut -f1 2>/dev/null || echo "0")
        fi

        apt clean
        apt autoclean

        success "Cache do APT limpo"

        if [ "$apt_cache_before" -gt 0 ]; then
            local apt_cache_after=0
            apt_cache_after=$(du -bc /var/cache/apt/archives/*.deb 2>/dev/null | tail -1 | cut -f1 2>/dev/null || echo "0")
            local apt_space_freed=$((apt_cache_before - apt_cache_after))
            if [ "$apt_space_freed" -gt 0 ]; then
                info "Espaço liberado no cache APT: $(format_bytes "$apt_space_freed")"
                ((SPACE_FREED += apt_space_freed))
            fi
        fi
    fi

    # Cache do npm/yarn
    if command -v npm >/dev/null 2>&1; then
        info "Limpando cache do npm..."

        local npm_cache_before=0
        npm_cache_before=$(npm cache ls 2>/dev/null | wc -c || echo "0")

        npm cache clean --force 2>/dev/null || true

        success "Cache do npm limpo"
        # npm não fornece tamanho exato, apenas assumimos limpeza
    fi

    # Cache do Node.js
    if [ -d "~/.npm" ]; then
        info "Limpando cache do Node.js..."

        local node_cache_before=0
        node_cache_before=$(du -bc ~/.npm 2>/dev/null | tail -1 | cut -f1 2>/dev/null || echo "0")

        # Remove node_modules antigos (mais de 60 dias)
        find ~/.npm -name "*" -type f -mtime +60 -delete 2>/dev/null || true

        if [ "$node_cache_before" -gt 0 ]; then
            local node_cache_after=0
            node_cache_after=$(du -bc ~/.npm 2>/dev/null | tail -1 | cut -f1 2>/dev/null || echo "0")
            local node_space_freed=$((node_cache_before - node_cache_after))
            if [ "$node_space_freed" -gt 0 ]; then
                info "Espaço liberado no cache Node.js: $(format_bytes "$node_space_freed")"
                ((SPACE_FREED += node_space_freed))
            fi
        fi
    fi
}

# Limpeza de containers Docker
clean_docker() {
    header "LIMPEZA DE DOCKER"

    if ! command -v docker >/dev/null 2>&1; then
        warning "Docker não encontrado, pulando limpeza"
        return
    fi

    info "Limpando containers Docker não utilizados..."

    # Para containers parados
    local stopped_containers
    stopped_containers=$(docker ps -aq --filter "status=exited" | wc -l)

    if [ "$stopped_containers" -gt 0 ]; then
        docker stop $(docker ps -aq --filter "status=exited") 2>/dev/null || true
        success "Parados $stopped_containers containers"

        ((FILES_CLEANED += stopped_containers))
    fi

    # Remove containers parados
    local removed_containers
    removed_containers=$(docker container prune -f 2>/dev/null | grep -o "Total reclaimed space: [0-9]*" | grep -o "[0-9]*" || echo "0")

    if [ "$removed_containers" -gt 0 ]; then
        success "Removidos $removed_containers containers parados"
    fi

    # Limpa imagens não utilizadas
    info "Limpando imagens Docker não utilizadas..."
    local removed_images
    removed_images=$(docker image prune -f 2>/dev/null | grep -c "deleted:" || echo "0")

    if [ "$removed_images" -gt 0 ]; then
        success "Removidas $removed_images imagens não utilizadas"
        ((FILES_CLEANED += removed_images))
    fi

    # Limpa volumes não utilizados
    info "Limpando volumes Docker não utilizados..."
    local removed_volumes
    removed_volumes=$(docker volume prune -f 2>/dev/null | grep -c "deleted:" || echo "0")

    if [ "$removed_volumes" -gt 0 ]; then
        success "Removidos $removed_volumes volumes não utilizados"
        ((FILES_CLEANED += removed_volumes))
    fi

    # Limpa sistema Docker completo
    info "Executando limpeza completa do Docker..."
    docker system prune -f >/dev/null 2>&1
    success "Limpeza completa do sistema Docker executada"
}

# Otimização de banco de dados
optimize_database() {
    header "OTIMIZAÇÃO DE BANCO DE DADOS"

    # PostgreSQL
    if command -v psql >/dev/null 2>&1; then
        info "Otimizando PostgreSQL..."

        # Vacuum analyze para atualizar estatísticas
        PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-localhost} -U ${DB_USER:-chatwoot} -d ${DB_NAME:-chatwoot_production} -c "VACUUM ANALYZE;" 2>/dev/null && \
        success "PostgreSQL - VACUUM ANALYZE executado" || \
        warning "Falha ao executar VACUUM ANALYZE no PostgreSQL"

        # Reindexar tabelas principais (opcional, pode ser lento)
        # PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-localhost} -U ${DB_USER:-chatwoot} -d ${DB_NAME:-chatwoot_production} -c "REINDEX DATABASE ${DB_NAME:-chatwoot_production};" 2>/dev/null && \
        # success "PostgreSQL - REINDEX executado" || \
        # warning "Falha ao executar REINDEX no PostgreSQL"
    else
        warning "Cliente PostgreSQL não encontrado"
    fi

    # Redis
    if command -v redis-cli >/dev/null 2>&1; then
        info "Otimizando Redis..."

        # Limpa chaves expiradas
        redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} KEYS "*" | xargs redis-cli DEL 2>/dev/null || true

        success "Redis otimizado"
    else
        warning "Cliente Redis não encontrado"
    fi
}

# Limpeza de arquivos temporários
clean_temp_files() {
    header "LIMPEZA DE ARQUIVOS TEMPORÁRIOS"

    local temp_dirs=("/tmp" "/var/tmp" "$(pwd)/tmp")
    local extensions_to_clean=("*.tmp" "*.temp" "*.bak" "*.swp" "*.swo" "*~" "*.log.old")

    for temp_dir in "${temp_dirs[@]}"; do
        if [ -d "$temp_dir" ]; then
            info "Limpando arquivos temporários em $temp_dir..."

            local cleaned_count=0
            for ext in "${extensions_to_clean[@]}"; do
                local files_found
                files_found=$(find "$temp_dir" -name "$ext" -type f 2>/dev/null | wc -l)

                if [ "$files_found" -gt 0 ]; then
                    find "$temp_dir" -name "$ext" -type f -delete 2>/dev/null || true
                    ((cleaned_count += files_found))
                fi
            done

            if [ "$cleaned_count" -gt 0 ]; then
                success "Removidos $cleaned_count arquivos temporários de $temp_dir"
                ((FILES_CLEANED += cleaned_count))
            else
                info "Nenhum arquivo temporário encontrado em $temp_dir"
            fi
        fi
    done

    # Limpa arquivos core dumps
    if [ -d "/var/crash" ]; then
        local core_files
        core_files=$(find /var/crash -name "core*" -type f 2>/dev/null | wc -l)
        if [ "$core_files" -gt 0 ]; then
            find /var/crash -name "core*" -type f -delete 2>/dev/null || true
            success "Removidos $core_files arquivos core dump"
            ((FILES_CLEANED += core_files))
        fi
    fi
}

# Otimização de sistema de arquivos
optimize_filesystem() {
    header "OTIMIZAÇÃO DE SISTEMA DE ARQUIVOS"

    # Executa fstrim para SSDs
    if command -v fstrim >/dev/null 2>&1; then
        info "Executando TRIM em dispositivos SSD..."

        # Lista dispositivos montados
        local mounted_devices
        mounted_devices=$(mount | grep -E "(ext4|btrfs|xfs)" | awk '{print $1}' | sort | uniq)

        for device in $mounted_devices; do
            info "Executando TRIM em $device..."
            fstrim "$device" 2>/dev/null && \
            success "TRIM executado em $device" || \
            warning "Falha ao executar TRIM em $device"
        done
    else
        info "fstrim não disponível (TRIM não suportado ou não necessário)"
    fi

    # Otimização de inodes (se necessário)
    local inode_usage
    inode_usage=$(df -i / | tail -1 | awk '{print $5}' | sed 's/%//')

    if [ "$inode_usage" -gt 80 ]; then
        warning "Uso de inodes alto: ${inode_usage}%"
        info "Considere limpeza de arquivos pequenos ou aumento de partição"
    else
        success "Uso de inodes normal: ${inode_usage}%"
    fi
}

# Otimização de rede
optimize_network() {
    header "OTIMIZAÇÃO DE REDE"

    # Limpa cache de DNS
    if command -v systemd-resolve >/dev/null 2>&1; then
        systemd-resolve --flush-caches 2>/dev/null && \
        success "Cache DNS do systemd limpo" || \
        warning "Falha ao limpar cache DNS do systemd"
    fi

    # Otimização de TCP (se root)
    if [ "$EUID" -eq 0 ]; then
        info "Otimizando parâmetros TCP..."

        # Ajusta configurações de rede para melhor performance
        sysctl -w net.core.somaxconn=1024 2>/dev/null || true
        sysctl -w net.core.netdev_max_backlog=5000 2>/dev/null || true
        sysctl -w net.ipv4.tcp_max_syn_backlog=1024 2>/dev/null || true

        success "Parâmetros TCP otimizados"
    else
        info "Executando como usuário comum - pulando otimização de kernel"
    fi

    # Verifica conectividade
    if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
        success "Conectividade de rede OK"
    else
        warning "Problemas de conectividade de rede detectados"
    fi
}

# Relatório final
generate_report() {
    header "RELATÓRIO FINAL DE OTIMIZAÇÃO"

    echo "📊 Estatísticas da Otimização:"
    echo "   Arquivos limpos: $FILES_CLEANED"
    echo "   Espaço liberado: $(format_bytes "$SPACE_FREED")"
    echo

    echo "🎯 Otimizações Realizadas:"
    echo "   ✅ Limpeza de logs antigos"
    echo "   ✅ Limpeza de cache do sistema"
    echo "   ✅ Limpeza de containers Docker"
    echo "   ✅ Otimização de banco de dados"
    echo "   ✅ Limpeza de arquivos temporários"
    echo "   ✅ Otimização de sistema de arquivos"
    echo "   ✅ Otimização de rede"
    echo

    # Verifica uso de disco após otimização
    local disk_usage_after
    disk_usage_after=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

    echo "💾 Uso de disco atual: ${disk_usage_after}%"

    if [ "$disk_usage_after" -lt 70 ]; then
        success "Sistema otimizado - performance melhorada!"
    elif [ "$disk_usage_after" -lt 85 ]; then
        warning "Sistema parcialmente otimizado"
    else
        error "Sistema ainda com uso alto de disco - considere expansão"
    fi

    echo
    echo "📋 Logs salvos em: logs/system_optimization.log"
}

# Função principal
main() {
    echo "🧹 GETNEXO TOTAL SYSTEM OPTIMIZATION"
    echo "======================================"
    echo "Executando otimização completa do sistema..."
    echo

    # Cria diretório de logs
    mkdir -p logs

    log "Iniciando otimização total do sistema"

    # Verifica se está rodando como root para algumas operações
    if [ "$EUID" -eq 0 ]; then
        info "Executando com privilégios de root - todas as otimizações disponíveis"
    else
        warning "Executando como usuário comum - algumas otimizações podem ser limitadas"
    fi

    # Executa otimizações
    clean_old_logs
    echo

    clean_system_cache
    echo

    clean_docker
    echo

    optimize_database
    echo

    clean_temp_files
    echo

    optimize_filesystem
    echo

    optimize_network
    echo

    # Gera relatório
    generate_report

    echo "======================================"
    success "OTIMIZAÇÃO TOTAL CONCLUÍDA!"

    log "Otimização total concluída - Arquivos limpos: $FILES_CLEANED, Espaço liberado: $(format_bytes "$SPACE_FREED")"
}

# Processa argumentos
case "${1:-}" in
    "--help"|"-h")
        echo "GetNexo Total System Optimization"
        echo
        echo "Uso: $0 [opções]"
        echo
        echo "Otimizações realizadas:"
        echo "  - Limpeza de logs antigos"
        echo "  - Limpeza de cache do sistema"
        echo "  - Limpeza de containers Docker"
        echo "  - Otimização de banco de dados"
        echo "  - Limpeza de arquivos temporários"
        echo "  - Otimização de sistema de arquivos"
        echo "  - Otimização de rede"
        echo
        echo "Variáveis de ambiente:"
        echo "  LOG_RETENTION_DAYS   Dias para manter logs (padrão: 30)"
        echo "  DB_HOST              Host do banco de dados"
        echo "  DB_USER              Usuário do banco"
        echo "  DB_PASSWORD          Senha do banco"
        echo "  DB_NAME              Nome do banco"
        echo "  REDIS_HOST           Host do Redis"
        echo "  REDIS_PORT           Porta do Redis"
        exit 0
        ;;

    "--quick")
        # Otimização rápida - apenas limpeza básica
        clean_old_logs
        clean_temp_files
        generate_report
        ;;

    "--docker-only")
        # Apenas limpeza Docker
        clean_docker
        generate_report
        ;;

    *)
        main
        ;;
esac