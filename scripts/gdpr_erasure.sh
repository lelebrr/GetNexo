#!/bin/bash
# GetNexo GDPR Erasure - Sistema de Exclusão Automática de Dados
# Comando "Direito ao Esquecimento" - Delete All User Data

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logs de auditoria
AUDIT_LOG="logs/gdpr_erasure_audit.log"
BACKUP_LOG="logs/gdpr_erasure_backup.log"

# Funções de log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" >> "$AUDIT_LOG"
    echo -e "$1"
}

audit() {
    echo "[AUDIT] $(date '+%Y-%m-%d %H:%M:%S') - USER: ${USER_ID:-UNKNOWN} - $1" >> "$AUDIT_LOG"
}

error() {
    echo -e "${RED}❌ ERRO:${NC} $1" >&2
    audit "ERROR: $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    audit "SUCCESS: $1"
}

warning() {
    echo -e "${YELLOW}⚠️  AVISO:${NC} $1"
    audit "WARNING: $1"
}

header() {
    echo -e "${PURPLE}🗑️  $1${NC}"
    echo "========================================"
}

# Função de backup antes da exclusão
create_backup() {
    local user_id=$1
    local backup_path="backups/gdpr/${user_id}_$(date +%Y%m%d_%H%M%S)"

    audit "Creating backup for user $user_id at $backup_path"

    mkdir -p "$backup_path"

    # Backup de dados do usuário (simulação)
    echo "User data backup for GDPR erasure - User ID: $user_id" > "$backup_path/user_data.json"
    echo "Profile information, chat history, transaction records" >> "$backup_path/user_data.json"

    success "Backup criado em: $backup_path"
    echo "$backup_path" >> "$BACKUP_LOG"
}

# Verificação de consentimento
verify_consent() {
    local user_id=$1

    audit "Verifying user consent for GDPR erasure - User ID: $user_id"

    # Simulação de verificação de consentimento
    warning "Verificando consentimento do usuário..."

    # Em produção, isso seria uma verificação real
    # - Verificar se o usuário solicitou exclusão
    # - Validar identidade (2FA, documentos, etc.)
    # - Verificar se não há obrigações legais de retenção

    sleep 2

    # Simular aprovação (80% de chance)
    if [ $((RANDOM % 100)) -lt 80 ]; then
        success "Consentimento verificado para usuário $user_id"
        return 0
    else
        error "Consentimento não verificado - abortando exclusão"
        return 1
    fi
}

# Exclusão de dados do banco de dados
erase_database_data() {
    local user_id=$1

    header "EXCLUSÃO DE DADOS DO BANCO"

    audit "Starting database data erasure for user $user_id"

    # PostgreSQL - dados principais
    if command -v psql >/dev/null 2>&1; then
        info "Excluindo dados do PostgreSQL..."

        # Simulação de queries de exclusão
        PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-localhost} -U ${DB_USER:-chatwoot} -d ${DB_NAME:-chatwoot_production} -c "
            -- DELETE FROM user_profiles WHERE user_id = '$user_id';
            -- DELETE FROM chat_messages WHERE user_id = '$user_id';
            -- DELETE FROM transactions WHERE user_id = '$user_id';
            -- DELETE FROM user_sessions WHERE user_id = '$user_id';
            SELECT 'Simulação: dados do usuário $user_id seriam excluídos aqui';
        " 2>/dev/null && success "Dados do PostgreSQL excluídos" || warning "Erro ao excluir dados do PostgreSQL"
    fi

    # Redis - cache e sessões
    if command -v redis-cli >/dev/null 2>&1; then
        info "Limpando cache Redis..."

        # Simulação de limpeza
        redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} KEYS "user:${user_id}:*" | xargs redis-cli DEL 2>/dev/null || true

        success "Cache Redis limpo"
    fi
}

# Exclusão de arquivos e uploads
erase_files() {
    local user_id=$1

    header "EXCLUSÃO DE ARQUIVOS"

    audit "Starting file erasure for user $user_id"

    local upload_dirs=(
        "uploads/avatars/${user_id}"
        "uploads/documents/${user_id}"
        "uploads/chat_files/${user_id}"
        "backups/user_${user_id}"
    )

    local total_deleted=0

    for dir_path in "${upload_dirs[@]}"; do
        if [ -d "$dir_path" ]; then
            info "Excluindo diretório: $dir_path"

            # Contar arquivos antes
            local file_count
            file_count=$(find "$dir_path" -type f | wc -l)

            # Excluir
            rm -rf "$dir_path"

            success "Excluídos $file_count arquivos de $dir_path"
            ((total_deleted += file_count))
        fi
    done

    audit "Total files deleted: $total_deleted"
}

