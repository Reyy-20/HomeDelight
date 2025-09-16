// Tu archivo de JavaScript (ej. script.js)
const firebaseConfig = {
    apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
    authDomain: "expo-project-senior-6bfea.firebaseapp.com",
    databaseURL: "https://expo-project-senior-6bfea-default-rtdb.firebaseio.com",
    projectId: "expo-project-senior-6bfea",
    storageBucket: "expo-project-senior-6bfea.firebasestorage.app",
    messagingSenderId: "188431803500",
    appId: "1:188431803500:web:c6f64089f19ac1b64ca449",
    measurementId: "G-5Q8NB4WFK6"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // LÍNEA FALTANTE IMPORTANTE

// Funcionalidad mejorada para navegación por secciones
document.addEventListener('DOMContentLoaded', function () {
    const mainTabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.auth-section');
    const sectionTabs = document.querySelectorAll('.section-tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    // Navegación principal (Cliente/Negocio)
    mainTabs.forEach(button => {
        button.addEventListener('click', function () {
            const targetSection = this.dataset.form;

            // Remover clase active de tabs principales y secciones
            mainTabs.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Activar tab y sección seleccionada
            this.classList.add('active');
            const targetSectionElement = document.getElementById(targetSection + '-section');
            if (targetSectionElement) {
                targetSectionElement.classList.add('active');
            }
        });
    });

    // Navegación secundaria (Login/Register dentro de cada sección)
    sectionTabs.forEach(button => {
        button.addEventListener('click', function () {
            const targetForm = this.dataset.subform;
            const parentSection = this.closest('.auth-section');

            // Remover clase active de tabs secundarios y formularios en esta sección
            parentSection.querySelectorAll('.section-tab-btn').forEach(btn => btn.classList.remove('active'));
            parentSection.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

            // Activar tab y formulario seleccionado
            this.classList.add('active');
            const targetFormElement = document.getElementById(targetForm + '-form');
            if (targetFormElement) {
                targetFormElement.classList.add('active');
            }
        });
    });

    // Configurar formularios con Firebase
    setupFirebaseForms();
    
    // Configurar botón de logout - CORREGIDO
    setupLogoutButton();
});

// NUEVA FUNCIÓN para configurar el botón de logout
function setupLogoutButton() {
    // Buscar el botón de logout con diferentes posibles selectores
    const logoutBtn = document.querySelector('.logout-btn') || 
                      document.querySelector('#logout-btn') || 
                      document.querySelector('[data-action="logout"]') ||
                      document.querySelector('button[onclick*="logout"]');

    if (logoutBtn) {
        console.log('Botón de logout encontrado:', logoutBtn); // Debug
        
        // Remover cualquier evento onclick existente
        logoutBtn.removeAttribute('onclick');
        
        // Agregar el nuevo event listener
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón de logout clickeado'); // Debug
            handleLogout();
        });
    } else {
        console.warn('Botón de logout no encontrado. Verifica que tenga la clase "logout-btn" o el id "logout-btn"');
    }
}

// Configuración de formularios Firebase
function setupFirebaseForms() {
    // Cliente Login
    const clientLoginForm = document.getElementById('client-login-form');
    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleClientLogin();
        });
    }

    // Cliente Register
    const clientRegisterForm = document.getElementById('client-register-form');
    if (clientRegisterForm) {
        clientRegisterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleClientRegister();
        });
    }

    // Negocio Login
    const businessLoginForm = document.getElementById('business-login-form');
    if (businessLoginForm) {
        businessLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleBusinessLogin();
        });
    }

    // Negocio Register
    const businessRegisterForm = document.getElementById('business-register-form');
    if (businessRegisterForm) {
        businessRegisterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleBusinessRegister();
        });
    }

    // Agregar event listeners para mejorar la experiencia del usuario
    setupFormEnhancements();
}

// Configurar mejoras en los formularios
function setupFormEnhancements() {
    // Obtener todos los campos de input
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"]');

    inputs.forEach(input => {
        // Asegurar que el campo sea editable
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');

        // Evento focus para resaltar el campo
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
            this.style.cursor = 'text';
        });

        // Evento blur para quitar el resaltado
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });

        // Evento input para validación en tiempo real
        input.addEventListener('input', function () {
            validateField(this);
        });

        // Evento keypress para permitir solo números en campos de teléfono
        if (input.type === 'tel') {
            input.addEventListener('keypress', function (e) {
                const char = String.fromCharCode(e.which);
                if (!/[0-9+\-\(\)\s]/.test(char)) {
                    e.preventDefault();
                }
            });
        }

        // Asegurar que el campo sea clickeable
        input.addEventListener('click', function () {
            this.focus();
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas por tipo de campo
    switch (fieldType) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
            break;

        case 'password':
            if (value && value.length < 6) {
                isValid = false;
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            }
            break;

        case 'tel':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'El teléfono debe tener al menos 10 dígitos';
            }
            break;

        case 'text':
            if (fieldName.includes('name') && value && value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
    }

    // Mostrar/ocultar mensaje de error
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }

    if (!isValid && value) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        field.parentElement.appendChild(errorDiv);
    }

    // Actualizar clases CSS del campo
    field.classList.toggle('valid', isValid && value);
    field.classList.toggle('invalid', !isValid && value);
}

