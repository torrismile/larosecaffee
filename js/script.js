document.querySelectorAll("#links a").forEach((item) => {
  item.addEventListener('click', function() {
  document.querySelector("#toggler").checked = false;
  });
});

function sentMessage(message) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log("Sending message: ", message);

  var raw = JSON.stringify(message);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  console.log("Sending request: ", requestOptions);

  fetch("https://ubb0p6bsy0.execute-api.eu-central-1.amazonaws.com/default/send_email", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function submitReservation(reservationDataStr) {
  console.log("Submiting reservation");
  const baseUrl = "http://52.59.194.36:3000/";
  const endpoint = "reservations";
  let url = baseUrl + endpoint;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: reservationDataStr
  }).then(() => {
    console.log("Submit succeeded")
  }).catch((err) =>{
    console.log("Submit failed")
  })
  // POST - poslu serveru json
}

async function getReservations() {
  console.log("Getting reservation");
  const baseUrl = "http://52.59.194.36:3000/";
  const endpoint = "reservations";
  let url = baseUrl + endpoint;
  let response = await fetch(url, {
    method: "GET"
  });
  let json = await response.json();
  // GET vrati json
  return json;
}

function showReservations(reservations) {
  console.log(reservations)
  let table = document.querySelector("#tableReservation");
  reservations.forEach((item) => {

  let newRow = document.createElement("tr");
  table.appendChild(newRow);
  let nameCell = document.createElement("td");
  nameCell.innerHTML = item.userName;
  newRow.appendChild(nameCell);

  let nameCell1 = document.createElement("td");
  nameCell1.innerHTML = item.userSurname;
  newRow.appendChild(nameCell1);

  let nameCell2 = document.createElement("td");
  nameCell2.innerHTML = item.email;
  newRow.appendChild(nameCell2);

  let nameCell3 = document.createElement("td");
  nameCell3.innerHTML = item.dataReservation;
  newRow.appendChild(nameCell3);

  let nameCell4 = document.createElement("td");
  nameCell4.innerHTML = item.timeOfReservation;
  newRow.appendChild(nameCell4);

  let nameCell5 = document.createElement("td");
  nameCell5.innerHTML = item.numberPeople;
  newRow.appendChild(nameCell5);
  });
}

function convertJson () {
  let formElement = document.getElementById('formJson');//("#formJson");
  let formData = new FormData(formElement);
  let object = {};
  formData.forEach(function(value, key){
      object[key] = value;
  });
  console.log("Form converted to object:", object);
  return object;
}

function showMessage(username) {
  let newMassege = document.querySelector(".thanku");
  newMassege.innerHTML = `Thank you, ${username}`;
  newMassege.style.visibility = "visible";
  newMassege.style.color = "#777";
  newMassege.style.textAlign = "center";
}


//Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'section-reservation__form--form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

//Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'section-reservation__form--form-control success';
}

//Check email is valid
function checkEmail(input){
  let isError = false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
      showSuccess(input);
    } else {
      isError = true;
      showError(input, 'Email není platný');
    }
    return isError;
}

//Check required fields
function checkRequired(inputArr){
  let isError = false;
  inputArr.forEach(function(input) {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
      isError = true;
    } else {
      showSuccess(input);
    }
  });
  return isError;
}

//Check input length
function checkLength(input, min, max) {
  let  isError = true;
  if (input.value.length < min) {
    showError(input, `${getFieldName(input)} must be at least ${min} characters`);
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(inpit)} must be less than ${max} characters`);
  } else {
    isError = false;
    showSuccess(input);
  }
  return isError;
}
//Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function fillReservations() {
  getReservations().then(reservations => {
    showReservations(reservations);
  });
}

function setReservationSubmit() {
  document.getElementById('userName').addEventListener ('focusout', (event) => {
    checkLength(event.target, 3, 15);
  });
  document.getElementById('userSurname').addEventListener ('focusout', (event) => {
    checkLength(event.target, 3, 15);
  });
  document.getElementById('email').addEventListener ('focusout', (event) => {
    checkEmail(event.target);
  });;
  document.getElementById('numberPeople').addEventListener ('focusout', (event) => {
    checkLength(event.target, 1, 8);
  });;

  //Event listener
  document.querySelector("#reservation-submit").addEventListener('click', function (e) {
    e.preventDefault();
    let username = document.querySelector('#userName');
    let usersurname = document.querySelector('#userSurname');
    let date = document.querySelector('#dataReservation');
    let time = document.querySelector('#timeOfReservation');
    let number = document.querySelector('#numberPeople');
    let email = document.querySelector('#email');


    let formError = checkRequired([username, usersurname, date, time, number]);

    let userNameError = checkLength(username, 3, 15);
    let userSurnameError = checkLength(usersurname, 3, 15);
    let numberError = checkLength(number, 1, 8);
    let emailError = checkEmail(email);
    let formJson = convertJson();
    if (!(formError||userNameError||userSurnameError||numberError||emailError)) {
      sentMessage(formJson);
      showMessage(username.value);
    }
  });
}
