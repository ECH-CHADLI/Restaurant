const addFormObj = JSON.parse(localStorage.getItem('additionalInfo'));
const selectedFoodObj = JSON.parse(localStorage.getItem('selectedFoods'));
const reservationSelection = JSON.parse(localStorage.getItem('reservationSelection'));
const additionalplan = JSON.parse(localStorage.getItem('additionalplan'));

const reservationData = {
    date_exact: reservationSelection.date,
    times: [{
        time: reservationSelection.time,
        reservations: [{ 
            user: 'hamza',
            people: reservationSelection.numPeople,
            additionalForm: addFormObj,
            orderedFood: selectedFoodObj,
            additionalplan:additionalplan
        }],
    }],
}; 

const xhr = new XMLHttpRequest();
xhr.open('POST', '/payment'); // Send the request to your server's /payment route
xhr.setRequestHeader('Content-Type', 'application/json'); // Set content type to JSON
xhr.send(JSON.stringify(reservationData)); // Send the reservationSelection object as JSON
console.log(reservationData);
/* EXPLANATION: it's better to send only one object that contains multiple objects that can be retrieved
                separately in a destructored way                
*/

xhr.onload = function () {
    if (xhr.status === 200) {
        console.log(xhr.responseText); // Handle the response from the server
    } else {
        console.error('Request failed with status:', xhr.status);
    }
};