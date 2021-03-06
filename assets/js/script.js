// render search history buttons on page load
$(document).ready(function(){
    renderSearchHistory();
});

// container variables
var historyContainerEl = $("#history");
var currentForecastContainerEl = $("#currentForecast");
var fiveDayContainerEl = $("#fiveDayForecast");
var citySearchEl = $("#city-search");
var cityEl = $("#city-input");
var cityNameEl = $("#cityName");
var currentDate = moment().format("L");
var searchBtnEl = $("#searchBtn");

// api key variable
var apiKey = "a96c9b1d9614e04af3a4f5f32e7c7b3e";


// function to handle server side errors
var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

// function to get weather data from api calls using value from new city search or history button
var getWeather = function(currentCity){
    // format city search api url
    var cityQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial" + "&APPID=" + apiKey;
    
    fetch(cityQueryUrl).then(function(response){
        response.json().then(function(data){
            if (response.ok) {
                // console.log(data);

                // grab latitude and longitude values from api endpoints
                var lat = data.coord.lat;
                var long = data.coord.lon;
    
                // CURRENT DAY WEATHER //
                // format onecall api url with lat and long values, using imperial units
                var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=hourly,daily&appid=" + apiKey;
        
                fetch(apiUrl).then((response) => {
                    // if 200 (response ok)
                    if (response.ok) {
                        response.json().then((data) => {
                                // console.log(data);
    
                                // create new DOM elements for displaying current weather
                                var currentConditionsDiv = $("<div class='card bg-light shadow px-3 py-3'>");
                                var currentConditionsCardBody = $("<div class='card-body'>");
                                var cityNameTitle = $("<h2 class='card-title text-left history-btn'>");
                                // set card title to currentCity's value
                                cityNameTitle.text(currentCity);
                                var currentConditionsDate = $("<h5 class='card-title'>");
                                currentConditionsDate.text(currentDate);
                                var currentConditionsIcon = $("<img>");
                                var currentConditionsTemp = $("<p class='card-text mb-0'>");
                                var currentConditionsHumidity = $("<p class='card-text mb-0'>");
                                var currentConditionsWind = $("<p class='card-text mb-0'>");
                                var currentConditionsUvIndex = $("<p class='card-text mb-0'>");
                                var currentConditionsUvIndexSpan = $("<span>");
                                currentConditionsUvIndexSpan.attr("id", "uvIndex")
                                // icon code from data array
                                var iconcode = data.current.weather[0].icon;
            
                                // append new div to container, append new card to new div
                                currentForecastContainerEl.append(currentConditionsDiv);
                                currentConditionsDiv.append(currentConditionsCardBody);
                                
                                // append new elements to card body
                                currentConditionsCardBody.append(cityNameTitle);
                                currentConditionsCardBody.append(currentConditionsDate);
                                currentConditionsCardBody.append(currentConditionsIcon);
                                currentConditionsCardBody.append(currentConditionsTemp);
                                currentConditionsCardBody.append(currentConditionsHumidity);
                                currentConditionsCardBody.append(currentConditionsWind);
                                currentConditionsCardBody.append(currentConditionsUvIndex);
            
                                // icon attributes
                                currentConditionsIcon.attr("src", "https://openweathermap.org/img/w/" + iconcode + ".png");
                                currentConditionsIcon.attr("alt", data.current.weather[0].description);
                                currentConditionsIcon.attr("title", data.current.weather[0].description);
            
                                // temp attributes
                                currentConditionsTemp.text(data.current.temp);
                                currentConditionsTemp.prepend("Temp: ");
                                currentConditionsTemp.append("&deg;F");
            
                                // humidity attributes
                                currentConditionsHumidity.text(data.current.humidity);
                                currentConditionsHumidity.prepend("Humidity: ");
                                currentConditionsHumidity.append(" %");
            
                                // wind speed attributes
                                currentConditionsWind.text(data.current.wind_speed);
                                currentConditionsWind.prepend("Wind: ");
                                currentConditionsWind.append(" MPH");
            
                                // uv index attributes
                                var uvIndex = data.current.uvi;
                                currentConditionsUvIndex.prepend("UV Index: ");
                                currentConditionsUvIndexSpan.text(uvIndex);
                                currentConditionsUvIndex.append(currentConditionsUvIndexSpan);
    
    
                                // uv index attributes according to index scale from the UnitedStates EPA website
                                if (uvIndex < 3) {
                                    currentConditionsUvIndexSpan.attr("class", "text-light bg-success mx-1 px-2 py-1 rounded");
                                } else if (uvIndex > 3 && uvIndex < 5) {
                                    currentConditionsUvIndexSpan.attr("class", "text-light bg-warning mx-1 px-2 py-1 rounded");
                                } else if (uvIndex > 5){
                                    // add safety warning for any index above the moderate index
                                    var uvIndexWarning = $("<p class='fst-italic text-muted pb-0'>");
                                    uvIndexWarning.text("UV Warning: high risk of harm from unprotected sun exposure. Protection against skin and eye damage is needed.");
                                    currentConditionsUvIndexSpan.attr("class", "text-light bg-danger mx-1 px-2 py-1 rounded");
                                    currentConditionsUvIndex.append(uvIndexWarning);
                                }
    
                            });
                        } else {
                            // if error occurs
                            handleErrors();
                        }
                });

                // FIVE DAY FORECAST //
                // format five day forecast api url
                var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
            
                fetch(forecastApiUrl).then((response) =>{
                    if (response.ok) {
                        response.json().then((data) => {
                            // console.log(data);
                            // grab 5 concurrent days data from array, create cards with content
                            for (var i = 2; i < data.list.length; i+=8) {
                                var forecastDateString = moment(data.list[i].dt_txt).format("L");
                                // console.log(forecastDateString);
                
                                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3 mt-3'>");
                                var forecastCard = $("<div class='card bg-secondary bg-gradient shadow'>");
                                var forecastCardBody = $("<div class='card-body'>");
                                var forecastDate = $("<h5 class='card-title'>");
                                forecastDate.text(forecastDateString);
                                var forecastIcon = $("<img>");
                                var forecastTemp = $("<p class='card-text mb-0'>");
                                var forecastWind = $("<p class='card-text mb-0'>");
                                var forecastHumidity = $("<p class='card-text mb-0'>");
                
                
                                fiveDayContainerEl.append(forecastCol);
                                forecastCol.append(forecastCard);
                                forecastCard.append(forecastCardBody);
                
                                forecastCardBody.append(forecastDate);
                                forecastCardBody.append(forecastIcon);
                                forecastCardBody.append(forecastTemp);
                                forecastCardBody.append(forecastWind);
                                forecastCardBody.append(forecastHumidity);
                                
                                // icon attributes
                                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                                forecastIcon.attr("alt", data.list[i].weather[0].main);
                                forecastIcon.attr("title", data.list[i].weather[0].main);
    
    
                                // temp attributes
                                forecastTemp.text(data.list[i].main.temp);
                                forecastTemp.prepend("Temp: ");
                                forecastTemp.append("&deg;F");
    
                                // wind speed attributes
                                forecastWind.text(data.list[i].wind.speed);
                                forecastWind.prepend("Wind: ");
                                forecastWind.append(" MPH");
    
                                // humidity attributes
                                forecastHumidity.text(data.list[i].main.humidity);
                                forecastHumidity.prepend("Humidity: ");
                                forecastHumidity.append(" %");
                            }
                        })
                    } else {
                        handleErrors();
                    }
                })

                // send validated city name to saveCityName function
                saveCityName(currentCity);

            } else {
                // create card for message instead of alert
                var messageContainerEl = $("<div class='card bg-warning bg-gradient shadow px-3 py-3'>");
                var messageTitle = $("<h2 class='card-title text-center'>");
                messageTitle.text("Invalid Search Term")
                var messageContent = $("<p class='card-text mb-0'>");
                messageContent.text("Not a valid city search. Please check your spelling or try a different city.");

                messageContainerEl.append(messageTitle);
                messageContainerEl.append(messageContent);

                // append to container
                currentForecastContainerEl.append(messageContainerEl);
                // alert("NOT VALID CITY");
            }
        })
    });
};

