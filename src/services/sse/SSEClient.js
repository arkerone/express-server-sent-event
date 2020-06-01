class SSEClient {
  /**
   * @param {Object} context - La réponse HTTP
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Initialise la connexion avec le client
   * @function initialize
   */
  initialize() {
    const headers = {
      /* Permet d'indiquer au client qu'il s'agit d'une connexion SSE */
      'Content-Type': 'text/event-stream',
      /* Permet d'indiquer au client qu'il s'agit que la connexion est persistente */
      Connection: 'keep-alive',
      /* Permet d'empêcher la mise en cache des messages */
      'Cache-Control': 'no-cache'
    };

    /* On envoie les headers au client */
    this.context.writeHead(200, headers);
  }

  /**
   * Envoie un message au client
   * @function send
   * @params {Object} message - Le message à envoyer au client
   * @params {number|string} [message.id] - L'identifiant unique du message
   * @params {string} [message.type='message'] - Le type de message
   * @params {number} [message.retry] - Le délai en millisecondes avant une tentative de reconnexion au serveur
   * @params {string} message.data - Le contenu du message
   */
  send(message) {
    const { id, type = 'message', retry, data } = message;

    if (id) {
      this.context.write(`id: ${id}\n`);
    }
    if (type) {
      this.context.write(`event: ${type}\n`);
    }
    if (retry) {
      this.context.write(`retry: ${retry}\n`);
    }

    this.context.write(`data: ${typeof data === 'object' ? JSON.stringify(data) : data}\n\n`);
  }
}

module.exports = SSEClient;
