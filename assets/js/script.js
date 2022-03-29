// container variables
var historyContainerEl = $("#history");
var currentForecastContainerEl = $("#currentForecast");
var fiveDayContainerEl = $("#fiveDayForecast");
var citySearchEl = $("#city-search");
var cityEl = $("#city-input");
var cityNameEl = $("#cityName");
var dateSpan = $("#date");
var currentDate = moment().format("L");

// api key variable
var apiKey = "a96c9b1d9614e04af3a4f5f32e7c7b3e"

var getFiveDayForecast = function(latitude, longitude) {
    var lat = latitude;
    var long = longitude;

    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then((response) =>{
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
    })

}

var getCurrentConditions = function(latitude, longitude){
    var lat = latitude;
    var long = longitude;
    // console.log(latitude, longitude);

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=hourly,daily&appid=" + apiKey;

    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                    // console.log(data);
                    var currentConditionsDiv = $("<div class='bg-light shadow px-3 py-3'>");
                    currentConditionsDiv.append(currentDate);

                    var currentTemp = $("<p>")

                    var temp = data.current.temp;
                    var humidity = data.current.humidity;
                    var windSpeed = data.current.wind_speed;
                    var uvIndex = data.current.uvi;
                    var iconcode = data.current.weather[0].icon;
                    // console.log(temp);
                    // console.log(humidity);
                    // console.log(windSpeed);
                    // console.log(uvIndex);
                    
                    // display in dom
                    // var currentConditionsDiv = document.createElement("div");

                    // currentConditionsDiv.setAttribute("class", "bg-light shadow px-3 py-3");
                    currentConditionsDiv.innerHTML =
                    "<img src='https://openweathermap.org/img/w/" + iconcode + ".png' alt='" + data.current.weather[0].description +"' /><em> " +
                    "</em><p><strong>Temperature:</strong> " + temp + 
                    "</p><p><strong>Humidity:</strong> " + humidity +
                    "</p><p><strong>Wind Speed:</strong> " + windSpeed +
                    "</p><p><strong>UV Index:</strong> " + uvIndex + "</p>";
                    currentForecastContainerEl.append(currentConditionsDiv);
                });
            } else {
                handleErrors();
            }
        });
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // clear old content
    currentForecastContainerEl.html("");
    fiveDayContainerEl.html("");

    // get value from input
    var currentCity = cityEl.val().trim();
    cityNameEl.textContent = currentCity + currentDate;

    if (currentCity) {
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial" + "&APPID=" + apiKey;

        fetch(apiUrl).then(function(response){
            response.json().then(function(data){
                // grab latitude and longitude from response
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                // pass lat/lon coordinates to both weather functions
                getCurrentConditions(latitude, longitude);
                getFiveDayForecast(latitude, longitude);

                // add city name to current forecast container
                var cityName = document.createElement("h2");
                cityName.setAttribute("class", "text-right font-weight-bold");
                cityName.textContent = currentCity;
                currentForecastContainerEl.append(cityName);
            })
        });
        renderSearchHistory(currentCity);
        // clear old content
        cityEl.val("");
    } else {
        alert("Please enter a valid city");
    }
};

var renderSearchHistory = function(currentCity) {
    var cityArray = [];
    cityArray.push(currentCity);
    console.log(cityArray);

    // create button with city name to re-run getCurrentConditions
    var searchCityBtn = document.createElement("button");
    searchCityBtn.className = "btn btn-secondary mt-2 w-100";
    searchCityBtn.textContent = currentCity;
    // console.log(currentCity);
    historyContainerEl.append(searchCityBtn);
};

// EVENT HANDLERS //
// new city search
citySearchEl.on("submit", formSubmitHandler);

// clear search history
$("#clearHistory").on("click", function(event){
    localStorage.clear();
    // clear #history container
    historyContainerEl.html("");
    console.log("clear button clicked");
});