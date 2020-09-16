$(document).ready(function () {
  // Variables
  var APIkey = "a7ccd0a4c74bf45b3a12a4b9c719a4f6";
  var units = "&units=imperial";
  var userCityArray = [];
  var userCity;
  var queryURL;

  // Element Variables
  var asideDiv = $("#asideDiv");
  var userInput = $("#userInput");
  var previousCitiesDiv = $("#previousCities");
  var searchBtn = $("#searchBtn");
  var weatherDiv = $("#weatherDiv");
  var forecastDiv = $("#forecastDiv");

  // Function - Uses Local Storage to Setup the APP
  function getLocalStorage() {
    var city = JSON.parse(localStorage.getItem("City"));

    if (city !== null) {
      userCityArray = city;
      ajax(userCityArray[0]);

      for (var i = 0; i < userCityArray.length; i++) {
        createPreviousCities(userCityArray[i]);
      }
    }
  }

  // Function - Displays Today's Weather for the User's City
  function displayCurrentWeather(response, userCity) {
    var cityHeader = $("<h3>");
    var date = convertDate(response.current.dt);

    var weatherIconEl = displayWeatherIcon(response.current.weather[0].icon);
    cityHeader.text(userCity + " (" + date + ")").append(weatherIconEl);
    weatherDiv.append(cityHeader);

    var temp = $("<p>Temperature: " + response.current.temp + "&deg;F</p>");
    var humidity = $("<p>Humidity: " + response.current.humidity + "%</p>");
    var windSpeed = $(
      "<p>Wind Speed: " + response.current.wind_speed + " MPH </p>"
    );
    weatherDiv.append(temp, humidity, windSpeed);

    var uvIndex = response.current.uvi;
    displayUVIndex(uvIndex);
  }

  function displayWeatherIcon(weatherIcon) {
    var weatherIconEl = $("<img>");
    var weatherIconURL =
    "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    weatherIconEl.attr("src", weatherIconURL);

    return weatherIconEl;
  }

  // Function - Displays the 5-Day Forecast for the User's City
  function displayForecastWeather(response) {
    var forecastHeader = $("<h3>5-Day Forecast:</h3>");
    forecastDiv.append(forecastHeader);

    for (var i = 0; i < 5; i++) {
      var day = $("<div>");
      day.attr("class", "card text-white bg-primary mb-3 text-center");
      day.attr("style", "max-width: 8rem");
      var date = convertDate(response[i].dt);
      var dateHeader = $("<h5>" + date + "</h5>");

      var weatherIconEl = displayWeatherIcon(response[i].weather[0].icon);
      var temp = $("<p> Temp: " + response[i].temp.day + "&deg;F</p>");
      var humidity = $("<p>Humidity: " + response[i].humidity + "%</p>");
      
      day.append(dateHeader, weatherIconEl, temp, humidity);
      forecastDiv.append(day);
    }
  }

  // Function - Converts the Date Format
  function convertDate(date) {
    var dateConversion = new Date(date * 1000);
    date =
      dateConversion.getMonth() +
      "/" +
      dateConversion.getDate() +
      "/" +
      dateConversion.getFullYear();
    return date;
  }

  // Function - Creates the UV Index Header, Sets the Background Color, and Displays it on the App
  function displayUVIndex(uvIndex) {
    var uvIndexHeader = $("<p>UV Index: </p>");
    var uvIndexText = $("<span id='uvIndex'>" + uvIndex + "</span>");

    uvIndexHeader.text("UV Index: ").append(uvIndexText);
    if (uvIndex < 3) {
      uvIndexText.attr("style", "background-color: green");
    } else if (uvIndex < 6) {
      uvIndexText.attr("style", "background-color: yellow");
    } else if (uvIndex < 8) {
      uvIndexText.attr("style", "background-color: orange");
    } else if (uvIndex < 11) {
      uvIndexText.attr("style", "background-color: red");
    } else {
      uvIndexText.attr("style", "background-color: purple");
    }
    weatherDiv.append(uvIndexHeader);
  }

  // Function - Calls the APIs
  function ajax(userCity) {
    weatherDiv.empty();
    forecastDiv.empty();

    queryURL =
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
        displayCurrentWeather(response2, userCity);
        displayForecastWeather(response2.daily);
      });
    });
  }

  // Function - Displays Previously Searched Cities
  function createPreviousCities(userCity) {
    var previousCitiesBtn = $("<button class='list-group-item'></button");
    previousCitiesBtn.text(userCity);
    previousCitiesDiv.append(previousCitiesBtn);

    previousCitiesBtn.on("click", function (event) {
      userCity = $(this).text();
      ajax(userCity);
    });
  }

  // Calls getLocalStorage Function
  getLocalStorage();

  // Event Listener - Listens to the Search Button
  searchBtn.on("click", function (event) {
    event.preventDefault();

    userCity = userInput.val();

    if (userCity !== "" && userCityArray.includes(userCity) === false) {
      ajax(userCity);
      userCityArray.push(userCity);
      localStorage.setItem("City", JSON.stringify(userCityArray));
      createPreviousCities(userCity);
    }
  });
});
