const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoText = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherIcon = wrapper.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Browser don`t support/reject geolocation")
  }
})

function success(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid={APIKEY}`;
  fetchData();
}

function error(positionError) {
  infoText.innerText = positionError.message;
  infoText.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid={APIKEY}`;
  fetchData();
}

function fetchData() {
  infoText.innerText = "Getting weather details...";
  infoText.classList.add("pending");

  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}


function weatherDetails(info) {
  if (info.cod === "404") {
    infoText.classList.replace("pending", "error");
    infoText.innerText = `${inputField.value} is not a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id === 800) {
      weatherIcon.src = "icons/sun.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "icons/rain.svg";
    }

    document.querySelector(".temp .numb").innerText = Math.floor(temp);
    document.querySelector(".weather").innerText = description;
    document.querySelector(".location span").innerText = `${city}, ${country}`;
    document.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    document.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");
    inputField.value = "";
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
})