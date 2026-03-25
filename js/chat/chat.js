// Chat UI — APA Viandas
// Conecta con el webhook de n8n y maneja la burbuja flotante

const WEBHOOK_URL = 'https://n8n-prod-lucas.duckdns.org/webhook/whatsapp-viandas';

const sessionId = 'web-' + Math.random().toString(36).slice(2, 10);

const chatHTML = `
  <div id="apa-chat-bubble" onclick="chatToggle()" title="Chateá con nosotros">
    <span class="material-symbols-outlined">chat</span>
    <span id="apa-chat-badge" class="hidden">1</span>
  </div>

  <div id="apa-chat-window" class="hidden">
    <div id="apa-chat-header">
      <div class="apa-chat-header-info">
        <div class="apa-chat-avatar">🍱</div>
        <div>
          <div class="apa-chat-name">APA Viandas</div>
          <div class="apa-chat-status">En línea</div>
        </div>
      </div>
      <button onclick="chatToggle()" class="apa-chat-close" title="Cerrar">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div id="apa-chat-messages">
      <div class="apa-msg apa-msg-bot">
        <span>¡Hola! 👋 Soy el asistente de APA Viandas. ¿En qué te puedo ayudar hoy?</span>
      </div>
    </div>

    <div id="apa-chat-input-area">
      <input
        id="apa-chat-input"
        type="text"
        placeholder="Escribí tu mensaje..."
        onkeydown="if(event.key==='Enter') chatSend()"
        maxlength="500"
      />
      <button onclick="chatSend()" id="apa-chat-send" title="Enviar">
        <span class="material-symbols-outlined">send</span>
      </button>
    </div>
  </div>
`;

// Inyectar HTML en el body
const chatContainer = document.createElement('div');
chatContainer.id = 'apa-chat-root';
chatContainer.innerHTML = chatHTML;
document.body.appendChild(chatContainer);

// Estado
let chatOpen = false;
let badgeVisible = false;

function chatToggle() {
  chatOpen = !chatOpen;
  const win = document.getElementById('apa-chat-window');
  win.classList.toggle('hidden', !chatOpen);
  if (chatOpen) hideBadge();
}

function showBadge() {
  if (chatOpen) return;
  const badge = document.getElementById('apa-chat-badge');
  badge.classList.remove('hidden');
  badgeVisible = true;
}

function hideBadge() {
  const badge = document.getElementById('apa-chat-badge');
  badge.classList.add('hidden');
  badgeVisible = false;
}

function appendMessage(text, role) {
  const messages = document.getElementById('apa-chat-messages');
  const div = document.createElement('div');
  div.className = `apa-msg apa-msg-${role}`;
  div.innerHTML = `<span>${escapeHtml(text)}</span>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function appendTyping() {
  const messages = document.getElementById('apa-chat-messages');
  const div = document.createElement('div');
  div.className = 'apa-msg apa-msg-bot apa-typing';
  div.id = 'apa-typing-indicator';
  div.innerHTML = `<span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('apa-typing-indicator');
  if (el) el.remove();
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function chatSend() {
  const input = document.getElementById('apa-chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage(text, 'user');
  appendTyping();

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId, source: 'web' })
    });

    removeTyping();

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    // Soporta respuesta como string, { text }, { message }, o { output }
    const reply =
      typeof data === 'string' ? data :
      data.text || data.message || data.output || data.reply ||
      'No entendí la respuesta del servidor.';

    appendMessage(reply, 'bot');
    if (!chatOpen) showBadge();

  } catch (err) {
    removeTyping();
    appendMessage('Hubo un problema al conectar. Intentá de nuevo en un momento.', 'bot');
    console.error('[APA Chat]', err);
  }
}