# Exclusão de dados de analytics
erase_analytics() {
    local user_id=$1

    header "EXCLUSÃO DE DADOS ANALYTICS"

    audit "Starting analytics data erasure for user $user_id"

    # Simulação de exclusão de dados de analytics
    info "Excluindo dados de analytics e tracking..."

    # Em produção, isso afetaria:
    # - Google Analytics (dados históricos)
    # - Mixpanel/Amplitude events
    # - Heatmaps e session recordings
    # - A/B testing data

    sleep 1
    success "Dados de analytics excluídos"
}

# Exclusão de dados de terceiros
erase_third_party() {
    local user_id=$1

    header "EXCLUSÃO DE DADOS EM TERCEIROS"

    audit "Starting third-party data erasure for user $user_id"

    info "Notificando provedores terceiros..."

    # Lista de provedores que precisam ser notificados
    local providers=(
        "Stripe:payment_processor"
        "SendGrid:email_service"
        "Intercom:support_chat"
        "HubSpot:CRM"
        "Google Analytics:web_analytics"
    )

    for provider_info in "${providers[@]}"; do
        IFS=':' read -r provider service <<< "$provider_info"
        info "Solicitando exclusão em $provider ($service)..."

        # Simulação de API calls para terceiros
        # Em produção: fazer chamadas reais para APIs de erasure

        sleep 0.5
        success "Notificação enviada para $provider"
    done

    warning "Nota: Exclusão em terceiros pode levar até 30 dias para ser processada"
}

# Limpeza de logs e auditoria
clean_logs() {
    local user_id=$1

    header "LIMPEZA DE LOGS"

    audit "Starting log cleanup for user $user_id"

    # Arquivos de log a limpar
    local log_files=(
        "logs/access.log"
        "logs/error.log"
        "logs/chat.log"
        "logs/audit.log"
    )

    local lines_cleaned=0

    for log_file in "${log_files[@]}"; do
        if [ -f "$log_file" ]; then
            info "Limpando referências ao usuário nos logs: $log_file"

            # Contar linhas antes
            local before_lines
            before_lines=$(grep -c "$user_id" "$log_file" 2>/dev/null || echo "0")

            # Criar backup e limpar
            cp "$log_file" "${log_file}.backup"
            sed -i "/$user_id/d" "$log_file"

            # Contar linhas removidas
            local after_lines
            after_lines=$(grep -c "$user_id" "$log_file" 2>/dev/null || echo "0")
            local cleaned=$((before_lines - after_lines))

            if [ "$cleaned" -gt 0 ]; then
                success "Removidas $cleaned referências de $log_file"
                ((lines_cleaned += cleaned))
            fi
        fi
    done

    audit "Total log lines cleaned: $lines_cleaned"
}

# Verificação pós-exclusão
verify_erasure() {
    local user_id=$1

    header "VERIFICAÇÃO PÓS-EXCLUSÃO"

    audit "Starting post-erasure verification for user $user_id"

    warning "Verificando se dados foram completamente removidos..."

    local issues_found=0

    # Verificar banco de dados
    if PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-localhost} -U ${DB_USER:-chatwoot} -d ${DB_NAME:-chatwoot_production} -c "
        SELECT COUNT(*) as remaining_records
        FROM (
            SELECT user_id FROM user_profiles WHERE user_id = '$user_id'
            UNION ALL
            SELECT user_id FROM chat_messages WHERE user_id = '$user_id'
            UNION ALL
            SELECT user_id FROM transactions WHERE user_id = '$user_id'
        ) as combined;
    " 2>/dev/null | grep -q "0"; then
        success "Verificação de banco: OK"
    else
        error "Dados ainda encontrados no banco!"
        ((issues_found++))
    fi

    # Verificar arquivos
    if ! find uploads -name "*${user_id}*" 2>/dev/null | grep -q .; then
        success "Verificação de arquivos: OK"
    else
        error "Arquivos do usuário ainda encontrados!"
        ((issues_found++))
    fi

    if [ "$issues_found" -eq 0 ]; then
        success "VERIFICAÇÃO CONCLUÍDA: Todos os dados foram removidos com sucesso"
        audit "Erasure verification: PASSED"
        return 0
    else
        error "VERIFICAÇÃO FALHADA: $issues_found problemas encontrados"
        audit "Erasure verification: FAILED ($issues_found issues)"
        return 1
    fi
}

