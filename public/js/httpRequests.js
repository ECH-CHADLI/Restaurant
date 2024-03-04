const submitReserve = () => {
    const addFormObj = JSON.parse(localStorage.getItem('additionalInfo'));
    const selectedFoodObj = JSON.parse(localStorage.getItem('selectedFoods'));
    const reservationSelection = JSON.parse(localStorage.getItem('reservationSelection'));
    const reservSeat = JSON.parse(localStorage.setItem('additionalplan'));
    

    const reservationData = {
        date_exact: reservationSelection.date,
        times: [{
            time: reservationSelection.time,
            reservations: [{ 
                seat: reservSeat, 
                user: 'ddd',
                people: reservationSelection.numPeople,
                additionalForm: addFormObj,
                orderedFood: selectedFoodObj
            }],
        }],
    }; 

    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', '/payment'); 
    xhr.setRequestHeader('Content-Type', 'application/json'); 

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

    xhr.send(JSON.stringify(reservationData)); 
}


/* TODO:
        + integrate med's code
        + Work on admin part
        - later:
            + change query pramas to body
            + Stripe API for payment
            + 'thank you for your reservation' 
            + treat image loading problem
*/