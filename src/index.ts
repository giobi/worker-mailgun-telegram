/**
 * Worker Mailgun Telegram
 * Riceve webhook da Mailgun, elabora le email e le invia a Telegram
 */

// Interfaccia per i dati in arrivo da Mailgun
interface MailgunEvent {
  signature?: {
    token: string;
    timestamp: string;
    signature: string;
  };
  'event-data'?: {
    event: string;
    message: {
      headers: {
        from: string;
        to: string;
        subject: string;
      };
      attachments: any[];
    };
    storage: {
      url: string;
    };
  };
}

export interface Env {
  // Variabili d'ambiente definite nel wrangler.toml
  BOT_TOKEN: string;
  CHAT_ID: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Gestisci solo richieste POST (webhook da Mailgun)
    if (request.method !== 'POST') {
      return new Response('Metodo non supportato', { status: 405 });
    }

    try {
      // Analizza i dati in arrivo da Mailgun
      const mailgunData: MailgunEvent = await request.json();
      
      // Verifica che i dati siano validi
      if (!mailgunData['event-data']) {
        return new Response('Dati evento mancanti', { status: 400 });
      }

      const eventData = mailgunData['event-data'];
      const headers = eventData.message.headers;
      
      // Prepara il messaggio per Telegram
      const from = headers.from || 'Mittente sconosciuto';
      const to = headers.to || 'Destinatario sconosciuto';
      const subject = headers.subject || 'Nessun oggetto';
      
      const messageText = `📧 *Nuova email ricevuta*\n\n` +
                        `*Da:* ${from}\n` +
                        `*A:* ${to}\n` +
                        `*Oggetto:* ${subject}\n\n` +
                        `*Evento:* ${eventData.event}`;
      
      // Se ci sono allegati, aggiungili al messaggio
      if (eventData.message.attachments && eventData.message.attachments.length > 0) {
        // Implementa la logica per gestire gli allegati
      }
      
      // Invia il messaggio a Telegram
      if (env.BOT_TOKEN && env.CHAT_ID) {
        await sendToTelegram(messageText, env.BOT_TOKEN, env.CHAT_ID);
      } else {
        console.error('BOT_TOKEN o CHAT_ID mancanti nelle variabili d\'ambiente');
      }
      
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Errore nell\'elaborazione della richiesta:', error);
      return new Response('Errore interno del server', { status: 500 });
    }
  },
};

/**
 * Invia un messaggio a un chat di Telegram
 */
async function sendToTelegram(message: string, botToken: string, chatId: string): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Errore nell'invio del messaggio a Telegram: ${error}`);
  }
}