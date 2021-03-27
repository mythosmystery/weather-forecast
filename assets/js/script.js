//api key 1b0d53466c6b55d0c85f1d56f3184390
const units = "imperial";
const key = "1b0d53466c6b55d0c85f1d56f3184390";
const defaultCity = "Oklahoma City";

var weatherBtnEl = $("#getWeather");
var cityInputEl = $("#cityInput");
var invalidCityEl = $("#invalidCity");

var currentWeatherCardEl = $("#currentWeather");
var cityNameEl = $("#cityName");
var currentTempEl = $("#currentTemp");
var currentHumidityEl = $("#currentHumidity");
var currentWindSpeedEl = $("#currentWindSpeed");
var currentUVIndexEl = $("#currentUVIndex");
var currentIconEl = $("#currentIcon");

var recentSearchesEl = $("#recentSearches");

var forecastCardEl = $("#forecast");
var forecastTempEl = [$("#day1temp"), $("#day2temp"), $("#day3temp"), $("#day4temp"), $("#day5temp")];
var forecastIconEl = [$("#day1Icon"), $("#day2Icon"), $("#day3Icon"), $("#day4Icon"), $("#day5Icon")];
var forecastDateEl = [$("#day1Date"), $("#day2Date"), $("#day3Date"), $("#day4Date"), $("#day5Date")];
var forecastHumidityEl = [$("#day1Humidity"), $("#day2Humidity"), $("#day3Humidity"), $("#day4Humidity"), $("#day5Humidity")];

var currentTemp;
var currentHumidity;
var currentWindSpeed;
var currentUVIndex;
var currentIcon;
var forecast;
var cityName;

var currentDate = moment().format("MM/DD/YYYY");
invalidCityEl.hide();
currentWeatherCardEl.hide();
forecastCardEl.hide();

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
         invalidCityEl.show();
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
         setForecast();
      })
      .catch(function () {
        invalidCityEl.show();
         // catch any errors
      });
}
function setForecast(){
  forecastCardEl.show();
  var date = moment();
  for (let i = 0; i < forecastDateEl.length; i++) {   
    date.add(1, "day");
    forecastDateEl[i].text(date.format("MM/DD/YYYY"));
    forecastIconEl[i].attr("src", "http://openweathermap.org/img/wn/"+forecast[i].weather[0].icon+".png");
    forecastTempEl[i].text(forecast[i].temp.day);
    forecastHumidityEl[i].text(forecast[i].humidity);
  }

}
function setCurrentWeather(){  
  invalidCityEl.hide();
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

recentSearchesEl.find("button").on("click", getRecentSearch);


weatherBtnEl.on("click", function(){
  cityName = cityInputEl.val();  
  getCurrentWeather(cityName);
  setRecentSearch();
});
