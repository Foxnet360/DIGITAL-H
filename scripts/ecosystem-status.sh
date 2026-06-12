#!/bin/bash

# =============================================================================
# ecosystem-status.sh - Script interactivo del ecosistema ACRUX
# =============================================================================
# Muestra el estado de todos los proyectos del ecosistema y proporciona
# un menu interactivo para gestionarlos.
#
# Uso:
#   ./scripts/ecosystem-status.sh              # Modo interactivo
#   ./scripts/ecosystem-status.sh --status     # Solo mostrar estado
#   ./scripts/ecosystem-status.sh --check      # Validacion cruzada
#   ./scripts/ecosystem-status.sh --build-all  # Compilar todos
#   ./scripts/ecosystem-status.sh --update     # Actualizar en todos los proyectos
#
# El script detecta automaticamente los proyectos desde ../acrux/
# =============================================================================

set -euo pipefail

# Version del script
SCRIPT_VERSION="1.0.0"
SCRIPT_NAME="ecosystem-status.sh"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Detectar si estamos en modo interactivo
INTERACTIVE=false
if [ -t 0 ] && [ -t 1 ]; then
    INTERACTIVE=true
fi

# =============================================================================
# FUNCIONES DE UTILIDAD
# =============================================================================

log_info() { echo -e "${BLUE}ℹ${NC}  $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_step() { echo -e "\n${CYAN}▶${NC} ${CYAN}$1${NC}"; }

# =============================================================================
# DETECCION DEL ECOSISTEMA
# =============================================================================

# Detectar directorio raiz del ecosistema
find_ecosystem_root() {
    local current_dir="$(pwd)"
    local parent_dir="$(dirname "$current_dir")"
    
    # Si el directorio padre se llama "Acrux" o "acrux", usarlo
    if [[ "$(basename "$parent_dir")" =~ ^[Aa]crux$ ]]; then
        echo "$parent_dir"
        return 0
    fi
    
    # Si estamos en acrux.life/scripts/, el root es ../..
    if [[ "$current_dir" =~ /acrux\.life/scripts$ ]]; then
        echo "$(dirname "$(dirname "$current_dir")")"
        return 0
    fi
    
    # Intentar buscar ../acrux/
    if [ -d "../acrux" ]; then
        echo "$(cd ../acrux && pwd)"
        return 0
    fi
    
    # Fallback: usar el directorio padre
    echo "$parent_dir"
}

# Proyectos conocidos del ecosistema
declare -A ECOSYSTEM_PROJECTS=(
    ["acrux.life"]={"name":"ACRUX.life","emoji":"🌐","type":"main"}
    ["DIGITAL-H"]={"name":"DIGITAL-H","emoji":"🔧","type":"lead-magnet"}
    ["PULSO-H"]={"name":"PULSO-H","emoji":"💓","type":"lead-magnet"}
    ["acrux-design-tokens"]={"name":"Design Tokens","emoji":"🎨","type":"shared"}
)

# Directorio raiz del ecosistema
ECOSYSTEM_ROOT="$(find_ecosystem_root)"

# =============================================================================
# FUNCIONES DE ESTADO
# =============================================================================

# Obtener branch actual de un proyecto
get_branch() {
    local project_dir="$1"
    if [ -d "$project_dir/.git" ]; then
        cd "$project_dir" && git branch --show-current 2>/dev/null || echo "unknown"
    else
        echo "no-git"
    fi
}

# Obtener estado git (clean/dirty)
get_git_status() {
    local project_dir="$1"
    if [ -d "$project_dir/.git" ]; then
        cd "$project_dir"
        if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
            echo "clean"
        else
            echo "dirty"
        fi
    else
        echo "no-git"
    fi
}

# Obtener version de package.json
get_version() {
    local project_dir="$1"
    if [ -f "$project_dir/package.json" ]; then
        grep -o '"version": *"[^"]*"' "$project_dir/package.json" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/' || echo "unknown"
    else
        echo "no-pkg"
    fi
}

# Obtener tiempo del ultimo commit
get_last_commit() {
    local project_dir="$1"
    if [ -d "$project_dir/.git" ]; then
        cd "$project_dir"
        git log -1 --format="%cr" 2>/dev/null || echo "unknown"
    else
        echo "no-git"
    fi
}

# Verificar si un proyecto compila
check_build() {
    local project_dir="$1"
    local project_name="$2"
    
    if [ ! -f "$project_dir/package.json" ]; then
        echo "no-build"
        return
    fi
    
    # Verificar si ya existe dist/
    if [ -d "$project_dir/dist" ] && [ -f "$project_dir/dist/index.html" ]; then
        echo "built"
        return
    fi
    
    echo "not-built"
}

# Compilar un proyecto
build_project() {
    local project_dir="$1"
    local project_name="$2"
    
    log_step "Compilando $project_name..."
    
    cd "$project_dir"
    
    if [ ! -f "package.json" ]; then
        log_error "No se encontro package.json en $project_dir"
        return 1
    fi
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        log_info "Instalando dependencias..."
        if ! npm install 2>&1 | tail -5; then
            log_error "Fallo la instalacion de dependencias"
            return 1
        fi
    fi
    
    # Compilar
    log_info "Ejecutando npm run build..."
    if npm run build 2>&1 | tail -20; then
        log_success "$project_name compilado exitosamente"
        return 0
    else
        log_error "$project_name no compilo"
        return 1
    fi
}

# =============================================================================
# MOSTRAR ESTADO
# =============================================================================

show_status() {
    local show_header="${1:-true}"
    
    if [ "$show_header" = "true" ]; then
        echo ""
        echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${CYAN}║${NC}           ${WHITE}${BOLD}ECOSISTEMA ACRUX - Estado General${NC}                        ${CYAN}║${NC}"
        echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════════╣${NC}"
        echo ""
    fi
    
    # Encabezados de tabla
    printf "  ${BOLD}%-18s %-12s %-10s %-10s %-20s${NC}\n" \
        "PROYECTO" "BRANCH" "STATUS" "VERSION" "LAST COMMIT"
    echo "  ──────────────────────────────────────────────────────────────────────"
    
    # Iterar sobre proyectos
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H" "acrux-design-tokens")
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        
        # Verificar si existe
        if [ ! -d "$project_dir" ]; then
            continue
        fi
        
        # Obtener info
        local name="${ECOSYSTEM_PROJECTS[$key]:-$key}"
        local emoji=""
        case "$key" in
            "acrux.life") emoji="🌐 " ;;
            "DIGITAL-H") emoji="🔧 " ;;
            "PULSO-H") emoji="💓 " ;;
            "acrux-design-tokens") emoji="🎨 " ;;
        esac
        
        local branch="$(get_branch "$project_dir")"
        local status="$(get_git_status "$project_dir")"
        local version="$(get_version "$project_dir")"
        local last_commit="$(get_last_commit "$project_dir")"
        
        # Colores segun estado
        local status_color="$GREEN"
        local status_symbol="✓"
        if [ "$status" = "dirty" ]; then
            status_color="$YELLOW"
            status_symbol="⚠"
        elif [ "$status" = "no-git" ]; then
            status_color="$RED"
            status_symbol="✗"
        fi
        
        # Truncar branch si es muy largo
        if [ ${#branch} -gt 10 ]; then
            branch="${branch:0:7}..."
        fi
        
        # Imprimir fila
        printf "  ${emoji}%-15s ${CYAN}%-12s${NC} %b%-9s${NC} ${MAGENTA}%-10s${NC} %-20s\n" \
            "$name" \
            "$branch" \
            "$status_color" \
            "$status_symbol $status" \
            "$version" \
            "$last_commit"
    done
    
    if [ "$show_header" = "true" ]; then
        echo ""
        echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    fi
}

# =============================================================================
# MENU INTERACTIVO
# =============================================================================

show_menu() {
    echo ""
    echo -e "${WHITE}${BOLD}MENU PRINCIPAL:${NC}"
    echo "────────────────────────────────────────────────────────────────────────"
    echo "  1) 📊  Estado detallado de un proyecto"
    echo "  2) 📝  Git status de un proyecto"
    echo "  3) 📜  Git log de un proyecto"
    echo "  4) 🔨  Compilar un proyecto"
    echo "  5) 🔨  Compilar TODOS los proyectos"
    echo "  6) 🔍  Validacion cruzada (design-tokens)"
    echo "  7) 🚀  Deployar un proyecto"
    echo "  8) 🔄  Actualizar este script en todos los proyectos"
    echo "  9) ❌  Salir"
    echo ""
}

# Mostrar proyectos disponibles para seleccion
show_project_selection() {
    local prompt="$1"
    echo ""
    echo -e "${CYAN}$prompt${NC}"
    echo ""
    
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H" "acrux-design-tokens")
    local i=1
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        if [ -d "$project_dir" ]; then
            local emoji=""
            case "$key" in
                "acrux.life") emoji="🌐" ;;
                "DIGITAL-H") emoji="🔧" ;;
                "PULSO-H") emoji="💓" ;;
                "acrux-design-tokens") emoji="🎨" ;;
            esac
            local name="${ECOSYSTEM_PROJECTS[$key]:-$key}"
            echo "  $i) $emoji $name"
            ((i++))
        fi
    done
    echo ""
}

