//-----------------------------------------------------------------------------
import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

// const apiUrl = "http://127.0.0.1:5000"
const apiUrl = "https://nahuelgr.pythonanywhere.com"

// Use case
var actualView = '../login/login.html'; // Replace with the path of the actual view. ACTUAL VIEW MUST MATCH WITH HEADER.HTML HREF PATH

loadHeader(actualView);
loadFooter();
//------------------------------------------------------------------------------
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
    clearFormFields();
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
    clearFormFields();
});

//------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const inputs = document.querySelectorAll('input');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto
        if (validateForm(loginForm)) {
            let email = document.getElementById('fEmail').value;
            let password = document.getElementById('fPassword').value;
            login(email, password);
        }
    });

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto
        if (validateForm(registerForm)) {
            let email = document.getElementById('FregisterEmail').value;
            let password = document.getElementById('FregisterPassword').value;
            let name = document.getElementById('fName').value;
            let surname = document.getElementById('fSurname').value;
            let birthdate = document.getElementById('fbirthdate').value;
            register(email, name, surname, birthdate, password);
        }
    });

    function validateForm(form) {
        let formIsValid = true;
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (!validateField(form, input)) {
                formIsValid = false;
            }
        });

        return formIsValid;
    }
    
    function validateField(form, field) {
        const fieldType = field.getAttribute('type');
        const fieldValue = field.value.trim();
        let valid = true;

        if (fieldValue.length === 0) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'Debe completar este campo.';
            valid = false;
        } else {
            switch (fieldType) {
                case 'email':
                    if (!validateEmail(fieldValue)) {
                        field.classList.add('is-invalid');
                        field.nextElementSibling.textContent = 'Correo electrónico no válido.';
                        valid = false;
                    }
                    break;
                case 'password':
                    if (fieldValue.length < 6) {
                        field.classList.add('is-invalid');
                        field.nextElementSibling.textContent = 'La contraseña debe tener al menos 6 caracteres';
                        valid = false;
                    }
                    break;
            }
        }

        if (valid) {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
        }

        return valid;
    }

    function validateEmail(email) {
        const re =  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return re.test(String(email).toLowerCase());
    }

});

function clearFormFields() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Clear login form fields and errors
    loginForm.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.classList.remove('is-invalid');
        if (input.nextElementSibling) {
            input.nextElementSibling.textContent = '';
        }
    });

    // Clear register form fields and errors
    registerForm.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.classList.remove('is-invalid');
        if (input.nextElementSibling) {
            input.nextElementSibling.textContent = '';
        }
    });
    // Clear messages
    document.getElementById('loginSuccessMessage').textContent = "";
    document.getElementById('loginFailed').textContent = "";
    document.getElementById('registerSuccessMessage').textContent = "";
}
//--------------------------------------------------------------------------
function login(email, password) {
    // Clear previous messages
    document.getElementById('loginSuccessMessage').textContent = "";
    document.getElementById('loginFailed').textContent = "";
    
    fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        // console.log(response);
        if (!response.ok) {
            return response.json().then(data => {
                document.getElementById('loginFailed').textContent = "Correo electrónico o contraseña incorrectos";
                throw new Error(data.message || "Correo electrónico o contraseña incorrectos");
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('loginSuccessMessage').textContent = "Inicio de sesión exitoso!";
        clearFormFields();
    })
    .catch(error => {
        document.getElementById('loginSuccessMessage').textContent = "";
        alert(error.message);
        console.error('Error:', error);
    });
}

function register(email,name,surname,birthdate,password){
    fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, name: name, surname: surname, birthdate: birthdate, password: password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || "Registration Failed");
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('registerSuccessMessage').textContent = "Registro exitoso!";
        clearFormFields();
    })
    .catch(error => {
        document.getElementById('registerSuccessMessage').textContent = "";
        alert(error.message);
        console.error('Error:', error);
    });
}
//------------------------------------------------------------------