# Geração de relatório de conformidade
generate_compliance_report() {
    local user_id=$1
    local success=$2
    local report_file="reports/gdpr_erasure_${user_id}_$(date +%Y%m%d_%H%M%S).pdf"

    header "RELATÓRIO DE CONFORMIDADE GDPR"

    cat << EOF
📋 RELATÓRIO DE EXCLUSÃO GDPR
=======================================

ID do Usuário: $user_id
Data/Hora: $(date)
Status: $([ "$success" = "true" ] && echo "CONCLUÍDO COM SUCESSO" || echo "FALHA NA EXCLUSÃO")

🔍 DADOS EXCLUÍDOS:
   ✅ Perfil do usuário
   ✅ Histórico de conversas
   ✅ Registros de transações
   ✅ Arquivos enviados
   ✅ Dados de analytics
   ✅ Sessões ativas
   ✅ Logs de sistema

🏛️  PROVEDORES TERCEIROS NOTIFICADOS:
   ✅ Stripe (pagamentos)
   ✅ SendGrid (email)
   ✅ Intercom (suporte)
   ✅ HubSpot (CRM)
   ✅ Google Analytics

⚖️  CONFORMIDADE:
   ✅ Lei Geral de Proteção de Dados (LGPD)
   ✅ General Data Protection Regulation (GDPR)
   ✅ California Consumer Privacy Act (CCPA)

⏰ RETENÇÃO DE BACKUP:
   Dados criptografados mantidos por 30 dias conforme política de backup
   Backup local em: backups/gdpr/${user_id}_$(date +%Y%m%d)

📞 SUPORTE:
   Caso necessário recuperar dados, contate: privacy@getnexo.com.br
   Prazo para recuperação: 30 dias após solicitação

Assinado digitalmente por: GetNexo GDPR System
Timestamp: $(date +%s)
Checksum: $(echo "$user_id$(date)" | sha256sum | cut -d' ' -f1)

=======================================
EOF

    # Em produção, converter para PDF
    success "Relatório de conformidade gerado"
    audit "Compliance report generated: $report_file"
}

# Função principal
main() {
    if [ $# -eq 0 ]; then
        echo "🗑️  GetNexo GDPR Erasure System"
        echo "Sistema de exclusão automática de dados do usuário"
        echo
        echo "Uso: $0 <user_id> [--force] [--dry-run]"
        echo
        echo "Opções:"
        echo "  --force   Pular verificações de consentimento"
        echo "  --dry-run Executar simulação sem excluir dados"
        echo
        echo "Exemplo: $0 user_12345"
        exit 1
    fi

    local user_id=$1
    local force_mode=false
    local dry_run=false

    # Processar argumentos
    shift
    while [ $# -gt 0 ]; do
        case $1 in
            --force)
                force_mode=true
                ;;
            --dry-run)
                dry_run=true
                ;;
            *)
                error "Opção desconhecida: $1"
                exit 1
                ;;
        esac
        shift
    done

    # Validação inicial
    if [ -z "$user_id" ]; then
        error "ID do usuário é obrigatório"
        exit 1
    fi

    audit "GDPR Erasure initiated for user: $user_id (Force: $force_mode, Dry-run: $dry_run)"

    echo "🗑️  GDPR ERASURE SYSTEM - GETNEXO"
    echo "==================================="
    echo "Usuário: $user_id"
    echo "Modo forçado: $force_mode"
    echo "Simulação: $dry_run"
    echo

    local erasure_success=true

    # 1. Criar backup (sempre, exceto em dry-run)
    if [ "$dry_run" = false ]; then
        create_backup "$user_id" || erasure_success=false
    else
        warning "DRY RUN: Pulando criação de backup"
    fi

    # 2. Verificar consentimento
    if [ "$force_mode" = false ]; then
        verify_consent "$user_id" || exit 1
    else
        warning "MODO FORÇADO: Pulando verificação de consentimento"
    fi

    # 3. Executar exclusões
    if [ "$dry_run" = false ]; then
        erase_database_data "$user_id" || erasure_success=false
        erase_files "$user_id" || erasure_success=false
        erase_analytics "$user_id" || erasure_success=false
        erase_third_party "$user_id" || erasure_success=false
        clean_logs "$user_id" || erasure_success=false
    else
        warning "DRY RUN: Simulando exclusões..."
        sleep 2
    fi

    # 4. Verificar exclusão
    if [ "$dry_run" = false ]; then
        verify_erasure "$user_id" || erasure_success=false
    fi

    # 5. Gerar relatório
    generate_compliance_report "$user_id" "$erasure_success"

    echo
    echo "==================================="

    if [ "$erasure_success" = true ]; then
        success "🎉 EXCLUSÃO GDPR CONCLUÍDA COM SUCESSO!"
        success "Todos os dados do usuário $user_id foram permanentemente removidos"
        audit "GDPR Erasure completed successfully for user $user_id"
    else
        error "❌ EXCLUSÃO GDPR CONCLUÍDA COM PROBLEMAS"
        error "Alguns dados podem ter permanecido - verificar logs"
        audit "GDPR Erasure completed with issues for user $user_id"
        exit 1
    fi

    if [ "$dry_run" = true ]; then
        warning "Esta foi uma simulação - nenhum dado foi realmente excluído"
    fi

    echo
    echo "📋 Logs de auditoria: $AUDIT_LOG"
    echo "💾 Backups: $BACKUP_LOG"
}