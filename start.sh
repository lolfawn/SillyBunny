#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

is_truthy() {
    local value
    value="$(printf '%s' "${1:-}" | tr '[:upper:]' '[:lower:]')"

    case "$value" in
        1|true|yes|on)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

is_termux() {
    [[ -n "${TERMUX_VERSION:-}" || "${PREFIX:-}" == /data/data/com.termux/files/usr ]]
}

resolve_bun_command() {
    if command -v bun >/dev/null 2>&1; then
        command -v bun
        return 0
    fi

    if [[ -x "$BUN_INSTALL/bin/bun" ]]; then
        printf '%s\n' "$BUN_INSTALL/bin/bun"
        return 0
    fi

    return 1
}

self_update_requested=0
self_update_only=0
skip_auto_update=0
server_args=()

while (($#)); do
    case "$1" in
        --self-update)
            self_update_requested=1
            ;;
        --self-update-only)
            self_update_requested=1
            self_update_only=1
            ;;
        --skip-self-update)
            skip_auto_update=1
            ;;
        --)
            shift
            server_args+=("$@")
            break
            ;;
        *)
            server_args+=("$1")
            ;;
    esac
    shift
done

auto_update_enabled=0
if (( self_update_requested )); then
    auto_update_enabled=1
elif (( ! skip_auto_update )) && is_truthy "${SILLYBUNNY_AUTO_UPDATE:-1}"; then
    auto_update_enabled=1
fi

prereq_args=()
if (( self_update_only )); then
    prereq_args+=(--skip-bun)
fi

if (( auto_update_enabled )) && [[ -d "$SCRIPT_DIR/.git" ]]; then
    prereq_args+=(--require-git)
fi

if (( ${#prereq_args[@]} )); then
    bash "$SCRIPT_DIR/scripts/install-prerequisites.sh" "${prereq_args[@]}"
else
    bash "$SCRIPT_DIR/scripts/install-prerequisites.sh"
fi

if (( self_update_requested )); then
    bash "$SCRIPT_DIR/scripts/self-update.sh"
elif (( auto_update_enabled )); then
    bash "$SCRIPT_DIR/scripts/self-update.sh" --optional
fi

if (( self_update_only )); then
    exit 0
fi

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
if [[ -d "$BUN_INSTALL/bin" ]]; then
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

if is_termux; then
    export TMPDIR="${TMPDIR:-${PREFIX:-/data/data/com.termux/files/usr}/tmp}"
    mkdir -p "$TMPDIR"
fi

BUN_CMD="$(resolve_bun_command)"

echo "Installing Bun packages..."
export NODE_ENV=production
bun_install_args=(install --frozen-lockfile --production)
if is_termux; then
    bun_install_args+=(--backend=copyfile)
fi
"$BUN_CMD" "${bun_install_args[@]}"

echo "Entering SillyBunny..."
export NODE_NO_WARNINGS=1
if (( ${#server_args[@]} )); then
    "$BUN_CMD" server.js "${server_args[@]}"
else
    "$BUN_CMD" server.js
fi
