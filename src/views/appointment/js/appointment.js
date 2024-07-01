import { loadHeader } from "../../../common/header/header.js";
import { loadFooter } from "../../../common/footer/footer.js";

const apiUrl = "http://127.0.0.1:5000";
// const apiUrl = "https://nahuelgr.pythonanywhere.com"

// Header and footer loading function
// -------------------------------------------------------- //
// Use case
var actualView = "../appointment/appointment-form.html"; // Replace with the path of the actual view.
loadHeader(actualView);
loadFooter();

/////////////////////////////////////////////////
// Function to load hour's selector
document.addEventListener("DOMContentLoaded", () => {
    getUserAppointments(1);
    // Bloquear fechas pasadas en el selector de fecha
    const dateInput = document.getElementById("fDate");
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);

    // Generar opciones de horario
    const timeSelect = document.getElementById("fTime");
    const startHour = 9;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const timeString = `${String(hour).padStart(2, "0")}:${String(
                minute
            ).padStart(2, "0")}`;
            const option = document.createElement("option");
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }
});

/////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("booking-form");
    const inputs = document.querySelectorAll("input");

    bookingForm.addEventListener("submit", function (event) {
        let formIsValid = true;

        let email = document.getElementById("fEmail").value;
        let name = document.getElementById("fName").value;
        let specialties = document.getElementById("fSpecialty").value;
        let dateOfAppointment = document.getElementById("fDate").value;
        let hour = document.getElementById("fTime").value;

        console.log(email);
        console.log(name);
        console.log(specialties);
        console.log(dateOfAppointment);
        console.log(hour);

        // Call login function
        addAppointment(email, name, specialties, dateOfAppointment, hour);
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
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            specialties: specialties,
            dateOfAppointment: dateOfAppointment,
            hour: hour,
        }),
    })
        .then((response) => {
            //console.log(response);
            if (!response.ok) {
                //console.log("Entro aca");
                return response.json().then(data => {
                    document.getElementById('addAppointmentFailed').textContent = "No se pudo agregar su turno."
                    throw new Error(data.message || "No se pudo agregar su turno.")
                })
            }
            return response.json();
        })
        .then((data) => {
            //console.log("Entro al data");
            //console.log(data);
            document.getElementById('addAppointmentSuccess').textContent = "Turno agregado con éxito!"
            clearFormFields();
        })
        .catch((error) => {
            document.getElementById('addAppointmentSuccess').textContent = "";
            document.getElementById('addAppointmentFailed').textContent = error.message; // Aquí se actualiza el contenido del elemento en la página
            console.error('Error:', error);
        });
}

// Function to get appointments by user
function getUserAppointments(userID) {
    fetch(`${apiUrl}/userappointment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userID }),
    })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                console.log("Entro aca");
                return response.json();
            }
            return response.json();
        })
        .then((data) => {
            console.log("Entro al data");
            console.log(data);
            displayUserAppointments(data);
        })
        .catch((error) => console.error("Error:", error));
}

// Function to edit appointment
function editAppointment(appointmentID){
    let newSpecialties = document.getElementById("table-specialties").value
    let newdateOfAppointment = document.getElementById("table-date").value
    let newHour = document.getElementById("table-hour").value
    fetch(`${apiUrl}/newappointment`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: appointmentID,
            specialties: newSpecialties,
            dateOfAppointment: newdateOfAppointment,
            hour: newHour,
        }),
    })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                console.log("Entro aca");
                return response.json();
            }
            return response.json();
        })
        .then((data) => {
            console.log("Entro al data");
            console.log(data);
        })
        .catch((error) => console.error("Error:", error));
}

// Function to delete appointment
function deleteAppointment(appointmentID){
    fetch(`${apiUrl}/cancelappointment`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: appointmentID
        }),
    })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                console.log("Entro aca");
                return response.json();
            }
            return response.json();
        })
        .then((data) => {
            //Logica del modal para avisar que se borro el appointment aca adentro
            //Call the function getUserAppointments again to refresh appointments table
            getUserAppointments(userID)
        })
        .catch((error) => console.error("Error:", error));
}

// Function to dinamically create appointments table
function displayUserAppointments(appointments) {
    //Select the tahble html element.
    const tableBody = document.getElementById("appointments-table").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    appointments.forEach((appointment) => {
        console.log(appointment)
        const row = document.createElement("tr");

        const emailCell = document.createElement("td");
        emailCell.textContent = appointment.email;
        console.log(appointment.email)

        const hourCell = document.createElement("td");
        hourCell.textContent = appointment.hour;
        console.log(appointment.hour)
        // hourCell.innerHTML = `<input type="text" id="hour-${appointment.id}" value="${appointment.hour}" disabled />`;

        const nameCell = document.createElement("td");
        nameCell.textContent = appointment.name;
        console.log(appointment.name)

        const specialtiesCell = document.createElement("td");
        specialtiesCell.textContent = appointment.specialties;
        console.log(appointment.specialties)
        // specialtiesCell.innerHTML = `<input type="text" id="specialties-${appointment.id}" value="${appointment.specialties}" disabled />`;

        let convertedDate = formatDate(appointment.date_of_appointment);
        const dateCell = document.createElement("td");
        dateCell.textContent = convertedDate;
        console.log(appointment.date_of_appointment)
        // dateCell.innerHTML = `<input type="date" id="date-${appointment.id}" value="${formatDateForInput(appointment.date_of_appointment)}" disabled />`;

        // Creates edit button
        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.classList.add("icon-button")
        editButton.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        editButton.addEventListener("click", () => {
            // Call function to modify appointment
            editAppointment(appointment.id);
        });
        editCell.appendChild(editButton);

        // Create delete button
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("icon-button")
        deleteButton.classList.add("cancel-btn")
        deleteButton.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        deleteButton.addEventListener("click", () => {
            // Call function to delete appointment
            deleteAppointment(appointment.id);
        });
        deleteCell.appendChild(deleteButton);
        

        // ... Create cells for appointment properties (email, name, specialties, date, hour)
        // ... Append cells for properties
        row.appendChild(emailCell);
        row.appendChild(nameCell);
        row.appendChild(specialtiesCell);
        row.appendChild(dateCell);
        row.appendChild(hourCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    });
}

// Function to format date from API response
function formatDate(dateString) {
    // Parse the date string to a Date object
    const date = new Date(dateString);

   // Extract day, month, and year in UTC
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = date.getUTCFullYear();

    // Return the formatted date
    return `${day}/${month}/${year}`;
}