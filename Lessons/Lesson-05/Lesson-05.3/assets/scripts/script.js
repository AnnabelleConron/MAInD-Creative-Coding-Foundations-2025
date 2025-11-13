// Method A
// for APIs requiring the API key as an url parameter

const MY_API_KEY = "80d1993378fa9e47ffc9c7fec53fe1d2" // here add your API key
const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.870&lon=8.978&units=metric&appid=" + MY_API_KEY

fetch(API_URL)
  .then(response => response.json())
  .then(data => displayData(data))
  .catch(error => displayError(error));

function displayData(data){
    console.log(data)

    const FORECAST = data.list;
    console.log(FORECAST)

    const FILTERED = data.filter( (obj) => obj.dt_txt > 12 && obj.dt_txt < 18);
    console.log(FILTERED.length)

    for (let item of FORECAST){
        const DATE_TIME = item.dt_txt;

        const DATE = DATE_TIME.substring(0,10) //to get just the date
        const TIME = DATE_TIME.substring(11,13) //to get just the date

        const TEMP = item.main.temp;

        console.log(DATE, TIME, TEMP)

    }

}

function displayError(error){
    console.log(error)
}