// Función para mostrar/ocultar loading
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');

    if (isLoading) {
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'block';
        button.disabled = true;
    } else {
        if (btnText) btnText.style.display = 'inline';
        if (spinner) spinner.style.display = 'none';
        button.disabled = false;
    }
}

// Función para mostrar mensajes
function showMessage(formId, message, isError = false) {
    const errorElement = document.getElementById(formId + '-error');
    const successElement = document.getElementById(formId + '-success');

    if (isError) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        if (successElement) {
            successElement.style.display = 'none';
        }
    } else {
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
}

// Cliente Login
async function handleClientLogin() {
    const emailInput = document.getElementById('client-login-email');
    const passwordInput = document.getElementById('client-login-password');
    
    if (!emailInput || !passwordInput) {
        console.error('Campos de login no encontrados');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log('Intentando login con:', { email }); // Debug

    setLoading('client-login-submit', true);

    try {
        console.log('Iniciando autenticación...'); // Debug

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log('Usuario autenticado:', user.uid); // Debug

        // Verificar que sea un cliente
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().userType === 'client') {
            const userData = userDoc.data();
            console.log('Datos del usuario:', userData); // Debug

            // Guardar información en localStorage
            localStorage.setItem('userType', 'client');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('isAuthenticated', 'true');

            showMessage('client-login', '¡Inicio de sesión exitoso! Redirigiendo...', false);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = 'gptdashboard.html';
            }, 2000);
        } else {
            throw new Error('Esta cuenta no está registrada como cliente');
        }

    } catch (error) {
        console.error('Error completo en login:', error); // Debug completo
        let errorMessage = 'Error al iniciar sesión';

        if (error.message === 'Esta cuenta no está registrada como cliente') {
            errorMessage = 'Esta cuenta no está registrada como cliente';
        } else {
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }
        }

        showMessage('client-login', errorMessage, true);
    } finally {
        setLoading('client-login-submit', false);
    }
}

// Cliente Register
async function handleClientRegister() {
    const nameInput = document.getElementById('client-reg-name');
    const emailInput = document.getElementById('client-reg-email');
    const passwordInput = document.getElementById('client-reg-password');
    const phoneInput = document.getElementById('client-reg-phone');

    if (!nameInput || !emailInput || !passwordInput || !phoneInput) {
        showMessage('client-register', 'Error: Campos del formulario no encontrados', true);
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const phone = phoneInput.value.trim();

    console.log('Datos del formulario:', { name, email, phone }); // Debug

    // Validar campos
    if (!name || !email || !password || !phone) {
        showMessage('client-register', 'Por favor completa todos los campos', true);
        return;
    }

    if (password.length < 6) {
        showMessage('client-register', 'La contraseña debe tener al menos 6 caracteres', true);
        return;
    }

    setLoading('client-register-submit', true);

    try {
        console.log('Iniciando creación de usuario en Firebase Auth...'); // Debug

        // Crear usuario en Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log('Usuario creado en Auth:', user.uid); // Debug

        // Guardar información adicional en Firestore
        const userData = {
            name: name,
            email: email,
            phone: phone,
            userType: 'client',
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log('Guardando en Firestore:', userData); // Debug

        await db.collection('users').doc(user.uid).set(userData);

        console.log('Usuario guardado exitosamente en Firestore'); // Debug

        // Guardar información en localStorage
        localStorage.setItem('userType', 'client');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('isAuthenticated', 'true');

        showMessage('client-register', '¡Registro exitoso! Redirigiendo...', false);

        // Limpiar formulario
        document.getElementById('client-register-form').reset();

        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = 'gptdashboard.html';
        }, 3000);

    } catch (error) {
        console.error('Error completo en registro:', error); // Debug completo
        let errorMessage = 'Error al crear la cuenta';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Ya existe una cuenta con este email';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'El registro de usuarios está deshabilitado';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }

        showMessage('client-register', errorMessage, true);
    } finally {
        setLoading('client-register-submit', false);
    }
}

