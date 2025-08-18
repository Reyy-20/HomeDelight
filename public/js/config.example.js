// Archivo de ejemplo de configuración
// Copiar este archivo como config.js y agregar tu token real

window.HUGGING_FACE_TOKEN = 'TU_TOKEN_AQUI';
// Other API configurations if any
window.API_CONFIG = {
    huggingFace: {
        token: window.HUGGING_FACE_TOKEN,
        baseUrl: 'https://api-inference.huggingface.co',
        model: 'microsoft/DialoGPT-medium'
    }
};
