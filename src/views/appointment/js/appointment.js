import { loadHeader } from "../../../common/header/header.js"
import { loadFooter } from "../../../common/footer/footer.js"

// Header and footer loading function
// -------------------------------------------------------- //
// Use case
var actualView = '../appointment/appointment-form.html'; // Replace with the path of the actual view.
loadHeader(actualView);
loadFooter();


/////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    // Bloquear fechas pasadas en el selector de fecha
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Generar opciones de horario
    const timeSelect = document.getElementById('time');
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
