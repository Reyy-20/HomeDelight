class HomeDelightChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.hfToken = this.getHuggingFaceToken();
        this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
        this.init();
    }

    getHuggingFaceToken() {
        return window.HUGGING_FACE_TOKEN ||
               localStorage.getItem('hf_token') ||
               'YOUR_TOKEN_HERE';
    }

    init() {
        this.createChatbotUI();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotUI() {
        // Crear contenedor principal
        this.container = document.createElement('div');
        this.container.className = 'chatbot-container';
        this.container.innerHTML = `
            <button class="chatbot-toggle" title="Chat con Home Delight">
                💬
            </button>
            <div class="chatbot-window">
                <div class="chatbot-header">
                    <h3>🏠 Home Delight Assistant</h3>
                    <button class="chatbot-close" title="Cerrar chat">×</button>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Escribe tu mensaje..." maxlength="500">
                    <button type="button">Enviar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Referencias a elementos
        this.toggle = this.container.querySelector('.chatbot-toggle');
        this.window = this.container.querySelector('.chatbot-window');
        this.closeBtn = this.container.querySelector('.chatbot-close');
        this.messagesContainer = this.container.querySelector('.chatbot-messages');
        this.input = this.container.querySelector('.chatbot-input input');
        this.sendBtn = this.container.querySelector('.chatbot-input button');
    }

    bindEvents() {
        // Toggle del chatbot
        this.toggle.addEventListener('click', () => this.toggleChat());
        
        // Cerrar chatbot
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Enviar mensaje con Enter
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Enviar mensaje con botón
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.window.classList.add('open');
        this.input.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.isOpen = false;
        this.window.classList.remove('open');
        this.input.blur();
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: '¡Hola! Soy tu asistente de Home Delight. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre propiedades, servicios inmobiliarios, o cualquier consulta relacionada con tu hogar.',
            timestamp: new Date()
        };
        
        this.addMessage(welcomeMessage);
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        
        this.addMessage(userMessage);
        this.input.value = '';
        this.sendBtn.disabled = true;

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        try {
            // Intentar obtener respuesta de Hugging Face
            const response = await this.getHuggingFaceResponse(message);
            
            // Ocultar indicador de escritura
            this.hideTypingIndicator();
            
            // Agregar respuesta del bot
            const botMessage = {
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            
            this.addMessage(botMessage);
            
        } catch (error) {
            console.error('Error al obtener respuesta:', error);
            
            // Ocultar indicador de escritura
            this.hideTypingIndicator();
            
            // Respuesta de fallback
            const fallbackMessage = {
                type: 'bot',
                content: 'Lo siento, estoy teniendo problemas para procesar tu mensaje. ¿Podrías reformular tu pregunta o intentar más tarde?',
                timestamp: new Date()
            };
            
            this.addMessage(fallbackMessage);
        }

        this.sendBtn.disabled = false;
        this.scrollToBottom();
    }

    async getHuggingFaceResponse(message) {
        // Primero verificar base de conocimiento local
        const localResponse = this.getLocalResponse(message);
        if (localResponse) {
            return localResponse;
        }

        // Si no hay respuesta local, usar Hugging Face
        if (this.hfToken && this.hfToken !== 'YOUR_TOKEN_HERE') {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.hfToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: message,
                        parameters: {
                            max_length: 150,
                            temperature: 0.7,
                            do_sample: true
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data && data[0] && data[0].generated_text) {
                    return this.cleanResponse(data[0].generated_text);
                } else {
                    throw new Error('Respuesta inválida de la API');
                }
                
            } catch (error) {
                console.error('Error en API de Hugging Face:', error);
                throw error;
            }
        }

        // Respuesta por defecto si no hay token
        return 'Gracias por tu mensaje. Para obtener respuestas más específicas, asegúrate de que el token de Hugging Face esté configurado correctamente.';
    }

    getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Base de conocimiento local para Home Delight
        const knowledgeBase = {
            'propiedad': 'En Home Delight tenemos una amplia variedad de propiedades disponibles. ¿Te gustaría que te ayude a encontrar algo específico?',
            'casa': '¡Excelente! Tenemos casas en diferentes ubicaciones y precios. ¿En qué zona estás interesado?',
            'apartamento': 'Tenemos apartamentos modernos y funcionales. ¿Prefieres algo en el centro o en las afueras?',
            'precio': 'Nuestros precios varían según la ubicación y características de la propiedad. ¿Tienes un presupuesto específico en mente?',
            'zona': 'Trabajamos en diferentes zonas de la ciudad. ¿Hay alguna área en particular que te interese?',
            'financiamiento': 'Ofrecemos opciones de financiamiento flexibles. ¿Te gustaría que te explique nuestras opciones?',
            'contacto': 'Puedes contactarnos a través de nuestro sitio web, por teléfono o visitando nuestras oficinas. ¿Cuál prefieres?',
            'horario': 'Nuestras oficinas están abiertas de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM.',
            'servicios': 'Ofrecemos servicios completos de bienes raíces: compra, venta, alquiler y asesoría inmobiliaria.',
            'ayuda': 'Estoy aquí para ayudarte con cualquier consulta sobre propiedades o servicios inmobiliarios. ¿En qué puedo asistirte?'
        };

        // Buscar coincidencias en la base de conocimiento
        for (const [keyword, response] of Object.entries(knowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        // Respuestas para preguntas comunes
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
            return '¡Hola! Es un placer saludarte. ¿En qué puedo ayudarte hoy con tus consultas inmobiliarias?';
        }

        if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks')) {
            return '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?';
        }

        if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('bye')) {
            return '¡Hasta luego! Ha sido un placer ayudarte. No dudes en volver si tienes más preguntas.';
        }

        return null; // No hay respuesta local
    }

    cleanResponse(response) {
        // Limpiar y formatear la respuesta de la API
        let cleaned = response.trim();
        
        // Remover el mensaje original si está incluido
        if (cleaned.includes('Human:') || cleaned.includes('Assistant:')) {
            const parts = cleaned.split('Assistant:');
            if (parts.length > 1) {
                cleaned = parts[parts.length - 1].trim();
            }
        }
        
        // Limitar longitud
        if (cleaned.length > 200) {
            cleaned = cleaned.substring(0, 200) + '...';
        }
        
        return cleaned || 'Gracias por tu mensaje. ¿Hay algo específico en lo que pueda ayudarte?';
    }

    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        
        const timeString = message.timestamp.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message.content)}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.conversationHistory.push(message);
        
        // Limpiar historial si es muy largo
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-25);
        }
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar chatbot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HomeDelightChatbot();
});
