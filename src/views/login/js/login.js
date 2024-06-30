import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

// const apiUrl = "http://127.0.0.1:5000"
const apiUrl = "https://nahuelgr.pythonanywhere.com"

// Use case
var actualView = '../login/login.html'; // Replace with the path of the actual view. ACTUAL VIEW MUST MATCH WITH HEADEAR.HTML HREF PATH

loadHeader(actualView);
loadFooter();


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

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const inputs = document.querySelectorAll('input');


    loginForm.addEventListener('submit', function(event) {
        let formIsValid = true;
        
        inputs.forEach(input => {
            if (!validateField(loginForm,input)) {
                formIsValid = false;
            }
        });

        if (!formIsValid)
            event.preventDefault(); 

        let email = document.getElementById('fEmail').value;
        let password = document.getElementById('fPassword').value;
        
        // Call login function
        login(email, password);
        clearFormFields();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const inputs = document.querySelectorAll('input');

    registerForm.addEventListener('submit', function(event) {
        let formIsValid = true;

        inputs.forEach(input => {
            if (!validateField(registerForm,input)) {
                formIsValid = false;
            }
        });


        if (!formIsValid)
            event.preventDefault(); 
        else{
            let email = document.getElementById('FregisterEmail').value;
            let password = document.getElementById('FregisterPassword').value;
            let name = document.getElementById('fName').value;
            let surname = document.getElementById('fSurname').value;
            let birthdate = document.getElementById('fbirthdate').value;
            
            // Call login function
            register(email,name,surname,birthdate,password);
            clearFormFields();
        }
    });
});


function login(email, password) {
    fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            alert("Invalid email or password")
            return response.json()
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
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
            return response.json()
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

function clearFormFields() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Clear login form fields
    loginForm.querySelectorAll('input[type="email"], input[type="password"]').forEach(input => {
        input.value = '';
    });

    // Clear register form fields
    registerForm.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], input[type="date"]').forEach(input => {
        input.value = '';
    });
}

function validateField(form,field) {
    const fieldType = field.getAttribute('type');
    const fieldValue = field.value.trim();

    if (fieldType === 'text' || fieldType === 'email' || fieldType === 'date' || fieldType === 'password') {
        if (fieldValue.length === 0) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'Debe completar este campo.';
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
            return true;
        }
    }
}