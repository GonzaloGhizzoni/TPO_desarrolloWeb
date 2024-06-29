import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

const apiUrl = "http://127.0.0.1:5000"

// Use case
var actualView = '../login/login.html'; // Replace with the path of the actual view. ACTUAL VIEW MUST MATCH WITH HEADEAR.HTML HREF PATH

loadHeader(actualView);
loadFooter();


const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        let email = document.getElementById('fEmail').value;
        let password = document.getElementById('fPassword').value;
        
        // Call login function
        login(email, password);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('registerForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        let email = document.getElementById('FregisterEmail').value;
        let password = document.getElementById('FregisterPassword').value;
        let username = document.getElementById('fName').value;
        let surname = document.getElementById('fSurname').value;
        let birthdate = document.getElementById('fbirthdate').value;
        
        // Call login function
        register(email, password,username,surname,birthdate);
    });
});


function login(email, password) {
    fetch(`${apiUrl}/login/${encodeURIComponent(email)}/${encodeURIComponent(password)}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

function register(email,password,username,surname,birthdate){
    fetch(`${apiUrl}/register/${encodeURIComponent(email)}/${encodeURIComponent(password)}/${encodeURIComponent(username)}/${encodeURIComponent(surname)}/${encodeURIComponent(birthdate)}`, {
        method: "POST"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}