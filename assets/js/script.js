
const units = "imperial";
const key = "1b0d53466c6b55d0c85f1d56f3184390";

//url constants
const iconURL = "https://openweathermap.org/img/wn/";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";

//weather button card vars
var weatherBtnEl = $("#getWeather");
var cityInputEl = $("#cityInput");
var invalidCityEl = $("#invalidCity");

//current weather card vars
var currentWeatherCardEl = $("#currentWeather");
var cityNameEl = $("#cityName");
var currentTempEl = $("#currentTemp");
var currentHumidityEl = $("#currentHumidity");
var currentWindSpeedEl = $("#currentWindSpeed");
var currentUVIndexEl = $("#currentUVIndex");
var currentIconEl = $("#currentIcon");

var recentSearchesEl = $("#recentSearches");

//forecast card arrays
var forecastCardEl = $("#forecast");
var forecastTempEl = [$("#day1temp"), $("#day2temp"), $("#day3temp"), $("#day4temp"), $("#day5temp")];
var forecastIconEl = [$("#day1Icon"), $("#day2Icon"), $("#day3Icon"), $("#day4Icon"), $("#day5Icon")];
var forecastDateEl = [$("#day1Date"), $("#day2Date"), $("#day3Date"), $("#day4Date"), $("#day5Date")];
var forecastHumidityEl = [
   $("#day1Humidity"),
   $("#day2Humidity"),
   $("#day3Humidity"),
   $("#day4Humidity"),
   $("#day5Humidity"),
];
var forecastCityEl = $("#forecastCity");

//empty data vars
var currentTemp;
var currentHumidity;
var currentWindSpeed;
var currentUVIndex;
var currentIcon;
var forecast;
var cityName;

var currentDate = moment().format("MM/DD/YYYY");

//this gets saved to localstorage
var cityList = [];

//create a cities entry if there isnt one already
if (localStorage.getItem("cities") == null) {
   localStorage.setItem("cities", JSON.stringify(cityList));
}

loadCityList();

//hide unused cards
invalidCityEl.hide();
currentWeatherCardEl.hide();
forecastCardEl.hide();

recentSearchesEl.on("click", getRecentSearch);

//sets cityname for future use and calls functions
weatherBtnEl.on("click", function () {
   cityName = cityInputEl.val();
   getCurrentWeather(cityName);
   setRecentSearch();
});

//loads city names from localstorage
function loadCityList() {
   var cityArray = JSON.parse(localStorage.getItem("cities"));
   console.log(cityArray);
   for (let i = 0; i < cityArray.length; i++) {
      createButton(cityArray[i]);
   }
}

//gets the current weather from the api
function getCurrentWeather(cityID) {
   fetch(apiURL + cityID + "&appid=" + key + "&units=" + units)
      .then(function (resp) {
         return resp.json();
      }) // Convert data to json
      .then(function (data) {
         //console.log(data);
         currentTemp = data.main.temp;
         currentHumidity = data.main.humidity;
         currentWindSpeed = data.wind.speed;
         currentIcon = data.weather[0].icon;
         getOneCall(data.coord.lat, data.coord.lon);
      })
      .catch(function () {
         // catch any errors
         invalidCityEl.show();
      });
}

//gets other data from open weather maps
function getOneCall(lat, lon) {
   fetch(onecallURL + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=" + units + "&appid=" + key)
      .then(function (resp) {
         return resp.json();
      }) // Convert data to json
      .then(function (data) {
         //console.log(data);
         currentUVIndex = data.current.uvi;
         forecast = data.daily;
         //console.log(forecast);
         setCurrentWeather();
         setForecast();
      })
      .catch(function () {
         invalidCityEl.show();
         // catch any errors
      });
}

//sets the forecast cards from the arrays
function setForecast() {
   forecastCardEl.show();
   forecastCityEl.text(cityName);
   var date = moment();
   for (let i = 0; i < forecastDateEl.length; i++) {
      date.add(1, "day");
      forecastDateEl[i].text(date.format("MM/DD/YYYY"));
      forecastIconEl[i].attr("src", iconURL + forecast[i].weather[0].icon + ".png");
      forecastTempEl[i].text(forecast[i].temp.day);
      forecastHumidityEl[i].text(forecast[i].humidity);
   }
}

//sets the current weather from the data retrived earlier
function setCurrentWeather() {
   invalidCityEl.hide();
   currentWeatherCardEl.show();
   cityNameEl.text(cityName + ` (${currentDate})`);
   currentIconEl.attr("src", iconURL + currentIcon + ".png");
   currentTempEl.text(currentTemp);
   currentHumidityEl.text(currentHumidity);
   currentWindSpeedEl.text(currentWindSpeed);
   currentUVIndexEl.text(currentUVIndex);
   setUVColor();
}

//sets the color of the uv index item
function setUVColor() {
   if (currentUVIndex < 3) {
      currentUVIndexEl.removeClass();
      currentUVIndexEl.addClass("low");
   } else if (currentUVIndex < 6) {
      currentUVIndexEl.removeClass();
      currentUVIndexEl.addClass("medium");
   } else if (currentUVIndex < 8) {
      currentUVIndexEl.removeClass();
      currentUVIndexEl.addClass("high");
   } else if (currentUVIndex < 11) {
      currentUVIndexEl.removeClass();
      currentUVIndexEl.addClass("very-high");
   } else {
      currentUVIndexEl.removeClass();
      currentUVIndexEl.addClass("extreme");
   }
}

//gets data from recent search when clicked
function getRecentSearch(event) {
   var currentButton = $(event.target);
   cityName = currentButton.text();
   console.log(cityName);
   getCurrentWeather(cityName);
}

//sets recent searches from buttons and adds to localstorage
function setRecentSearch() {
   var buttonArray = recentSearchesEl.find("button");
   var invalid = false;
   cityList = JSON.parse(localStorage.getItem("cities"));
   for (let i = 0; i < buttonArray.length; i++) {
      console.log(buttonArray[i].textContent);
      if (buttonArray[i].textContent == cityName) invalid = true;
      if (cityName == "" || cityName == null) invalid = true;
   }
   if (!invalid) {
      cityList.push(cityName);
      createButton(cityName);
      localStorage.setItem("cities", JSON.stringify(cityList));
   }
}

//creates a button in the list with the correct bootstrap classes
function createButton(name) {
   var newButton = $("<button type='button'>");
   newButton.addClass("list-group-item list-group-item-action");
   newButton.text(name);
   recentSearchesEl.prepend(newButton);
}
