class HomeDelightChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.hfToken = this.getHuggingFaceToken();
        this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
        this.userContext = {
            budget: null,
            preferredLocation: null,
            minRooms: null,
            maxRooms: null,
            propertyType: null
        };
        
        // Base de datos de propiedades integrada
        this.properties = [
            {
                id: 1,
                name: "Casa El Roble",
                location: "Albrook",
                price: 395000,
                description: "Casa familiar con amplio jardín y árboles centenarios.",
                rooms: 3,
                bathrooms: 2,
                area: 306,
                year: 2018,
                likes: 27,
                type: "casa"
            },
            {
                id: 2,
                name: "Villa Serena",
                location: "Costa Sur",
                price: 520000,
                description: "Ambientes abiertos, piscina privada y zona de BBQ.",
                rooms: 4,
                bathrooms: 4,
                area: 350,
                year: 2019,
                likes: 21,
                type: "villa"
            },
            {
                id: 3,
                name: "Villa Sol y Mar",
                location: "Punta Barco",
                price: 420000,
                description: "Residencia frente al mar con piscina y terraza panorámica.",
                rooms: 4,
                bathrooms: 5,
                area: 380,
                year: 2020,
                likes: 34,
                type: "villa"
            },
            {
                id: 4,
                name: "Casa Moderna",
                location: "San Francisco",
                price: 280000,
                description: "Diseño contemporáneo con acabados de lujo y tecnología smart home.",
                rooms: 3,
                bathrooms: 3,
                area: 250,
                year: 2021,
                likes: 18,
                type: "casa"
            },
            {
                id: 5,
                name: "Mansión Costa del Este",
                location: "Costa del Este",
                price: 750000,
                description: "Lujosa mansión con vista al mar, piscina infinita y garaje para 4 autos.",
                rooms: 6,
                bathrooms: 7,
                area: 580,
                year: 2019,
                likes: 42,
                type: "mansión"
            },
            {
                id: 6,
                name: "Casa Familiar",
                location: "Tumba Muerto",
                price: 180000,
                description: "Casa ideal para familias, con jardín amplio y zona de juegos.",
                rooms: 3,
                bathrooms: 2,
                area: 200,
                year: 2017,
                likes: 15,
                type: "casa"
            },
            {
                id: 7,
                name: "Apartamento Luz",
                location: "Brisas del Golf",
                price: 560900,
                description: "Apartamento de lujo con acabados premium y vistas panorámicas.",
                rooms: 5,
                bathrooms: 4,
                area: 459,
                year: 2018,
                likes: 50,
                type: "apartamento"
            },
            {
                id: 8,
                name: "Apartamento Sur",
                location: "Costa Sur",
                price: 456980,
                description: "Apartamento con bonita vista al mar.",
                rooms: 4,
                bathrooms: 3,
                area: 320,
                year: 2021,
                likes: 68,
                type: "apartamento"
            },
            {
                id: 9,
                name: "Propiedad Avenida Balboa",
                location: "Avenida Balboa",
                price: 568990,
                description: "Propiedad moderna con excelente ubicación y acabados de calidad.",
                rooms: 3,
                bathrooms: 2,
                area: 340,
                year: 2019,
                likes: 30,
                type: "apartamento"
            },
            {
                id: 10,
                name: "Apartamento en Albrook",
                location: "Albrook",
                price: 795490,
                description: "Apartamento moderno con excelente vista y acabados de lujo.",
                rooms: 4,
                bathrooms: 5,
                area: 458,
                year: 2020,
                likes: 58,
                type: "apartamento"
            }
        ];
        
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
                💭
            </button>
            <div class="chatbot-window">
                <div class="chatbot-header">
                <img src="logost.png" alt="Home Delight Logo" class="chatbot-logo">
                    <h3> Home Delight Assistant</h3>
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
            content: 'Bienvenido a Home Delight. Soy tu asistente personal en la búsqueda de propiedades únicas en Panamá. ¿Tienes una zona, precio o tipo de propiedad en mente? Si no, simplemente dime: “muéstrame opciones” y te presento lo mejor.',
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
        return 'Gracias por tu mensaje. Te puedo ayudar con información sobre nuestras propiedades. ¿Qué tipo de propiedad te interesa?';
    }

    getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Extraer información del contexto del usuario
        this.updateUserContext(lowerMessage);
        
        // Respuestas para saludos
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
            return '¡Hola! 😊 Bienvenido a Home Delight. Soy tu asistente especializado en bienes raíces. ¿Te gustaría ver nuestras propiedades disponibles o tienes alguna preferencia específica?';
        }

        // Mostrar opciones generales
        if (lowerMessage.includes('opciones') || lowerMessage.includes('propiedades') || lowerMessage.includes('disponible')) {
            return this.getPropertyOverview();
        }

        // Búsqueda por ubicación específica
        const locations = ['albrook', 'costa sur', 'punta barco', 'san francisco', 'costa del este', 'tumba muerto', 'brisas del golf', 'avenida balboa'];
        for (const location of locations) {
            if (lowerMessage.includes(location)) {
                return this.searchByLocation(location);
            }
        }

        // Búsqueda por tipo de propiedad
        if (lowerMessage.includes('casa') && !lowerMessage.includes('apartamento')) {
            return this.searchByType('casa');
        }
        if (lowerMessage.includes('apartamento')) {
            return this.searchByType('apartamento');
        }
        if (lowerMessage.includes('villa')) {
            return this.searchByType('villa');
        }
        if (lowerMessage.includes('mansión')) {
            return this.searchByType('mansión');
        }

        // Búsqueda por precio
        if (lowerMessage.includes('precio') || lowerMessage.includes('presupuesto') || lowerMessage.includes('costo')) {
            return this.getPriceRangeInfo();
        }

        // Búsqueda por habitaciones
        const roomNumbers = ['1', '2', '3', '4', '5', '6'];
        for (const num of roomNumbers) {
            if (lowerMessage.includes(`${num} habitacion`) || lowerMessage.includes(`${num} cuarto`)) {
                return this.searchByRooms(parseInt(num));
            }
        }

        // Comparaciones
        if (lowerMessage.includes('compar') || lowerMessage.includes('diferencia')) {
            return this.getComparisonSuggestion();
        }

        // Financiamiento
        if (lowerMessage.includes('financiamiento') || lowerMessage.includes('financiar') || lowerMessage.includes('crédito')) {
            return 'Ofrecemos varias opciones de financiamiento flexibles. Trabajamos con los principales bancos del país. ¿Te gustaría que calculemos una cuota aproximada? Solo necesito saber qué propiedad te interesa y tu capacidad de pago inicial.';
        }

        // Información de contacto
        if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('whatsapp')) {
            return 'Puedes contactarnos de varias formas:\n📞 Teléfono: +507 6000-0000\n📱 WhatsApp: +507 6000-0000\n📧 Email: info@homedelight.com\n🏢 Oficina: Torre de las Américas, Punta Pacífica\n🕒 Horario: Lun-Vie 9AM-6PM, Sáb 9AM-2PM';
        }

        // Despedidas
        if (lowerMessage.includes('gracias')) {
            return '¡De nada! 😊 Ha sido un placer ayudarte. Si tienes más preguntas sobre nuestras propiedades o quieres agendar una visita, estaré aquí para asistirte.';
        }

        if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('bye')) {
            return '¡Hasta luego! 👋 Espero haberte ayudado. No dudes en volver cuando quieras conocer más sobre nuestras propiedades. ¡Que tengas un excelente día!';
        }

        return null; // No hay respuesta local
    }

    updateUserContext(message) {
        // Extraer presupuesto
        const budgetMatch = message.match(/(\d+[,.]?\d*)\s*(mil|k|m)?/g);
        if (budgetMatch) {
            // Lógica simple para extraer presupuesto
            // Esto se puede mejorar con más lógica
        }

        // Extraer ubicaciones preferidas
        const locations = ['albrook', 'costa sur', 'punta barco', 'san francisco', 'costa del este'];
        for (const location of locations) {
            if (message.includes(location)) {
                this.userContext.preferredLocation = location;
                break;
            }
        }
    }

    getPropertyOverview() {
        const totalProperties = this.properties.length;
        const priceRange = {
            min: Math.min(...this.properties.map(p => p.price)),
            max: Math.max(...this.properties.map(p => p.price))
        };
        
        return `🏠 Tenemos ${totalProperties} propiedades increíbles disponibles:\n\n` +
               `💰 Rango de precios: B/. ${this.formatPrice(priceRange.min)} - B/. ${this.formatPrice(priceRange.max)}\n` +
               `📍 Ubicaciones: Albrook, Costa Sur, Punta Barco, San Francisco, Costa del Este, y más\n` +
               `🏡 Tipos: Casas, apartamentos, villas y mansiones\n\n` +
               `¿Te gustaría que te muestre opciones por ubicación, precio o tipo de propiedad?`;
    }

    searchByLocation(location) {
        const locationProperties = this.properties.filter(p => 
            p.location.toLowerCase().includes(location.toLowerCase())
        );

        if (locationProperties.length === 0) {
            return `No tengo propiedades disponibles en ${location} en este momento. ¿Te gustaría ver opciones en otras ubicaciones cercanas?`;
        }

        let response = `🏠 Propiedades en ${this.capitalizeWords(location)}:\n\n`;
        
        locationProperties.forEach(property => {
            response += `📌 **${property.name}**\n`;
            response += `💰 B/. ${this.formatPrice(property.price)}\n`;
            response += `🛏️ ${property.rooms} hab. | 🚿 ${property.bathrooms} baños | 📐 ${property.area}m²\n`;
            response += `📝 ${property.description}\n\n`;
        });

        response += `¿Te gustaría más detalles sobre alguna de estas propiedades?`;
        return response;
    }

    searchByType(type) {
        const typeProperties = this.properties.filter(p => p.type.toLowerCase() === type.toLowerCase());
        
        if (typeProperties.length === 0) {
            return `No tengo ${type}s disponibles en este momento. ¿Te gustaría ver otros tipos de propiedades?`;
        }

        let response = `🏡 ${this.capitalizeWords(type)}s disponibles:\n\n`;
        
        typeProperties.slice(0, 3).forEach(property => {
            response += `📌 **${property.name}** - ${property.location}\n`;
            response += `💰 B/. ${this.formatPrice(property.price)} | 🛏️ ${property.rooms} hab. | 📐 ${property.area}m²\n\n`;
        });

        if (typeProperties.length > 3) {
            response += `Y ${typeProperties.length - 3} ${type}s más disponibles.\n\n`;
        }

        response += `¿Quieres ver detalles específicos de alguna propiedad?`;
        return response;
    }

    searchByRooms(rooms) {
        const roomProperties = this.properties.filter(p => p.rooms === rooms);
        
        if (roomProperties.length === 0) {
            return `No tengo propiedades con exactamente ${rooms} habitaciones. ¿Te gustaría ver opciones con ${rooms-1} o ${rooms+1} habitaciones?`;
        }

        let response = `🛏️ Propiedades con ${rooms} habitaciones:\n\n`;
        
        roomProperties.slice(0, 3).forEach(property => {
            response += `📌 **${property.name}** - ${property.location}\n`;
            response += `💰 B/. ${this.formatPrice(property.price)} | 🚿 ${property.bathrooms} baños | 📐 ${property.area}m²\n\n`;
        });

        return response;
    }

    getPriceRangeInfo() {
        const sortedByPrice = [...this.properties].sort((a, b) => a.price - b.price);
        
        let response = `💰 Nuestras opciones por rango de precio:\n\n`;
        response += `🟢 **Económicas** (B/. 180K - 300K):\n`;
        
        const economical = sortedByPrice.filter(p => p.price <= 300000);
        economical.slice(0, 2).forEach(property => {
            response += `• ${property.name} - ${property.location} (B/. ${this.formatPrice(property.price)})\n`;
        });
        
        response += `\n🟡 **Premium** (B/. 300K - 600K):\n`;
        const premium = sortedByPrice.filter(p => p.price > 300000 && p.price <= 600000);
        premium.slice(0, 2).forEach(property => {
            response += `• ${property.name} - ${property.location} (B/. ${this.formatPrice(property.price)})\n`;
        });
        
        response += `\n🔴 **Lujo** (B/. 600K+):\n`;
        const luxury = sortedByPrice.filter(p => p.price > 600000);
        luxury.forEach(property => {
            response += `• ${property.name} - ${property.location} (B/. ${this.formatPrice(property.price)})\n`;
        });
        
        response += `\n¿Qué rango se ajusta mejor a tu presupuesto?`;
        return response;
    }

    getComparisonSuggestion() {
        const popular = this.properties.filter(p => p.likes > 30);
        let response = `🔍 Para ayudarte a comparar, aquí tienes nuestras propiedades más populares:\n\n`;
        
        popular.slice(0, 3).forEach(property => {
            response += `⭐ **${property.name}** - ${property.location}\n`;
            response += `💰 B/. ${this.formatPrice(property.price)} | 🛏️ ${property.rooms} hab. | 👍 ${property.likes} interesados\n\n`;
        });
        
        response += `¿Te gustaría que compare características específicas entre estas propiedades?`;
        return response;
    }

    formatPrice(price) {
        return price.toLocaleString('en-US');
    }

    capitalizeWords(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
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
        
        return cleaned || 'Gracias por tu mensaje. ¿Hay algo específico sobre nuestras propiedades en lo que pueda ayudarte?';
    }

    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        
        const timeString = message.timestamp.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message.content).replace(/\n/g, '<br>')}</div>
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
