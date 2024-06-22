import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

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