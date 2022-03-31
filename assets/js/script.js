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
// var cityHistoryArr = [];


// api key variable
var apiKey = "a96c9b1d9614e04af3a4f5f32e7c7b3e"


// function to handle server side errors
var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

var getWeather = function(currentCity){
    var cityQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial" + "&APPID=" + apiKey;
    
    // get latitude and longitude from api
    fetch(cityQueryUrl).then(function(response){
        response.json().then(function(data){
            var lat = data.coord.lat;
            var long = data.coord.lon;

            var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=hourly,daily&appid=" + apiKey;
    
            // current day weather
            fetch(apiUrl).then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                            console.log(data);
                            // create new DOM elements
                            var currentConditionsDiv = $("<div class='card bg-light shadow px-3 py-3'>");
                            var currentConditionsCardBody = $("<div class='card-body'>");
                            var cityNameTitle = $("<h2 class='card-title text-left'>");
                            cityNameTitle.text(currentCity);
                            var currentConditionsDate = $("<h5 class='card-title'>");
                            currentConditionsDate.text(currentDate);
                            var currentConditionsIcon = $("<img>");
                            var currentConditionsTemp = $("<p class='card-text mb-0'>");
                            var currentConditionsHumidity = $("<p class='card-text mb-0'>");
                            var currentConditionsWind = $("<p class='card-text mb-0'>");
                            var currentConditionsUvIndex = $("<p class='card-text mb-0'>");
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
        
                            // wind attributes
                            currentConditionsWind.text(data.current.wind_speed);
                            currentConditionsWind.prepend("Wind: ");
                            currentConditionsWind.append(" MPH");
        
                            // uv index attributes
                            currentConditionsUvIndex.text(data.current.uvi);
                            currentConditionsUvIndex.prepend("UV Index: ");
                        });
                    } else {
                        handleErrors();
                    }
            });
    
            // five day forecast weather
            var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
        
            fetch(forecastApiUrl).then((response) =>{
                if (response.ok) {
                    response.json().then((data) => {
                        // console.log(data);
                        for (var i = 2; i < data.list.length; i+=8) {
                            var forecastDateString = moment(data.list[i].dt_txt).format("L");
                            // console.log(forecastDateString);
            
                            var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3 mt-3'>");
                            var forecastCard = $("<div class='card bg-light shadow'>");
                            var forecastCardBody = $("<div class='card-body'>");
                            var forecastDate = $("<h5 class='card-title'>");
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
                            
                            forecastIcon.attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                            forecastIcon.attr("alt", data.list[i].weather[0].main);
                            forecastDate.text(forecastDateString);
                            forecastTemp.text(data.list[i].main.temp);
                            forecastTemp.prepend("Temp: ");
                            forecastTemp.append("&deg;F");
                            forecastWind.text(data.list[i].wind.speed);
                            forecastWind.prepend("Wind: ");
                            forecastWind.append(" MPH");
                            forecastHumidity.text(data.list[i].main.humidity);
                            forecastHumidity.prepend("Humidity: ");
                            forecastHumidity.append(" %");
                        }
                    })
                } else {
                    handleErrors();
                }
            })
        })
    });
};

// on city search, handle data and push to functions
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // clear old content
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");

    // get value from input
    var currentCity = cityEl.val().trim();
    console.log(currentCity);

    // clear old content
    cityEl.val("");

    // send value as parameter for getWeather and generateHistoryButton
    getWeather(currentCity);

    generateHistoryButton(currentCity);
    
    // save city name to localstorage
    saveCityName(currentCity);

};

var saveCityName = function(currentCity){

    var cityString = currentCity;

    // create object for city name
    var savedCity = {
        name: cityString
    }

    var cityHistoryArr = localStorage.getItem("cityHistoryArr");

    if (cityHistoryArr === null) {
        cityHistoryArr = [];
    } else {
        cityHistoryArr = JSON.parse(cityHistoryArr);
    }

    cityHistoryArr.push(savedCity);
    // console.log(cityHistoryArr);

    var newSavedCity = JSON.stringify(cityHistoryArr);
    localStorage.setItem("cityHistoryArr", newSavedCity);

    // console.log(cityHistoryArr);



    // localStorage.setItem("cityStorage", JSON.stringify(cityHistoryArr));
};

var generateHistoryButton = function(currentCity) {
    var historyBtn = $("<button>");
    historyBtn.attr("class", "btn btn-outline-secondary w-100 mb-2 history-btn");
    historyBtn.attr("type", "button");
    historyBtn.attr("id", currentCity);
    historyBtn.text(currentCity);
    historyContainerEl.prepend(historyBtn);
};

// load search history function
var renderSearchHistory = function() {

    // get city name from localstorage
    var cityHistoryArr = localStorage.getItem("cityHistoryArr");
    cityHistoryArr = JSON.parse(cityHistoryArr);

    if (cityHistoryArr !== null) {
        for (i = 0; i < cityHistoryArr.length; i++) {
            var historyBtn = $("<button>");
            historyBtn.attr("class", "btn btn-outline-secondary w-100 mb-2 history-btn");
            historyBtn.attr("type", "button");
            historyBtn.attr("id", cityHistoryArr[i].name);
            historyBtn.text(cityHistoryArr[i].name);
            historyContainerEl.prepend(historyBtn);
        };
    }
};


// EVENT HANDLERS //
// new city search
citySearchEl.on("submit", formSubmitHandler);
searchBtnEl.on("click", formSubmitHandler);

// clear search history
$("#clearHistory").on("click", function(event){
    // clear localstorage
    localStorage.clear();

    // clear all content in containers
    historyContainerEl.html("");
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");
    console.log("clear button clicked");
});

// clicking on city button in search history re-runs getWeather
$("#history").on("click", function(event){
    event.preventDefault();
    console.log("history button clicked");

    // clear old content
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");

    // get city name from set id on button
    var currentCity = $(this).children().attr("id");

    console.log(currentCity);

    // pass to getWeather to re-run call
    getWeather(currentCity);
});
