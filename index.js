// 1. App Layout
    // Aside (Left) - Search for a City
        // Loads Bars of previously search cities
    // Card - City's Weather for Today
        // Left-Aligned
        // Header - City (Date) Weather Icon
        // Temperature
        // Humidity
        // Wind Speed
        // UV Index - In a Box
    // 5-Day Forecast
        // 5 Blue Boxes with White Text
        // Month/Day/Year
        // Weather Icon
        // Temp: 
        // Humidity: 
// 2. OpenWeather API Research
    // Section - How to Start
    // City Search
    // City for Today
        // City Name, Today's Date, Weather Icon
        // Temperature
        // Humidity
        // Wind Speed
        // UV Index - In a Box
    // 5 Day Forecast
        // Date
        // Weather Icon
        // Temp:
        // Humidity
// 3. Functionality
    // AJAX Call - Weather for City
    // Add what the user searches into local storage and display below search bar
    // UV Index Color - Favorable, Moderate, or Severe Weather Conditions
    // User clicks previous city in search history, get from local storage and update screen
    // When app opens, last searched city forecast displays

$(document).ready(function(){

    // Variables
    var APIkey = "a7ccd0a4c74bf45b3a12a4b9c719a4f6";
    
    // Element Variables
    var asideDiv = $("#asideDiv");
    var userInput = $("#userInput");

    var searchBtn = $("#searchBtn");

    var weatherDiv = $("#weatherDiv");
    var forecastDiv = $("#forecastDiv");

    // Function Definitions

    // Function Calls
    function displayCurrentWeather(response){
        var cityHeader = $("<h3>");
        cityHeader.text(response.name);
        weatherDiv.append(cityHeader);
    }

    // Event Listeners
    searchBtn.on("click", function(event){
        event.preventDefault();
        
        var userCity = userInput.val()
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity +"&appid=" + APIkey;
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response){
            console.log(response);
            displayCurrentWeather(response);
        });
    })

});