//api key 1b0d53466c6b55d0c85f1d56f3184390
const units = "imperial";
const key = "1b0d53466c6b55d0c85f1d56f3184390";
const defaultCity = "Oklahoma City";

var weatherBtnEl = $("#getWeather");
var cityInputEl = $("#cityInput");
var currentWeatherCardEl = $("#currentWeather");
var cityNameEl = $("#cityName");
var currentTempEl = $("#currentTemp");
var currentHumidityEl = $("#currentHumidity");
var currentWindSpeedEl = $("#currentWindSpeed");
var currentUVIndexEl = $("#currentUVIndex");
var recentSearchesEl = $("#recentSearches");
var currentIconEl = $("#currentIcon");

var currentTemp;
var currentHumidity;
var currentWindSpeed;
var currentUVIndex;
var currentIcon;
var forecast;
var cityName;

var currentDate = moment().format("MM/DD/YYYY");
currentWeatherCardEl.hide();

function getCurrentWeather(cityID) {
   fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityID + "&appid=" + key + "&units=" + units)
      .then(function (resp) {
         return resp.json();
      }) // Convert data to json
      .then(function (data) {
         console.log(data);
         currentTemp = data.main.temp;
         currentHumidity = data.main.humidity;
         currentWindSpeed = data.wind.speed;
         currentIcon = data.weather[0].icon;         
         getOneCall(data.coord.lat, data.coord.lon);         
      })
      .catch(function () {
         // catch any errors
      });
}
function getOneCall(lat, lon) {
   fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
         lat +
         "&lon=" +
         lon +
         "&exclude=hourly,minutely&units=" + units + "&appid=" +
         key
   )
      .then(function (resp) {
         return resp.json();
      }) // Convert data to json
      .then(function (data) {
         console.log(data);
         currentUVIndex = data.current.uvi;         
         forecast = data.daily;
         console.log(forecast);
         setCurrentWeather();
      })
      .catch(function () {
         // catch any errors
      });
}
function setForecast(){
  
}
function setCurrentWeather(){  
  currentWeatherCardEl.show();
  cityNameEl.text(cityName + ` (${currentDate})`); 
  currentIconEl.attr("src", "http://openweathermap.org/img/wn/"+currentIcon+"@2x.png");
  currentTempEl.text(currentTemp); 
  currentHumidityEl.text(currentHumidity);
  currentWindSpeedEl.text(currentWindSpeed);
  currentUVIndexEl.text(currentUVIndex);
  setUVColor();
}
function setUVColor(){
  if(currentUVIndex < 3){
    currentUVIndexEl.removeClass();
    currentUVIndexEl.addClass("low");
  }else if(currentUVIndex < 6){
    currentUVIndexEl.removeClass();
    currentUVIndexEl.addClass("medium");
  }else if(currentUVIndex < 8){
    currentUVIndexEl.removeClass();
    currentUVIndexEl.addClass("high");
  }else if(currentUVIndex < 11){
    currentUVIndexEl.removeClass();
    currentUVIndexEl.addClass("very-high");
  }else{
    currentUVIndexEl.removeClass();
    currentUVIndexEl.addClass("extreme");
  }
}
function getRecentSearch(event){    
  var currentButton = $(event.currentTarget);
  cityName = currentButton.text();
  console.log(cityName);
  getCurrentWeather(cityName);
}
function setRecentSearch(){
  var newButton = $("<button type='button'>");  
  newButton.addClass("list-group-item list-group-item-action");
  newButton.text(cityName);
  recentSearchesEl.prepend(newButton);
}

recentSearchesEl.children().on("click", getRecentSearch);


weatherBtnEl.on("click", function(){
  cityName = cityInputEl.val();  
  getCurrentWeather(cityName);
  setRecentSearch();
});
