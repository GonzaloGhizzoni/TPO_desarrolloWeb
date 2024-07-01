import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"


const apiUrl = "http://127.0.0.1:5000"
// const apiUrl = "https://nahuelgr.pythonanywhere.com"

// Header and footer loading function
// -------------------------------------------------------- //
// Use case
var actualView = '../appointment/appointment-form.html'; // Replace with the path of the actual view.
loadHeader(actualView);
loadFooter();


/////////////////////////////////////////////////
// Function to load hour's selector
document.addEventListener('DOMContentLoaded', () => {
    getUserAppointments(1);
    // Bloquear fechas pasadas en el selector de fecha
    const dateInput = document.getElementById('fDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Generar opciones de horario
    const timeSelect = document.getElementById('fTime');
    const startHour = 9;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }
});

/////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    const inputs = document.querySelectorAll('input');

    bookingForm.addEventListener('submit', function(event) {
        let formIsValid = true;

        // inputs.forEach(input => {
        //     if (!validateField(bookingForm,input)) {
        //         formIsValid = false;
        //     }
        // });


        // if (!formIsValid)
        //     event.preventDefault(); 
        // else{
            let email = document.getElementById('fEmail').value;
            let name = document.getElementById('fName').value;
            let specialties = document.getElementById('fSpecialty').value;
            let dateOfAppointment = document.getElementById('fDate').value;
            let hour = document.getElementById('fTime').value;
            
            console.log(email);
            console.log(name);
            console.log(specialties);
            console.log(dateOfAppointment);
            console.log(hour);


            // Call login function
            addAppointment(email,name,specialties,dateOfAppointment,hour);
            // clearFormFields();
        // }
    });
});


function addAppointment(name, email, specialties, dateOfAppointment, hour) {
    if (!navigator.onLine) {
        // Display error message: "Unable to connect to server. Check your internet connection."
        return console.log("error al conectar al server");
    }
    fetch(`${apiUrl}/newappointment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, specialties: specialties,dateOfAppointment: dateOfAppointment,hour: hour })
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            console.log("Entro aca")
            return response.json()
        }
        return response.json()
    })
    .then(data => {
        console.log("Entro al data")
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

function getUserAppointments(userID){
    fetch(`${apiUrl}/userappointment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: userID})
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            console.log("Entro aca")
            return response.json()
        }
        return response.json()
    })
    .then(data => {
        console.log("Entro al data")
        console.log(data);
    })
    .catch(error => console.error('Error:', error));

}