// Negocio Login
async function handleBusinessLogin() {
    const emailInput = document.getElementById('business-login-email');
    const passwordInput = document.getElementById('business-login-password');
    
    if (!emailInput || !passwordInput) {
        showMessage('business-login', 'Error: Campos del formulario no encontrados', true);
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    setLoading('business-login-submit', true);

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Verificar que sea un usuario de negocio
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().userType === 'business') {
            if (userDoc.data().status === 'pending') {
                throw new Error('Tu cuenta está pendiente de aprobación');
            }

            // Guardar información del usuario en localStorage
            localStorage.setItem('userType', 'business');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('isAuthenticated', 'true');

            showMessage('business-login', '¡Inicio de sesión exitoso! Redirigiendo...', false);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = 'gptdashboard.html';
            }, 2000);
        } else {
            throw new Error('Esta cuenta no está registrada como negocio');
        }

    } catch (error) {
        console.error('Error en login de negocio:', error);
        let errorMessage = 'Error al iniciar sesión';

        if (error.message === 'Esta cuenta no está registrada como negocio') {
            errorMessage = 'Esta cuenta no está registrada como negocio';
        } else if (error.message === 'Tu cuenta está pendiente de aprobación') {
            errorMessage = 'Tu cuenta está pendiente de aprobación por el administrador';
        } else {
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }
        }

        showMessage('business-login', errorMessage, true);
    } finally {
        setLoading('business-login-submit', false);
    }
}

// Negocio Register
async function handleBusinessRegister() {
    const bizNameInput = document.getElementById('business-reg-name');
    const emailInput = document.getElementById('business-reg-email');
    const passwordInput = document.getElementById('business-reg-password');
    const phoneInput = document.getElementById('business-reg-phone');
    const addressInput = document.getElementById('business-reg-address');
    const licenseInput = document.getElementById('business-reg-license');

    if (!bizNameInput || !emailInput || !passwordInput || !phoneInput || !addressInput || !licenseInput) {
        showMessage('business-register', 'Error: Campos del formulario no encontrados', true);
        return;
    }

    const bizName = bizNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const license = licenseInput.value.trim();

    // Validar campos
    if (!bizName || !email || !password || !phone || !address || !license) {
        showMessage('business-register', 'Por favor completa todos los campos', true);
        return;
    }

    if (password.length < 6) {
        showMessage('business-register', 'La contraseña debe tener al menos 6 caracteres', true);
        return;
    }

    setLoading('business-register-submit', true);

    try {
        // Crear usuario en Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        await db.collection('users').doc(user.uid).set({
            businessName: bizName,
            email: email,
            phone: phone,
            address: address,
            license: license,
            userType: 'business',
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage('business-register', '¡Registro exitoso! Tu negocio ha sido registrado. Pendiente de aprobación por el administrador.', false);

        // Limpiar formulario
        document.getElementById('business-register-form').reset();

    } catch (error) {
        console.error('Error en registro de negocio:', error);
        let errorMessage = 'Error al crear la cuenta';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Ya existe una cuenta con este email';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'El registro de usuarios está deshabilitado';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }

        showMessage('business-register', errorMessage, true);
    } finally {
        setLoading('business-register-submit', false);
    }
}

// Verificar estado de autenticación al cargar la página
auth.onAuthStateChanged(function (user) {
    if (user && window.location.pathname.includes('login')) {
        // Usuario ya está logueado, redirigir
        window.location.href = 'gptdashboard.html';
    }
});

// Configurar botón de regreso
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
    backBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}

// FUNCIÓN DE LOGOUT CORREGIDA
async function handleLogout() {
    console.log('Iniciando proceso de logout...'); // Debug

    // Mostrar indicador de carga si existe
    const logoutBtn = document.querySelector('.logout-btn') || 
                      document.querySelector('#logout-btn') || 
                      document.querySelector('[data-action="logout"]');
    
    if (logoutBtn) {
        logoutBtn.disabled = true;
        const originalText = logoutBtn.textContent;
        logoutBtn.textContent = 'Cerrando sesión...';
        
        // Restaurar texto después del proceso
        setTimeout(() => {
            logoutBtn.textContent = originalText;
            logoutBtn.disabled = false;
        }, 3000);
    }

    try {
        console.log('Cerrando sesión en Firebase...'); // Debug
        
        // Cerrar sesión en Firebase
        await auth.signOut();
        
        console.log('Sesión cerrada exitosamente'); // Debug

        // Limpiar cualquier dato local
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Datos locales limpiados'); // Debug

        // Mostrar mensaje de confirmación
        alert('Sesión cerrada exitosamente');

        // Redirigir a la página de login o inicio
        window.location.href = 'index.html'; // o 'login.html' según tu estructura

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
    }
}

// Función alternativa para logout que puede ser llamada desde HTML
window.logout = handleLogout;

// Verificar si el usuario está autenticado cuando se carga cualquier página protegida
function checkAuthStatus() {
    const protectedPages = ['gptdashboard.html', 'dashboard.html', 'profile.html']; // Agrega las páginas que requieren autenticación
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const user = firebase.auth().currentUser;
        
        if (!isAuthenticated && !user) {
            console.log('Usuario no autenticado, redirigiendo a login...');
            window.location.href = 'index.html';
        }
    }
}
