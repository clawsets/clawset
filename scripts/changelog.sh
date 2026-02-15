#!/usr/bin/env bash
set -euo pipefail

CLIFF="./node_modules/.bin/git-cliff"
PRESET="${1:-}"

# Extract version from a JSON file using lightweight parsing
read_version() {
  local file="$1"
  sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$file" | head -1
}

# Write a changelog header + git-cliff body to the output file
write_changelog() {
  local header="$1"
  local outfile="$2"
  shift 2
  local body
  body=$($CLIFF --config cliff.toml "$@")
  printf "# Changelog\n\n%s\n\n%s" "$header" "$body" > "$outfile"
}

if [ -z "$PRESET" ]; then
  # Whole-package changelog
  VERSION=$(read_version packages/clawset/package.json)
  write_changelog \
    "All notable changes to this project will be documented in this file." \
    CHANGELOG.md \
    --tag "v$VERSION"
else
  # Per-preset changelog, scoped to commits touching that preset dir
  if [ ! -d "presets/$PRESET" ]; then
    echo "Error: preset '$PRESET' not found in presets/" >&2
    exit 1
  fi
  VERSION=$(read_version "presets/$PRESET/spec.json")
  write_changelog \
    "All notable changes to this preset will be documented in this file." \
    "presets/$PRESET/CHANGELOG.md" \
    --tag "v$VERSION" --include-path "presets/$PRESET/**"
fi
