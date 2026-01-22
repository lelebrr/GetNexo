#!/bin/bash
# GetNexo Foundation Donation - Automação Financeira de Doações (Profit Split)
# Calcula e distribui doações automaticamente baseado no lucro

set -e  # Exit on any error

# Configurações
DONATION_PERCENTAGE=${DONATION_PERCENTAGE:-0.05}  # 5% do lucro
FOUNDATION_ADDRESS=${FOUNDATION_ADDRESS:-"foundation_wallet_address"}
MIN_DONATION_AMOUNT=${MIN_DONATION_AMOUNT:-100}  # Valor mínimo para doação
DONATION_CURRENCY=${DONATION_CURRENCY:-"BRL"}

# Arquivos de dados
PROFIT_LOG="data/profit_log.json"
DONATION_LOG="data/donation_log.json"
BALANCE_FILE="data/current_balance.json"

# Projetos/causas suportadas
declare -A FOUNDATIONS=(
    ["environmental"]="Fundação Ambiental Brasil"
    ["education"]="Instituto Educação para Todos"
    ["health"]="Hospital das Clínicas"
    ["tech_innovation"]="Instituto de Tecnologia Inovadora"
    ["community"]="Centro Comunitário Local"
)

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de logging
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" >> logs/donation_system.log
    echo -e "$1"
}

error() {
    echo -e "${RED}❌ ERRO:${NC} $1" >&2
    log "ERRO: $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCESSO: $1"
}

warning() {
    echo -e "${YELLOW}⚠️  AVISO:${NC} $1"
    log "AVISO: $1"
}

# Cria diretórios necessários
setup_directories() {
    mkdir -p data logs
    touch logs/donation_system.log
}

# Calcula lucro mensal
calculate_monthly_profit() {
    local current_month=$(date +%Y-%m)
    local total_revenue=0
    local total_costs=0

    log "📊 Calculando lucro mensal para $current_month"

    # Lê dados de receita (simulação - em produção conectar com ERP/contabilidade)
    if [ -f "$PROFIT_LOG" ]; then
        # Parse JSON para extrair dados do mês atual
        total_revenue=$(jq -r ".revenues[] | select(.month == \"$current_month\") | .amount" "$PROFIT_LOG" 2>/dev/null | awk '{sum += $1} END {print sum}')
        total_costs=$(jq -r ".costs[] | select(.month == \"$current_month\") | .amount" "$PROFIT_LOG" 2>/dev/null | awk '{sum += $1} END {print sum}')
    fi

    # Valores padrão se não houver dados
    total_revenue=${total_revenue:-50000}  # R$ 50.000
    total_costs=${total_costs:-35000}      # R$ 35.000

    local profit=$((total_revenue - total_costs))

    echo "$profit"
}

# Calcula valor da doação
calculate_donation_amount() {
    local profit=$1
    local donation_amount=0

    if [ "$profit" -gt 0 ]; then
        # Calcula doação baseada na porcentagem
        donation_amount=$(echo "scale=2; $profit * $DONATION_PERCENTAGE" | bc)

        # Arredonda para inteiro
        donation_amount=$(printf "%.0f" "$donation_amount")

        # Verifica valor mínimo
        if [ "$donation_amount" -lt "$MIN_DONATION_AMOUNT" ]; then
            warning "Valor da doação ($donation_amount $DONATION_CURRENCY) abaixo do mínimo ($MIN_DONATION_AMOUNT $DONATION_CURRENCY)"
            donation_amount=0
        fi
    fi

    echo "$donation_amount"
}

# Seleciona causa para doação
select_cause() {
    local profit=$1
    local cause=""

    # Lógica de seleção baseada no lucro
    if [ "$profit" -gt 100000 ]; then
        # Lucro alto: múltiplas causas
        cause="multiple"
    elif [ "$profit" -gt 50000 ]; then
        # Lucro médio: educação ou saúde
        cause="education"
    else
        # Lucro baixo: comunidade local
        cause="community"
    fi

    echo "$cause"
}