// on city search, handle data and push to functions
var formSubmitHandler = function(event) {
    event.preventDefault();

    // clear old content
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");

    // get value from input, change to lowercase to avoid duplication errors further into functions
    var currentCity = cityEl.val().trim().toLowerCase();
    // console.log(currentCity);

    // clear old content
    cityEl.val("");

    // send value as parameter for getWeather
    getWeather(currentCity);
};

// save city name to localstorage
var saveCityName = function(currentCity){
    // grab city name
    var cityString = currentCity;

    // grab "cityHistoryArr" key from localstorage
    var cityHistoryArr = localStorage.getItem("cityHistoryArr");
    
    // load cityHistoryArr, if empty create empty array, otherwise parse data
    if (cityHistoryArr === null) {
        cityHistoryArr = [];
    } else {
        cityHistoryArr = JSON.parse(cityHistoryArr);
    }

    // check for duplicates in array, only push to array AND to generate button function if none found
    if (!cityHistoryArr.includes(cityString)) {
        cityHistoryArr.push(cityString);
        generateHistoryButton(currentCity);
        console.log("no duplicate found");
    } else {
        console.log("duplicate found");
    }

    var newSavedCity = JSON.stringify(cityHistoryArr);
    localStorage.setItem("cityHistoryArr", newSavedCity);
    // console.log(cityHistoryArr);
};

