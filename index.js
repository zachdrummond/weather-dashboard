// 1. App Layout
// Aside (Left) - Search for a City
// Loads Bars of previously search cities
// Card - City's Weather for Today
// Header - City (Date) Weather Icon
// UV Index - In a Box
// 5-Day Forecast
// 5 Blue Boxes with White Text
// Month/Day/Year
// Weather Icon
// Temp:
// Humidity:
// 2. OpenWeather API Research
// City for Today
// Weather Icon
// UV Index - In a Box
// 5 Day Forecast
// Date
// Weather Icon
// Temp:
// Humidity
// 3. Functionality
// Add what the user searches into local storage and display below search bar
// UV Index Color - Favorable, Moderate, or Severe Weather Conditions
// User clicks previous city in search history, get from local storage and update screen
// When app opens, last searched city forecast displays

$(document).ready(function () {
  // Variables
  var APIkey = "a7ccd0a4c74bf45b3a12a4b9c719a4f6";
  var units = "&units=imperial";

  // Element Variables
  var asideDiv = $("#asideDiv");
  var userInput = $("#userInput");

  var searchBtn = $("#searchBtn");

  var weatherDiv = $("#weatherDiv");
  var forecastDiv = $("#forecastDiv");

  // Function Definitions

  // Function Calls
  function displayCurrentWeather(response) {
    var cityHeader = $("<h3>");
    cityHeader.text(userInput.val());
    //console.log(response.weather[0].icon));
    cityHeader.attr("style", "margin-bottom: 20px");
    weatherDiv.append(cityHeader);

    var temp = $("<h6>Temperature: " + response.current.temp + "&deg;F</h6>");
    weatherDiv.append(temp);

    var humidity = $("<h6>Humidity: " + response.current.humidity + "%</h6>");
    weatherDiv.append(humidity);

    var windSpeed = $(
      "<h6>Wind Speed: " + response.current.wind_speed + " MPH </h6>"
    );
    weatherDiv.append(windSpeed);

    var uvIndex = $("<h6>UV Index: " + response.current.uvi + "</h6>");
    weatherDiv.append(uvIndex);
  }

  function displayForecastWeather(response) {
    for (var i = 0; i < 5; i++) {
      var day1 = $("<div>");
      day1.attr("class", "card text-white bg-primary mb-3 text-center");
      day1.attr("style", "width: 8rem");
      var dateHeader = $("<h5> Insert Date" + "</h5>");
      day1.append(dateHeader);
      var temp = $("<p> Temp: " + response[i].temp.day + "&deg;F</p>");
      day1.append(temp);
      var humidity = $("<p>Humidity: " + response[i].humidity + "%</p>");
      day1.append(humidity);
      forecastDiv.append(day1);
    }
  }

  // Event Listeners
  searchBtn.on("click", function (event) {
    event.preventDefault();

    var userCity = userInput.val();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      userCity +
      "&appid=" +
      APIkey +
      units;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response1) {
      var lat = response1.coord.lat;
      var long = response1.coord.lon;
      queryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        long +
        "&exclude=minutely,hourly&appid=" +
        APIkey +
        units;

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response2) {
        console.log(response2);
        displayCurrentWeather(response2);
        displayForecastWeather(response2.daily);
      });
    });
  });
});
