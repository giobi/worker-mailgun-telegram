import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Definisco l'app Hono
const app = new Hono();

// Middleware globali
app.use(logger());
app.use(cors());

// Informazioni sulla versione e sull'applicazione
const APP_VERSION = "1.0.0";
const APP_NAME = "Mailgun2Telegram Worker";

// Route per il controllo dello stato di salute del sistema
app.get("/system", async (c) => {
  const now = new Date();
  const uptime = process.uptime();
  
  // Informazioni di base sul sistema
  const systemInfo = {
    status: "healthy",
    version: APP_VERSION,
    name: APP_NAME,
    timestamp: now.toISOString(),
    uptime: `${Math.floor(uptime)} seconds`,
    environment: c.env.ENVIRONMENT || "development",
    memory: {
      // Cloudflare Workers non supportano process.memoryUsage()
      // Ma possiamo includere altre metriche in futuro
      note: "Memory usage metrics not available in Workers runtime"
    }
  };

  return c.json(systemInfo);
});

// Reindirizza la root all'health check
app.get("/", (c) => c.redirect("/system"));

// TODO: Aggiungere qui le altre routes per la gestione delle email e dei messaggi Telegram

// Gestione degli errori
app.notFound((c) => {
  return c.json({ 
    error: "Not Found", 
    message: "La risorsa richiesta non esiste",
    path: c.req.path
  }, 404);
});

app.onError((err, c) => {
  console.error(`Errore: ${err.message}`);
  return c.json({ 
    error: "Internal Server Error", 
    message: err.message 
  }, 500);
});

// Esporta l'app
export default app;
