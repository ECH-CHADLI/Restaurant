/* responsivity */
const tog = document.querySelector(".toggle");
const links = document.querySelector(".links");

tog.addEventListener("click", function(){
    tog.classList.toggle("active");
    links.classList.toggle("active");
})

document.querySelectorAll(".links > *").forEach(n => n.addEventListener("click", () => {
    tog.classList.remove("active");
    links.classList.remove("active");
}))
/* done */

/* the hidden stuff */
const observer = new IntersectionObserver((entries) => { //it is a JavaScript API used to observe changes in the intersection between an element and the viewport
    entries.forEach((entry) => {
        console.log(entry)
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    })
})

const hiddenElements = document.querySelectorAll(".hidden, .hidden-rev, .hidden-intro, .hidden--y, .hidden--x");

hiddenElements.forEach((element) => observer.observe(element)); //observe the wanted elements

/* time options */
const timeOpt = document.querySelector('#time');

var time = new Date();
time.setHours(7, 30, 0);

for(let i=0; i<11; i++) {
    var option = document.createElement('option');
    option.text = formatTime(time);
    option.value = formatTime(time);
    timeOpt.appendChild(option);

    time.setTime(time.getTime() + 1.5*60*60*1000);
}

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes;
}

function formatTimeAmPm(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    minutes = minutes < 10 ? '0' + minutes : minutes;
    amPm = hours > 12 ? hours-12 + ':' + minutes + 'PM' : hours + ':' + minutes + 'AM';
    if(hours === 12) amPm = hours + ':' + minutes + 'PM';

    return amPm;
}

/* reserve */
const reserve = () => {
    const numPeopleSelect = document.querySelector('select[name = "num-people"]');
    const timeSelect = document.querySelector('select[name = "time"]');
    const dateSelect = document.querySelector('#select-date');

    const reservationSelection = {
        numPeople: numPeopleSelect.value,
        time: timeSelect.value,
        date: dateSelect.value
    }

    localStorage.setItem('reservationSelection', JSON.stringify(reservationSelection));

    console.log(localStorage.getItem('reservationSelection'));

    /* let reservationSelectionObj = JSON.parse(localStorage.getItem('reservationSelection'));
    let date = reservationSelectionObj.date;
    let time = reservationSelectionObj.time;
    let people = reservationSelectionObj.numPeople; */
    //window.location.href=`/menu?cartCreation=true`; /* &date=${date}&time=${time}&people=${people} */
}