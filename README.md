# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Cataloghi: sfogliatore

I PDF dei partner sono file da stampa (fino a 362 MB e 348 pagine): non sono
servibili a un browser, e su Android Chrome li scarica invece di aprirli.

Il sito quindi non mostra il PDF ma pagine WebP pre-renderizzate, ~40 KB l'una
su mobile e ~100 KB su desktop, caricate una alla volta. Il PDF originale resta
raggiungibile dal pulsante "PDF" dentro lo sfogliatore.

### Aggiungere o aggiornare un catalogo

1. Aggiungi la voce in `app/data/catalogs.json` (`cover`, `catalog`, `id`).
2. Renderizza le pagine:

   ```sh
   node scripts/render-catalogs.mjs --only <id-del-catalogo>
   ```

   Lo script scarica il PDF, produce le pagine in due larghezze e scrive il
   numero di pagine dentro `catalogs.json`. È ripartibile: se lo interrompi,
   al rilancio salta quelle già fatte.

3. Carica le pagine sul bucket R2:

   ```sh
   ./scripts/upload-catalogs.sh /tmp/gsm-cataloghi
   ```

4. Fai il build e pubblica: il campo `pages` appena scritto attiva lo
   sfogliatore per quel catalogo e aggiunge la sua route al prerender.

Finché un catalogo non ha `pages`, la sua copertina continua a linkare
direttamente al PDF come prima: la migrazione si può fare un catalogo per volta.

Richiede `poppler` e `webp` (`brew install poppler webp`) e, per l'upload,
`rclone` configurato come spiegato in testa a `scripts/upload-catalogs.sh`.
