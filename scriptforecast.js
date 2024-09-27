//These constants are used to construct the url where weather forecasts
//are fetched from the meteo api.
//Vaset
const vaset = 0;
const vasetLatitude = 60.995828;
const vasetLongitude = 8.989514;
//Beitostølen
const beitostølen = 1;
const beitostølenLatitude = 61.246563;
const beitostølenLongitude = 8.906943;
//Tonsåsen
const tonsåsen = 2;
const tonsåsenLatitude = 60.857038;
const tonsåsenLongitude = 9.624773;
//Tyinkrysset
const tyinkrysset = 3;
const tyinkryssetLatitude = 61.203945;
const tyinkryssetLongitude = 8.236714;
//Grimstad
const grimstad = 4;
const grimstadLatitude = 58.341591;
const grimstadLongitude = 8.565873;
//Sandvika
const sandvika = 5;
const sandvikaLatitude = 59.893672;
const sanvikaLongitude = 10.576392;

//used to keep track of when the getCurrenWeatherFromMeteo() can fetch new weather data.
let loading = false;
let url = "";
//Array of the locations used to coordinate the construction of urls,
//and ensure that the locations of each weather data is loaded in the correct order.
const locations = [vaset, beitostølen, tonsåsen, tyinkrysset, grimstad, sandvika];

//Fetches weather data for 6 locations.
//When all data is gathered the function calls updateCurrentWeatherForHtmlSection
//to correctly order the weather data to be displayed on the website page.
function getCurrentWeatherFromMeteo() {
    loading = true;
    let i = 0;
    //Holds all the fetched weather data for each location.
    let weatherDataArray = [];
    //Fetch weather data for each location.
    locations.forEach(loc => {
        const locationName = constructUrlForCurrentWeather(loc);
        fetch(url)
        .then(response => {
            if(!response.ok) {
                throw new Error('HTTP error! Could not fetch weather data from api.');
            }
            return response.json();
            //Collect the data that was fetched.
        }) .then(weatherData => {
                weatherDataArray.push({
                    index: loc,
                    location: locationName,
                    weatherData: weatherData
                })
                //If all the locations have been processed, the neccessary html structure
                //can be created and initialized with the correct data.
                i++;
                if (i == locations.length) {
                    weatherDataArray.sort((a, b) => a.index - b.index);
                    updateCurrentWeatherForHtmlSection(weatherDataArray);
                    loading = false;
                }
        }) .catch(error => {
            console.error('Error while fetching weather data from api.', error);
            //If an error occur, the counter is still incremented, so that
            //the function know when all fetches are done and the data can
            //be displayed.
            i++;
            if (i == locations.length) {
                weatherDataArray.sort((a, b) => a.index - b.index);
                updateCurrentWeatherForHtmlSection(weatherDataArray);
                loading = false;
            }
        });
    });
}

//Constructs html elements needed and fills in the correct information
//in order for the weather data to be displayed on the website.
function updateCurrentWeatherForHtmlSection(fetchedWeatherData) {
    const htmlPlaceholder = document.getElementById("forecasts");

    checkIfHtmlPlaceholderExist(htmlPlaceholder);

    fetchedWeatherData.forEach(weatherElement => {

        const htmlforecastDiv = document.createElement('div');
        htmlforecastDiv.classList.add('forecastforlocation');

        const heading = document.createElement('h2');
        heading.textContent = `Location: ${weatherElement.location}`;

        const temperature = document.createElement('p');
        temperature.textContent = `Temperature: ${weatherElement.weatherData.current_weather.temperature} degC`;

        const windspeed = document.createElement('p');
        windspeed.textContent = `Windspeed: ${weatherElement.weatherData.current_weather.windspeed} Km/h`;

        const windDirection = document.createElement('p');
        windDirection.textContent = `Wind Direction: ${weatherElement.weatherData.current_weather.winddirection} deg`;

        const time = document.createElement('p');
        time.textContent = `Time: ${weatherElement.weatherData.current_weather.time}`;

        htmlforecastDiv.appendChild(heading);
        htmlforecastDiv.appendChild(temperature);
        htmlforecastDiv.appendChild(windspeed);
        htmlforecastDiv.appendChild(windDirection);
        htmlforecastDiv.appendChild(time);

        htmlPlaceholder.appendChild(htmlforecastDiv);
        
    })
}

//Checks to see if the correct html element exists in the html file.
function checkIfHtmlPlaceholderExist(htmlPlaceholder) {
    if (!htmlPlaceholder) {
        console.error('No element found with id "forecasts" in HTML file');
        return;
    }
}

//Constructs the correct url to fetch data from, based on location codes.
function constructUrlForCurrentWeather(code) {
    let currentLocation = "";
    const urlSectionOne = `https://api.open-meteo.com/v1/forecast?latitude=`;
    const urlSectionTwo = `&longitude=`;
    const urlSectionThree = `&current_weather=true`;
    if(code == 0) {
        currentLocation = "Vaset";
        url = urlSectionOne + vasetLatitude 
    + urlSectionTwo + vasetLongitude + urlSectionThree;
    } if (code == 1) {
        currentLocation = "Beitostølen";
        url = urlSectionOne + beitostølenLatitude 
    + urlSectionTwo + beitostølenLongitude + urlSectionThree;
    } if (code == 2) {
        currentLocation = "Tonsåsen";
        url = urlSectionOne + tonsåsenLatitude 
    + urlSectionTwo + tonsåsenLongitude + urlSectionThree;
    } if (code == 3) {
        currentLocation = "Tyinkrysset";
        url = urlSectionOne + tyinkryssetLatitude 
    + urlSectionTwo + tyinkryssetLongitude + urlSectionThree;
    } if (code == 4) {
        currentLocation = "Grimstad";
        url = urlSectionOne + grimstadLatitude 
    + urlSectionTwo + grimstadLongitude + urlSectionThree;
    } if (code == 5) {
        currentLocation = "Sandvika";
        url = urlSectionOne + sandvikaLatitude 
    + urlSectionTwo + sanvikaLongitude + urlSectionThree;
    }

    return currentLocation;
}

//If the div element holding forecast already contain other html elements,
//these are removed before adding new updated data by calling getCurrentWeatherFromMeteo()
function refreshWeatherData() {
    var div = document.getElementById('forecasts');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    getCurrentWeatherFromMeteo();
}

document.addEventListener("DOMContentLoaded", () => {
    refreshWeatherData();
    //refreshes weather data every 60s
    setInterval('refreshWeatherData()', 60000);
});