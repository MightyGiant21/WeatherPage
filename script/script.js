const getWeatherData = async (location) => {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      location +
      "&APPID=97d1973b5197635c59cc028b60a82450",
    { mode: "cors" }
  );

  const data = await response.json();

  updateLocation(data.name, data.sys.country);
  updateIcon(data.weather[0]);
  temp(data.main);
  getDateAndTime(data.timezone);

};

const updateLocation = (country, countryCode) => {
  currentCity.innerHTML = country + ", " + countryCode;
};

const updateIcon = (data) => {
  weatherIcon.src = "http://openweathermap.org/img/wn/" + data.icon + "@2x.png";
  const iconDescription = capitalizeWord(data.description);
  weatherDescription.innerHTML = iconDescription;
};

const temp = (data) => {
  currentTemp.innerHTML =
    " Current Temp " + Math.floor(data.temp - 273.15) + "&#8451";
  maxTemp.innerHTML =
    " Max Temp " + Math.floor(data.temp_max - 273.15) + "&#8451";
  minTemp.innerHTML =
    " Min Temp " + Math.floor(data.temp_min - 273.15) + "&#8451";
};

const validateSearch = async (location) => {
  locationData.classList.remove("shake");

  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      location +
      "&APPID=97d1973b5197635c59cc028b60a82450",
    { mode: "cors" }
  );

  const data = await response.json();
  console.log("data: ", data);
  if (data.cod != "400" && data.cod != "404") {
    updateLocation(data.name, data.sys.country);
    updateIcon(data.weather[0]);
    temp(data.main);
    getDateAndTime(data.timezone);
    locationForm.reset();
  } else {
    locationData.classList.add("shake");
  }
};

const getDateAndTime = async (timeZone) => {
  const date = await new Date();
  let day = date.getDay();

  switch (day) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }

  currentDay.innerHTML = day;

  const minute = date.getMinutes();
  let hour = date.getHours();

  if (timeZone != 0) {
    hour = timeZone / 3600;
  }

  const timeIn12Hour = convertTimeTo12Hour(hour, minute);

  currentTime.innerHTML = timeIn12Hour;
};

const convertTimeTo12Hour = (hours, minutes) => {
  let time = "";
  let suffix = "";
  let hoursIn12Hr = hours;

  if (hours > 12) {
    suffix = "PM";
    hoursIn12Hr -= 12;
  } else if (hours < 0) {
    hoursIn12Hr += 12;
  }

  if (hours < 12) {
    suffix = "AM";
  }

  if (minutes < 10) {
    time = hoursIn12Hr + ":0" + minutes + " " + suffix;
  } else {
    time = hoursIn12Hr + ":" + minutes + " " + suffix;
  }

  return time;
};

const capitalizeWord = (word) => {
  let string = word.split(" ");
  for (let i = 0; i < string.length; i++) {
    string[i] = string[i][0].toUpperCase() + string[i].substr(1);
  }
  return string.join(" ");
};

const run = (location) => {
  submitBtn.addEventListener("click", () => {
    validateSearch(locationData.value);
  });
  getWeatherData("London");
};

run();