# Obtener proyecto seleccionado
get_selected_project() {
    local selection="$1"
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H" "acrux-design-tokens")
    local i=1
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        if [ -d "$project_dir" ]; then
            if [ "$i" = "$selection" ]; then
                echo "$key"
                return 0
            fi
            ((i++))
        fi
    done
    
    return 1
}

# =============================================================================
# ACCIONES DEL MENU
# =============================================================================

action_status_detail() {
    show_project_selection "Selecciona un proyecto para ver detalles:"
    echo -n "Opcion: "
    read -r selection
    
    local project
    if ! project="$(get_selected_project "$selection")"; then
        log_error "Seleccion invalida"
        return 1
    fi
    
    local project_dir="$ECOSYSTEM_ROOT/$project"
    local name="${ECOSYSTEM_PROJECTS[$project]:-$project}"
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  DETALLES: $name${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  Directorio: $project_dir"
    echo "  Branch:     $(get_branch "$project_dir")"
    echo "  Status:     $(get_git_status "$project_dir")"
    echo "  Version:    $(get_version "$project_dir")"
    echo "  Last commit: $(get_last_commit "$project_dir")"
    echo "  Build:      $(check_build "$project_dir" "$name")"
    echo ""
    
    if [ -d "$project_dir/.git" ]; then
        cd "$project_dir"
        echo -e "${CYAN}Archivos modificados:${NC}"
        git status --short 2>/dev/null || echo "  (no hay cambios)"
        echo ""
    fi
}

action_git_status() {
    show_project_selection "Selecciona un proyecto para ver git status:"
    echo -n "Opcion: "
    read -r selection
    
    local project
    if ! project="$(get_selected_project "$selection")"; then
        log_error "Seleccion invalida"
        return 1
    fi
    
    local project_dir="$ECOSYSTEM_ROOT/$project"
    cd "$project_dir"
    
    echo ""
    git status
    echo ""
}

action_git_log() {
    show_project_selection "Selecciona un proyecto para ver git log:"
    echo -n "Opcion: "
    read -r selection
    
    local project
    if ! project="$(get_selected_project "$selection")"; then
        log_error "Seleccion invalida"
        return 1
    fi
    
    local project_dir="$ECOSYSTEM_ROOT/$project"
    cd "$project_dir"
    
    echo ""
    git log --oneline --graph --decorate -10
    echo ""
}

action_build_one() {
    show_project_selection "Selecciona un proyecto para compilar:"
    echo -n "Opcion: "
    read -r selection
    
    local project
    if ! project="$(get_selected_project "$selection")"; then
        log_error "Seleccion invalida"
        return 1
    fi
    
    local project_dir="$ECOSYSTEM_ROOT/$project"
    local name="${ECOSYSTEM_PROJECTS[$project]:-$project}"
    
    build_project "$project_dir" "$name"
}

action_build_all() {
    log_step "COMPILANDO TODOS LOS PROYECTOS"
    
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H")
    local failed=()
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        if [ ! -d "$project_dir" ]; then
            continue
        fi
        
        local name="${ECOSYSTEM_PROJECTS[$key]:-$key}"
        if ! build_project "$project_dir" "$name"; then
            failed+=("$name")
        fi
        echo ""
    done
    
    echo ""
    if [ ${#failed[@]} -eq 0 ]; then
        log_success "✅ Todos los proyectos compilaron exitosamente"
    else
        log_error "❌ Proyectos que fallaron: ${failed[*]}"
        return 1
    fi
}

action_cross_check() {
    log_step "VALIDACION CRUZADA"
    echo ""
    echo -e "${CYAN}Verificando que todos los proyectos compilen...${NC}"
    echo ""
    
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H")
    local failed=()
    local passed=()
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        if [ ! -d "$project_dir" ]; then
            continue
        fi
        
        local name="${ECOSYSTEM_PROJECTS[$key]:-$key}"
        local emoji=""
        case "$key" in
            "acrux.life") emoji="🌐" ;;
            "DIGITAL-H") emoji="🔧" ;;
            "PULSO-H") emoji="💓" ;;
        esac
        
        echo -n "  $emoji $name     "
        
        cd "$project_dir"
        
        if [ ! -f "package.json" ]; then
            echo -e "${YELLOW}⚠ No tiene package.json${NC}"
            continue
        fi
        
        # Intentar compilar
        local start_time=$(date +%s)
        if npm run build > /tmp/build_$key.log 2>&1; then
            local end_time=$(date +%s)
            local duration=$((end_time - start_time))
            echo -e "${GREEN}✅ Compila (${duration}s)${NC}"
            passed+=("$name")
        else
            echo -e "${RED}❌ Fallo${NC}"
            echo ""
            echo -e "${RED}Error:${NC}"
            tail -20 /tmp/build_$key.log | sed 's/^/    /'
            failed+=("$name")
        fi
    done
    
    rm -f /tmp/build_*.log
    
    echo ""
    if [ ${#failed[@]} -eq 0 ]; then
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}  ✅ VALIDACION CRUZADA EXITOSA${NC}"
        echo -e "${GREEN}  Todos los proyectos compilan correctamente.${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    else
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}  ❌ VALIDACION CRUZADA FALLIDA${NC}"
        echo -e "${RED}  Proyectos con errores: ${failed[*]}${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        return 1
    fi
}

