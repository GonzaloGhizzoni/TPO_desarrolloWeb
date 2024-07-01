//token check function

function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Si no hay token, redirigir a la página de inicio de sesión
        alert('Por favor, inicia sesión para continuar.');
        window.location.href = '../login/login.html'; 
    } else {
        // Opcional: verificar la validez del token con el servidor
        fetch(`${apiUrl}/verify_token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                // Token inválido o expirado, redirigir a la página de inicio de sesión
                alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                localStorage.removeItem('token');
                window.location.href = '../login/login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Se produjo un error. Por favor, inicia sesión de nuevo.');
            localStorage.removeItem('token');
            window.location.href = '../login/login.html';
        });
    }
}