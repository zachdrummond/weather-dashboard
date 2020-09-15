// 1. App Layout
// Aside (Left) - Search for a City
// Loads Bars of previously search cities
// Card - City's Weather for Today
// UV Index - In a Box
// 2. OpenWeather API Research
// City for Today
// UV Index - In a Box
// 3. Functionality
// Add what the user searches into local storage and display below search bar
// UV Index Color - Favorable, Moderate, or Severe Weather Conditions
// User clicks previous city in search history, get from local storage and update screen
// When app opens, last searched city forecast displays

$(document).ready(function () {
  // Variables
  var APIkey = "a7ccd0a4c74bf45b3a12a4b9c719a4f6";
  var units = "&units=imperial";
  var userCityArray = [];

  // Element Variables
  var asideDiv = $("#asideDiv");
  var userInput = $("#userInput");
  var previousCitiesUl = $("#previousCities");
  var searchBtn = $("#searchBtn");
  var weatherDiv = $("#weatherDiv");
  var forecastDiv = $("#forecastDiv");

  // Function - Displays Today's Weather for the User's City
  function displayCurrentWeather(response) {
    var cityHeader = $("<h3>");
    var dateConversion = new Date(response.current.dt * 1000);
    var date = dateConversion.getMonth() + "/" + dateConversion.getDate() + "/" + dateConversion.getFullYear();

    var weatherIconEl = $("<img>");
    var weatherIcon = response.current.weather[0].icon;
    var weatherIconURL =
      "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    weatherIconEl.attr("src", weatherIconURL);
    cityHeader.text(userInput.val() + " (" + date + ")").append(weatherIconEl);
    weatherDiv.append(cityHeader);

    var temp = $("<p>Temperature: " + response.current.temp + "&deg;F</p>");
    weatherDiv.append(temp);

    var humidity = $("<p>Humidity: " + response.current.humidity + "%</p>");
    weatherDiv.append(humidity);

    var windSpeed = $("<p>Wind Speed: " + response.current.wind_speed + " MPH </p>");
    weatherDiv.append(windSpeed);

    var uvIndex = response.current.uvi;
    var uvIndexHeader = $("<p>UV Index: </p>");
    var uvIndexText = $("<span id='uvIndex'>" + uvIndex + "</span>");
    console.log(uvIndexText);
    uvIndexHeader.text("UV Index: ").append(uvIndexText);
    if(uvIndex < 3){
      uvIndexText.attr("style", "background-color: green");
    }
    else if( uvIndex < 6){
      uvIndexText.attr("style", "background-color: yellow");
    }
    else if(uvIndex < 8){
      uvIndexText.attr("style", "background-color: orange");
    }
    else if(uvIndex < 11){
      uvIndexText.attr("style", "background-color: red");
    }
    else{
      uvIndexText.attr("style", "background-color: purple");
    }
    weatherDiv.append(uvIndexHeader);
  }

  // Function - Displays the 5-Day Forecast for the User's City
  function displayForecastWeather(response) {
    
    var forecastHeader = $("<h3>5-Day Forecast:</h3>");
    forecastDiv.append(forecastHeader);

    for (var i = 0; i < 5; i++) {
      var day = $("<div>");
      day.attr("class", "card text-white bg-primary mb-3 text-center");
      day.attr("style", "max-width: 8rem");
      var dateConversion = new Date(response[i].dt * 1000);
      var date = dateConversion.getMonth() + "/" + dateConversion.getDate() + "/" + dateConversion.getFullYear();
      var dateHeader = $("<h5>" + date + "</h5>");
      day.append(dateHeader);
     
      var weatherIconEl = $("<img>");
      var weatherIcon = response[i].weather[0].icon;
      var weatherIconURL =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      weatherIconEl.attr("src", weatherIconURL);
      day.append(weatherIconEl);
      
      var temp = $("<p> Temp: " + response[i].temp.day + "&deg;F</p>");
      day.append(temp);
      var humidity = $("<p>Humidity: " + response[i].humidity + "%</p>");
      day.append(humidity);
      forecastDiv.append(day);
    }
  }

  // Event Listener - Listens to the Search Button
  searchBtn.on("click", function (event) {
    event.preventDefault();
    
    var userCity = userInput.val();
    if(userCity !== ""){
      var previousCitiesLi = $("<button class ='list-group-item'>" + userCity + "</button>");
      previousCitiesUl.append(previousCitiesLi);
      userCityArray.push(userCity);
      localStorage.setItem("City", JSON.stringify(userCityArray));
    }

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      userCity +
      "&appid=" +
      APIkey +
      units;

    // AJAX - Calls the OpenWeather Current Weather Data API
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response1) {
      // Variables set to the Latitude and Longitude of the User's City
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

      // AJAX - Calls the OpenWeather One Call API
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