action_deploy() {
    log_step "DEPLOY"
    echo ""
    
    show_status "false"
    
    echo ""
    echo -e "${WHITE}${BOLD}OPCIONES DE DEPLOY:${NC}"
    echo "────────────────────────────────────────────────────────────────────────"
    echo "  1) 🌐  ACRUX.life"
    echo "  2) 🔧  DIGITAL-H"
    echo "  3) 💓  PULSO-H"
    echo "  4) 🚀  TODOS los proyectos"
    echo "  5) ❌  Cancelar"
    echo ""
    echo -n "Selecciona una opcion: "
    read -r selection
    
    case "$selection" in
        1)
            log_step "Deployando ACRUX.life..."
            cd "$ECOSYSTEM_ROOT/acrux.life"
            if [ -f "./scripts/deploy-acrux.sh" ]; then
                ./scripts/deploy-acrux.sh
            elif [ -f "./deploy.sh" ]; then
                ./deploy.sh --acrux --verify
            else
                log_error "No se encontro script de deploy para ACRUX.life"
                return 1
            fi
            ;;
        2)
            log_step "Deployando DIGITAL-H..."
            cd "$ECOSYSTEM_ROOT/acrux.life"
            if [ -f "./scripts/deploy.sh" ]; then
                ./scripts/deploy.sh --digital-h --verify
            else
                log_error "No se encontro script de deploy"
                return 1
            fi
            ;;
        3)
            log_step "Deployando PULSO-H..."
            cd "$ECOSYSTEM_ROOT/acrux.life"
            if [ -f "./scripts/deploy.sh" ]; then
                ./scripts/deploy.sh --pulso-h --verify
            else
                log_error "No se encontro script de deploy"
                return 1
            fi
            ;;
        4)
            log_step "Deployando TODOS los proyectos..."
            cd "$ECOSYSTEM_ROOT/acrux.life"
            if [ -f "./scripts/deploy.sh" ]; then
                ./scripts/deploy.sh --all --verify
            else
                log_error "No se encontro script de deploy"
                return 1
            fi
            ;;
        5|*)
            log_info "Deploy cancelado"
            return 0
            ;;
    esac
}