// generate buttons with city name function
var generateHistoryButton = function(currentCity) {
    
    // create button with id set to currentCity's value (city name)
    var historyBtn = $("<button>");
    historyBtn.attr("class", "btn btn-outline-secondary w-100 mb-2 history-btn");
    historyBtn.attr("type", "button");
    historyBtn.attr("id", currentCity);
    historyBtn.text(currentCity);
    // prepend new buttons to the top of the history container
    historyContainerEl.prepend(historyBtn);
};

// load search history function
var renderSearchHistory = function() {
    // get city name from localstorage, parse data
    var cityHistoryArr = localStorage.getItem("cityHistoryArr");
    cityHistoryArr = JSON.parse(cityHistoryArr);

    // if array is NOT empty, create buttons with name value from array
    if (cityHistoryArr !== null) {
        for (i = 0; i < cityHistoryArr.length; i++) {
            var historyBtn = $("<button>");
            historyBtn.attr("class", "btn btn-outline-secondary w-100 mb-2 history-btn");
            historyBtn.attr("type", "button");
            historyBtn.attr("id", cityHistoryArr[i]);
            historyBtn.text(cityHistoryArr[i]);
            historyContainerEl.prepend(historyBtn);
        };
    }
};

// EVENT HANDLERS //
// new city search
citySearchEl.on("submit", formSubmitHandler);
// searchBtnEl.on("click", formSubmitHandler);

// clear search history
$("#clearHistory").on("click", function(event){
    // clear localstorage
    localStorage.clear();

    // clear all content in containers
    historyContainerEl.html("");
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");
    // console.log("clear button clicked");
});

// clicking on city button in search history re-runs getWeather
$("#history").on("click", function(event){
    event.preventDefault();
    var targetEl = event.target;
    // console.log("history button clicked");
    
    // clear old content
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");

    // if button clicked matches class 'history-btn' (to avoid bubbling)
    if (targetEl.matches (".history-btn")) {
        // grab city name that was set as the button's id
        var currentCity = targetEl.getAttribute("id");
        // console.log(currentCity);
        
        // pass to getWeather to re-run call
        getWeather(currentCity);
    }
});
