import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

// Use case
var actualView = '../contact/contact.html'; // Replace with the path of the actual view.
loadHeader(actualView);
loadFooter();

// --------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input');

    console.log(inputs);
    // Add blur event listener to all required inputs
    // inputs.forEach(input => {
    //     input.addEventListener('blur', () => {
    //         validateField(input);
    //     });
    // });

    // Add submit event listener to the form
    form.addEventListener("submit", function(event) {
        let formIsValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                formIsValid = false;
            }
        });

        if (!formIsValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
});

function validateField(field) {
    const fieldType = field.getAttribute('type');
    const fieldValue = field.value.trim();
    const selectValue = document.querySelector('select');
    const pepe = "Seleccione una opcion"
    console.log(selectValue);

    if (fieldType === 'text' || fieldType === 'email' || fieldType === 'number' || field.tagName.toLowerCase() === 'textarea') {
        if (fieldValue.length === 0) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'This field is required.';
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
            return true;
        }
    }

    if (fieldType === 'checkbox') {
        if (!field.checked) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'You must agree before submitting.';
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
            return true;
        }
    }

    if (selectValue.value === pepe) {
        selectValue.nextElementSibling.textContent = 'You must select an option.';
        return false;
    } else {
        selectValue.nextElementSibling.textContent = '';
        return true;
    }

    return true;
    
}