action_update_script() {
    log_step "ACTUALIZANDO SCRIPT EN TODOS LOS PROYECTOS"
    echo ""
    
    local script_source="$ECOSYSTEM_ROOT/acrux.life/scripts/$SCRIPT_NAME"
    
    if [ ! -f "$script_source" ]; then
        # Si no estamos en acrux.life, buscar el script en el proyecto actual
        script_source="$(pwd)/scripts/$SCRIPT_NAME"
        if [ ! -f "$script_source" ]; then
            log_error "No se encontro el script maestro"
            return 1
        fi
    fi
    
    local project_keys=("acrux.life" "DIGITAL-H" "PULSO-H" "acrux-design-tokens")
    
    for key in "${project_keys[@]}"; do
        local project_dir="$ECOSYSTEM_ROOT/$key"
        if [ ! -d "$project_dir" ]; then
            continue
        fi
        
        local target="$project_dir/scripts/$SCRIPT_NAME"
        
        # Crear directorio scripts si no existe
        mkdir -p "$project_dir/scripts"
        
        # Copiar script
        if cp "$script_source" "$target"; then
            chmod +x "$target"
            log_success "✅ Actualizado: $key/scripts/$SCRIPT_NAME"
        else
            log_error "❌ Fallo al actualizar: $key"
        fi
    done
    
    echo ""
    log_success "Script actualizado en todos los proyectos"
}

