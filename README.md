# worker-mailgun-telegram
Cloudflare worker that bounces mail messages to telegram 

# Usage
1. Create a telegram bot using [@BotFather](https://t.me/botfather) and get the token.
2. Create a telegram channel and add the bot to the channel.
3. Installa Wrangler e autenticati su Cloudflare:
   ```bash
   # Installa Wrangler globalmente
   npm install -g wrangler

   # Per ambienti con accesso al browser:
   wrangler login

   # Per ambienti containerizzati o remoti (senza accesso al browser):
   # 1. Genera un token API su https://dash.cloudflare.com/profile/api-tokens
   # 2. Configura il token:
   wrangler config set apiToken YOUR_API_TOKEN
   ```
4. Inizializza un nuovo progetto TypeScript:
   ```bash
   # Crea una nuova directory per il progetto (se necessario)
   mkdir -p worker-mailgun-telegram
   cd worker-mailgun-telegram

   # Inizializza un nuovo progetto TypeScript con Wrangler
   wrangler init
   ```
5. Configura il progetto modificando il file `wrangler.toml` secondo le tue esigenze.