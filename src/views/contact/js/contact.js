import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

// Header and footer loading function
// -------------------------------------------------------- //
// Use case
var actualView = '../contact/contact.html'; // Replace with the path of the actual view.
loadHeader(actualView);
loadFooter();

// -------------------------------------------------------- //

// Validate when the DOM is fully loaded and when the form is submited.
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input');

    //Add blur event listener to all required inputs
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


// Function for validate the value of form field based on it's type in contact view.
// Param:field -> This is a reference to the HTML form element (e.g., input, select, textarea) that needs validation.
// Return Value: The function returns true if the field is valid and false if there's an error.
function validateField(field) {
    const fieldType = field.getAttribute('type');
    const fieldValue = field.value.trim();
    const selectValue = document.querySelector('select');
    const selectDefaultOption = "Seleccione una opcion"

    if (fieldType === 'text' || fieldType === 'email' || fieldType === 'number') {
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

    if (fieldType === 'checkbox') {
        if (!field.checked) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'Debe aceptar los términos y condiciones antes de continuar.';
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
            return true;
        }
    }

    if (selectValue.value === selectDefaultOption) {
        selectValue.classList.add('is-invalid');
        selectValue.nextElementSibling.textContent = 'Debe seleccionar una opción.';
        return false;
    } else {
        selectValue.classList.remove('is-invalid');
        selectValue.nextElementSibling.textContent = '';
        return true;
    }
}
// -------------------------------------------------------- //