# =============================================================================
# MODO NO-INTERACTIVO
# =============================================================================

run_non_interactive() {
    local command="$1"
    
    case "$command" in
        --status|-s)
            show_status
            ;;
        --check|-c)
            action_cross_check
            ;;
        --build-all|-b)
            action_build_all
            ;;
        --update|-u)
            action_update_script
            ;;
        --help|-h)
            show_help
            ;;
        --version|-v)
            echo "ecosystem-status.sh v$SCRIPT_VERSION"
            ;;
        *)
            log_error "Comando desconocido: $command"
            show_help
            exit 1
            ;;
    esac
}

show_help() {
    cat << 'EOF'
Uso: ecosystem-status.sh [opcion]

Opciones:
  --status, -s       Mostrar estado de todos los proyectos
  --check, -c        Ejecutar validacion cruzada
  --build-all, -b    Compilar todos los proyectos
  --update, -u       Actualizar este script en todos los proyectos
  --help, -h         Mostrar esta ayuda
  --version, -v      Mostrar version

Sin opciones: Modo interactivo con menu

Ejemplos:
  ./scripts/ecosystem-status.sh              # Modo interactivo
  ./scripts/ecosystem-status.sh --status     # Solo mostrar estado
  ./scripts/ecosystem-status.sh --check      # Validacion cruzada
EOF
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    # Si hay argumentos, ejecutar modo no-interactivo
    if [ $# -gt 0 ]; then
        run_non_interactive "$1"
        exit 0
    fi
    
    # Si no estamos en modo interactivo, mostrar estado y salir
    if [ "$INTERACTIVE" = "false" ]; then
        show_status
        exit 0
    fi
    
    # Modo interactivo
    while true; do
        show_status
        show_menu
        
        echo -n "Seleccione una opcion: "
        read -r option
        
        case "$option" in
            1) action_status_detail ;;
            2) action_git_status ;;
            3) action_git_log ;;
            4) action_build_one ;;
            5) action_build_all ;;
            6) action_cross_check ;;
            7) action_deploy ;;
            8) action_update_script ;;
            9|q|quit|exit)
                echo ""
                log_info "Saliendo..."
                exit 0
                ;;
            *)
                log_error "Opcion invalida"
                ;;
        esac
        
        echo ""
        echo -n "Presione Enter para continuar..."
        read -r
    done
}

# Ejecutar
main "$@"
