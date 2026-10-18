#!/usr/bin/env bash
#
# Carica le pagine WebP prodotte da render-catalogs.mjs sul bucket R2.
#
# Configurazione una tantum (le credenziali restano sulla tua macchina,
# non in questo repo):
#
#   rclone config create r2-gsm s3 \
#     provider=Cloudflare \
#     access_key_id=... \
#     secret_access_key=... \
#     endpoint=https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
#     acl=private
#
# Uso:
#   ./scripts/upload-catalogs.sh /percorso/cartella-di-lavoro
#   ./scripts/upload-catalogs.sh /percorso/cartella-di-lavoro --dry-run
#
set -euo pipefail

REMOTE="${R2_REMOTE:-r2-gsm}"
BUCKET="${R2_BUCKET:-gsm-abbigliamento}"

WORK_DIR="${1:-}"
shift || true

if [[ -z "$WORK_DIR" || ! -d "$WORK_DIR/sfoglia" ]]; then
  echo "Uso: $0 <cartella-di-lavoro> [--dry-run]"
  echo "La cartella deve contenere una sottocartella 'sfoglia'."
  exit 1
fi

if ! command -v rclone >/dev/null; then
  echo "Manca rclone. Installalo con:  brew install rclone"
  exit 1
fi

if ! rclone listremotes | grep -q "^${REMOTE}:$"; then
  echo "Il remote rclone '${REMOTE}' non esiste. Configuralo come spiegato in testa a questo script,"
  echo "oppure indicane un altro con:  R2_REMOTE=nome $0 ..."
  exit 1
fi

echo "Carico $WORK_DIR/sfoglia  ->  ${REMOTE}:${BUCKET}/sfoglia"
echo

# --immutable: le pagine gia' caricate non vengono ritoccate, cosi' il comando
# si puo' rilanciare per aggiungere solo i cataloghi nuovi.
rclone copy "$WORK_DIR/sfoglia" "${REMOTE}:${BUCKET}/sfoglia" \
  --transfers 16 \
  --checkers 32 \
  --immutable \
  --header-upload "Cache-Control: public, max-age=31536000, immutable" \
  --header-upload "Content-Type: image/webp" \
  --progress \
  "$@"

echo
echo "Fatto. Verifica una pagina a caso, per esempio:"
echo "  curl -sI https://pub-b0f8272c710649f68ef7029d37933dc5.r2.dev/sfoglia/<id>/w1000/p0001.webp"