# Distribui doação para múltiplas causas
distribute_multiple_causes() {
    local total_donation=$1
    local distribution=()

    # Distribuição: 40% ambiental, 30% educação, 20% saúde, 10% inovação
    local env_amount=$(echo "scale=2; $total_donation * 0.4" | bc)
    local edu_amount=$(echo "scale=2; $total_donation * 0.3" | bc)
    local health_amount=$(echo "scale=2; $total_donation * 0.2" | bc)
    local tech_amount=$(echo "scale=2; $total_donation * 0.1" | bc)

    distribution+=("{\"cause\":\"environmental\",\"amount\":\"$env_amount\"}")
    distribution+=("{\"cause\":\"education\",\"amount\":\"$edu_amount\"}")
    distribution+=("{\"cause\":\"health\",\"amount\":\"$health_amount\"}")
    distribution+=("{\"cause\":\"tech_innovation\",\"amount\":\"$tech_amount\"}")

    echo "${distribution[@]}"
}

# Simula processamento de doação
process_donation() {
    local cause=$1
    local amount=$2
    local cause_name=${FOUNDATIONS[$cause]:-"Causa Desconhecida"}

    log "💰 Processando doação: $amount $DONATION_CURRENCY para $cause_name"

    # Simulação de processamento bancário
    # Em produção, integrar com API bancária ou Stripe/PayPal
    sleep 2

    # Simula taxa de sucesso de 95%
    if [ $((RANDOM % 100)) -lt 95 ]; then
        success "Doação de $amount $DONATION_CURRENCY processada com sucesso para $cause_name"
        return 0
    else
        error "Falha no processamento da doação para $cause_name"
        return 1
    fi
}

# Registra doação no log
log_donation() {
    local cause=$1
    local amount=$2
    local status=${3:-"success"}

    local donation_entry=$(cat <<EOF
{
    "timestamp": "$(date -Iseconds)",
    "cause": "$cause",
    "cause_name": "${FOUNDATIONS[$cause]:-"Causa Desconhecida"}",
    "amount": "$amount",
    "currency": "$DONATION_CURRENCY",
    "status": "$status",
    "profit_percentage": "$DONATION_PERCENTAGE",
    "month": "$(date +%Y-%m)"
}
EOF
)

    # Adiciona ao log
    if [ -f "$DONATION_LOG" ]; then
        # Adiciona ao array existente
        jq ".donations += [$donation_entry]" "$DONATION_LOG" > "${DONATION_LOG}.tmp"
        mv "${DONATION_LOG}.tmp" "$DONATION_LOG"
    else
        # Cria novo arquivo
        echo "{\"donations\": [$donation_entry]}" > "$DONATION_LOG"
    fi

    log "📝 Doação registrada no log: $amount $DONATION_CURRENCY para $cause"
}

# Verifica se já fez doação este mês
check_monthly_donation() {
    local current_month=$(date +%Y-%m)

    if [ -f "$DONATION_LOG" ]; then
        local monthly_donations=$(jq -r ".donations[] | select(.month == \"$current_month\") | .amount" "$DONATION_LOG" 2>/dev/null | wc -l)
        if [ "$monthly_donations" -gt 0 ]; then
            warning "Doação já realizada este mês ($current_month)"
            return 1
        fi
    fi

    return 0
}

# Exibe relatório mensal
generate_monthly_report() {
    local profit=$1
    local donation_amount=$2

    echo "📊 RELATÓRIO DE DOAÇÕES GETNEXO"
    echo "========================================"
    echo "📅 Mês: $(date +%Y-%m)"
    echo "💰 Lucro Total: R$ $profit"
    echo "🎯 Percentual de Doação: $(echo "scale=1; $DONATION_PERCENTAGE * 100" | bc)%"
    echo "💝 Valor da Doação: R$ $donation_amount"
    echo

    if [ -f "$DONATION_LOG" ]; then
        echo "📈 Histórico de Doações:"
        jq -r '.donations[] | "  - \(.month): R$ \(.amount) para \(.cause_name)"' "$DONATION_LOG" 2>/dev/null | tail -5
        echo
    fi

    echo "🏛️  Causas Suportadas:"
    for cause in "${!FOUNDATIONS[@]}"; do
        echo "  - $cause: ${FOUNDATIONS[$cause]}"
    done
    echo "========================================"
}

