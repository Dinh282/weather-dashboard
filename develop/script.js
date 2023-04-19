$(function(){

var APIKey = "53889860b61f2d9730863adfc666746b";
var city;
var queryURL;
var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

displayCityList();

// event listener to handle cities that user are searching up.
$("#submit-btn").on('click', function(event) {
    event.preventDefault();
    city = $(this).siblings("#city").val().trim();
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    checkValidCity();

})

// event listeners to handle user's clicks on cities from search history list
$(".city-list").on("click", "button", function(){
    city = $(this).text();
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    checkValidCity();
})



function displayCurrentForcast(response) {
    
    var city = response.name + " ";

    //OpenWeather API dt value is the number of seconds since January 1, 1970(Unix epoch) in UTC. We need to multiply it
    // by 1000 to convert it to milliseconds since the Unix epoch, to meet the format of JS Data constructor. 
    var date = new Date(response.dt * 1000).toLocaleDateString('en-US', {month: '2-digit', day:'2-digit', year: 'numeric'});
    //the weather of Openweather response is an array of weather conditions for that city. the first index [0]
    // is of the current weather. 
    var iconUrl = ' ' + 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png';
    // we can add "&units=imperial" to our queryURL to get the units in F since openweather provides the temp in F.
    // by default, temperature is given in Kelvin. We could always convert the temp from Kelvin to F with a formula:
    // ((response.main.temp - 273.15) * (9/5) + 32).toFixed(2);
    var tempF = "Temperature: " + response.main.temp + " °F";
    var windSpeed = "Windspeed: " + response.wind.speed + " MPH";
    var humidity = "Humidity: " + response.main.humidity + " %";
    
    const displayCity = $("<div>")
    .addClass("d-inline-block ")
    .text(city);

    const displayDate = $("<div>")
    .addClass("d-inline-block m-2")
    .text("(" + date + ")");

    const displayIcon = $("<img>")
    .addClass("d-inline-block")
    .attr('src', iconUrl);

    const displayTemp = $("<div>")
    .addClass("col-12")
    .text(tempF);

    const displayWind = $("<div>")
    .addClass("col-12")
    .text(windSpeed);

    const displayHumidity = $("<div>")
    .addClass("col-12")
    .text(humidity);

    $("#current-city").empty();
    $("#current-city-weather").empty();
    $("#current-city").append(displayCity); 
    $("#current-city").append(displayDate);
    $("#current-city").append(displayIcon);
    $("#current-city-weather").append(displayTemp);
    $("#current-city-weather").append(displayWind);
    $("#current-city-weather").append(displayHumidity);

}


function displayCityList() {
    //.empty() removes all  all child nodes of the set of matched elements from the DOM.
    //if we don't remove, everytime displayCityList is called, cities from the
    // array will be added, resulting in duplication of cities.
    $(".city-list").empty();
    $.each(cityList, function (i, value) {

    const cityBtn = $('<button>')
    .addClass('btn btn-secondary btn-sm col-12 mt-1')
    .attr({"id": 'city-btn'})
    .text(value);

    $(".city-list").append(cityBtn);

    });
}


function checkValidCity () {

$.ajax({
 url:queryURL,
 method: 'GET',
success:function (response){

    if(!cityList.includes(city) ){
        cityList.push(city);
        }
        
    localStorage.setItem("cityList", JSON.stringify(cityList));
    displayCityList();
    displayCurrentForcast(response);
    // displayFiveDayForcast();

    // console.log(response);
    // console.log(queryURL);
},
error: function() {
    alert("Not a valid city or error obtaining weather information.")
}

});

}












});