// Method A
// for APIs requiring the API key as an url parameter

const CONTAINER = document.getElementById('container');
const MY_API_KEY = "80d1993378fa9e47ffc9c7fec53fe1d2" // here add your API key
const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.870&lon=8.978&units=metric&appid=" + MY_API_KEY
// The parameter is indicated by the syntax &folowinginfo the API URL must include the API KEY which is defined in const MY_API_KEY

// This is the function that gets the data from the api
fetch(API_URL)
  .then(response => response.json())
// The arrow syntax is being used to parse the info from responce into a js format (expressing it as a function)
  .then(data => showData(data))
  .catch(error => showError(error));

function showData(data){
    // console.log(data)

    const weatherData = data.list;
    console.log(weatherData);

    for (let item of weatherData){
        // console.log(item)

        const temperature = item.main.temp;
        const tempFix = temperature + 2 * 30
        // console.log(temperature)
        // this is displaying the just the temp in the consile
        const time = item.dt_txt.substring(0, 16);

        const listItem = document.createElement('li');
        listItem.textContent = `${time} ${temperature}°`;

        let bgColor = tempToHSL(temperature);
        // if (temperature < 0){
        //     bgColor = 'blue'
        // }

        const tempBar = document.createElement('div')
        tempBar.classList.add = 'bar';
        tempBar.style.width = `${tempFix}px`
        tempBar.style.backgroundColor = bgColor;

        listItem.appendChild(tempBar);

        CONTAINER.appendChild(listItem);
    }
}

function showError(error){
    console.log(error)
}

function tempToHSL (temp, minTemp = -5, maxTemp = 30){

    temp = Math.max(minTemp, Math.min(maxTemp, temp))

    const hue = ((maxTemp - temp) / (maxTemp - minTemp)) * 240;

    return `hsl(${hue}, 80%, 50%)`;

}