# Função principal
main() {
    setup_directories

    echo "🎁 GETNEXO FOUNDATION DONATION SYSTEM"
    echo "======================================"
    log "Sistema de doações iniciado"

    # Verifica se já doou este mês
    if ! check_monthly_donation; then
        echo "Doação mensal já realizada. Use --force para sobrescrever."
        exit 0
    fi

    # Calcula lucro
    local profit=$(calculate_monthly_profit)
    log "Lucro calculado: $profit $DONATION_CURRENCY"

    # Calcula valor da doação
    local donation_amount=$(calculate_donation_amount "$profit")

    if [ "$donation_amount" -eq 0 ]; then
        warning "Nenhuma doação necessária este mês (lucro insuficiente ou abaixo do mínimo)"
        exit 0
    fi

    success "Valor da doação calculado: $donation_amount $DONATION_CURRENCY"

    # Seleciona causa
    local cause=$(select_cause "$profit")
    success "Causa selecionada: $cause"

    # Processa doação
    local donation_success=true

    if [ "$cause" = "multiple" ]; then
        # Distribui para múltiplas causas
        local distributions=($(distribute_multiple_causes "$donation_amount"))

        for dist in "${distributions[@]}"; do
            local cause_name=$(echo "$dist" | jq -r '.cause')
            local amount=$(echo "$dist" | jq -r '.amount')

            if process_donation "$cause_name" "$amount"; then
                log_donation "$cause_name" "$amount" "success"
            else
                log_donation "$cause_name" "$amount" "failed"
                donation_success=false
            fi
        done
    else
        # Doação para causa única
        if process_donation "$cause" "$donation_amount"; then
            log_donation "$cause" "$donation_amount" "success"
        else
            log_donation "$cause" "$donation_amount" "failed"
            donation_success=false
        fi
    fi

    # Relatório final
    generate_monthly_report "$profit" "$donation_amount"

    if [ "$donation_success" = true ]; then
        success "🎉 SISTEMA DE DOAÇÕES EXECUTADO COM SUCESSO!"
        log "Doação mensal concluída com sucesso"
    else
        error "Sistema de doações concluído com falhas parciais"
    fi

    echo
    echo "💡 Lembre-se: 'O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.' - Winston Churchill"
}

# Processa argumentos da linha de comando
case "${1:-}" in
    "--help"|"-h")
        echo "GetNexo Foundation Donation System"
        echo
        echo "Uso: $0 [opções]"
        echo
        echo "Opções:"
        echo "  --force    Força execução mesmo se já doou este mês"
        echo "  --report   Apenas exibe relatório mensal"
        echo "  --help     Exibe esta ajuda"
        echo
        echo "Variáveis de ambiente:"
        echo "  DONATION_PERCENTAGE  Percentual do lucro para doar (padrão: 0.05)"
        echo "  MIN_DONATION_AMOUNT  Valor mínimo para doação (padrão: 100)"
        echo "  FOUNDATION_ADDRESS   Endereço da carteira/fundação"
        exit 0
        ;;

    "--report")
        if [ -f "$DONATION_LOG" ]; then
            echo "📊 RELATÓRIO DE DOAÇÕES RECENTES"
            jq -r '.donations[] | "\(.timestamp): R$ \(.amount) para \(.cause_name) [\(.status)]"' "$DONATION_LOG" 2>/dev/null | tail -10
        else
            echo "Nenhuma doação registrada ainda."
        fi
        exit 0
        ;;

    "--force")
        # Remove verificação mensal
        sed -i '/check_monthly_donation/d' "$0"
        main
        ;;

    *)
        main
        ;;
esac