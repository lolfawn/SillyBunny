#!/usr/bin/env bash

set -euo pipefail

require_bun=1
require_git=0

while (($#)); do
    case "$1" in
        --require-git)
            require_git=1
            ;;
        --skip-bun|--no-bun)
            require_bun=0
            ;;
        --require-bun)
            require_bun=1
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
    shift
done

OS_NAME="$(uname -s 2>/dev/null || echo unknown)"
BUN_INSTALL_DIR="${BUN_INSTALL:-$HOME/.bun}"

have_command() {
    command -v "$1" >/dev/null 2>&1
}

have_working_bun() {
    have_command bun && bun --version >/dev/null 2>&1
}

have_working_git() {
    have_command git && git --version >/dev/null 2>&1
}

add_to_path() {
    local candidate="$1"

    if [[ -z "$candidate" || ! -d "$candidate" ]]; then
        return
    fi

    case ":$PATH:" in
        *":$candidate:"*)
            ;;
        *)
            export PATH="$candidate:$PATH"
            ;;
    esac
}

refresh_known_paths() {
    add_to_path "$BUN_INSTALL_DIR/bin"
    add_to_path /opt/homebrew/bin
    add_to_path /usr/local/bin
}

run_with_privilege() {
    if (( EUID == 0 )); then
        "$@"
        return
    fi

    if have_command sudo; then
        sudo "$@"
        return
    fi

    echo "Automatic package installation requires root access or sudo." >&2
    exit 1
}

install_linux_packages() {
    local packages=("$@")

    if have_command apt-get; then
        run_with_privilege apt-get update
        run_with_privilege apt-get install -y "${packages[@]}"
        return
    fi

    if have_command dnf; then
        run_with_privilege dnf install -y "${packages[@]}"
        return
    fi

    if have_command yum; then
        run_with_privilege yum install -y "${packages[@]}"
        return
    fi

    if have_command pacman; then
        run_with_privilege pacman -Sy --noconfirm "${packages[@]}"
        return
    fi

    if have_command zypper; then
        run_with_privilege zypper --non-interactive install "${packages[@]}"
        return
    fi

    if have_command apk; then
        run_with_privilege apk add --no-cache "${packages[@]}"
        return
    fi

    if have_command pkg; then
        pkg install -y "${packages[@]}"
        return
    fi

    echo "Unable to install packages automatically on this system." >&2
    echo "Please install the following manually: ${packages[*]}" >&2
    exit 1
}

ensure_download_tool() {
    if have_command curl || have_command wget; then
        return
    fi

    echo "A download tool was not found. Installing curl automatically..."

    case "$OS_NAME" in
        Linux|GNU/Linux)
            install_linux_packages curl
            ;;
        *)
            echo "Neither curl nor wget is available." >&2
            echo "Install curl manually so Bun can be downloaded from https://bun.sh/." >&2
            exit 1
            ;;
    esac
}

install_git() {
    if have_working_git; then
        return
    fi

    echo "Git was not found. Installing it automatically..."

    case "$OS_NAME" in
        Darwin)
            if have_command xcode-select && ! xcode-select -p >/dev/null 2>&1; then
                echo "Opening the macOS Command Line Tools installer..."
                xcode-select --install >/dev/null 2>&1 || true
                echo "Finish installing the Command Line Tools, then rerun the launcher." >&2
                exit 1
            fi

            if have_working_git; then
                return
            fi

            echo "Git still is not available on this Mac." >&2
            echo "Run 'xcode-select --install' or install Git manually, then rerun the launcher." >&2
            exit 1
            ;;
        Linux|GNU/Linux)
            install_linux_packages git
            ;;
        *)
            echo "Automatic Git installation is not supported on this platform." >&2
            echo "Install Git manually from https://git-scm.com/downloads" >&2
            exit 1
            ;;
    esac

    refresh_known_paths

    if ! have_working_git; then
        echo "Git installation finished, but 'git' is still unavailable in this session." >&2
        exit 1
    fi
}

install_bun() {
    if have_working_bun; then
        return
    fi

    echo "Bun was not found. Installing it automatically..."

    ensure_download_tool

    if have_command curl; then
        curl -fsSL https://bun.sh/install | bash
    else
        wget -qO- https://bun.sh/install | bash
    fi

    refresh_known_paths

    if ! have_working_bun; then
        echo "Bun installation finished, but 'bun' is still unavailable in this session." >&2
        echo "Install Bun manually from https://bun.sh/" >&2
        exit 1
    fi
}

refresh_known_paths

if (( require_git )); then
    install_git
fi

if (( require_bun )); then
    install_bun
fi
