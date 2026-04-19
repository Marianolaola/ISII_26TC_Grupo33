document.addEventListener('DOMContentLoaded', () => {
    
    // Capturamos el formulario del login por su ID (form-login)
    const formLogin = document.getElementById('form-login');

    // Si estamos en la página del login, activamos esta lógica
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            
            // 1. Evitamos que la página parpadee o se recargue al hacer clic
            e.preventDefault(); 

            // 2. Extraemos lo que escribió el usuario
            const emailUsuario = document.getElementById('email').value;
            const passUsuario = document.getElementById('password').value;

            try {
                // 3. Hacemos el pedido al Backend para validar las credenciales
                const respuesta = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Le avisamos que mandamos JSON
                    },
                    // Empaquetamos los datos
                    body: JSON.stringify({ email: emailUsuario, password: passUsuario }) 
                });

                // 4. Desempaquetamos lo que nos responde el servidor
                const datos = await respuesta.json();

                // 5. Tomamos decisiones según el resultado
                if (respuesta.ok) {
                    // Caso de éxito
                    alert('¡Ingreso exitoso!');

                    // Guardamos el usuario en el Local Storage para usarlo en otras páginas
                    localStorage.setItem('usuarioBancario', JSON.stringify(datos.usuario));

                    // Mostramos el mensaje de bienvenida que configuró Marian en el backend
                    alert(datos.mensaje);
                    
                    // Acá lo mandamos a la siguiente pantalla
                    window.location.href = '/dashboard.html'; 
                } else {
                    // Caso de error: mostramos el mensaje de error que configuró Marian en el backend
                    alert('Error: ' + (datos.mensaje || 'Credenciales inválidas')); 
                }

            } catch (error) {
                // Si el servidor está apagado o hay un problema de red
                console.error('Problema de conexión:', error);
                alert('No se pudo conectar con el servidor en este momento.');
            }
        });
    }
});