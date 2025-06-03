const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

const sessionIds = ['9540215846'];
const clients = {};

(async () => {
  const executablePath = puppeteer.executablePath(); // ✅ Get full Puppeteer Chrome path

  sessionIds.forEach((id) => {
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: id }),
      puppeteer: {
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    client.on('ready', () => console.log(`✅ WhatsApp client ${id} is ready`));
    client.on('auth_failure', (msg) => console.error(`❌ Auth failure for ${id}:`, msg));
    client.on('disconnected', (reason) => console.warn(`⚠️ Client ${id} disconnected:`, reason));

    client.initialize();
    clients[id] = client;
  });
})();

module.exports = { clients, sessionIds };
