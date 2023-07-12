const apiKey = "ef530fc0919d4b27adc122308230307";
const form = document.getElementById("weatherForm");
const locationInput = document.getElementById("locationInput");
const weatherForcastWrapper = document.getElementById("weather-forcast");
const weatherResult = document.getElementById("weatherResult");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission
    weatherResult.classList.remove('showed-up');

    const location = locationInput.value;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("API request failed");
        }
        const data = await response.json();

        // Check if the API returned an error
        if (data.error) {
            throw new Error(data.error.message);
        }

        // Extract and use the data as needed
        const { forecast, current, location } = data;

        // Display the weather result
        weatherResult.classList.remove('warning');
        weatherResult.classList.add('showed-up');
        weatherResult.innerHTML = cardComponent(current, location);
        weatherForcastWrapper.innerHTML = weatherForcast(forecast);
    } catch (error) {
        // Handle the error
        weatherResult.classList.add('showed-up');
        weatherResult.classList.add('warning');
        weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error("Error fetching weather data:", error);
    }
});

function cardComponent(current, location) {
    const { temp_c, temp_f, condition, wind_mph, wind_kph, humidity, vis_km } = current;
    const { country, region } = location;
    return `
        <span>
            <i class="bi bi-geo-alt"></i>
            <div class="location">
                <p>${country}</p>
                <p>${region}</p>
            </div>
        </span>
        <div class="weather-image">
            <div class="image-container">
                <img src=${condition?.icon}>
            </div>
            <div class="temprature">
                <h1>${temp_c}°C (${temp_f}°F)</h1>
                <h3>${condition?.text}</h3>
            </div>
        </div>
        <div class="rest">
            <div class="rest-input">
                <span class="label">Wind</span>
                <span class="value">${wind_mph} mph (${wind_kph} kph)</span>
            </div>
            <div class="rest-input">
                <span class="label">Humidity</span>
                <span class="value">${humidity}%</span>
            </div>
            <div class="rest-input">
                <span class="label">Visibility</span>
                <span class="value">${vis_km}km</span>
            </div>
        </div>`;
}

function weatherForcast({ forecastday }) {
    const Week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = (date) => {
        const todayDate = new Date().getDay();
        const getDay = new Date(date).getDay();
        return getDay === todayDate ? 'Now' : Week[getDay];
    };

    console.log(forecastday);

    return forecastday?.map((i) => `
        <div class="forcast">
            <span>
                <p>${day(i?.date)}</p>
            </span>
            <div class="forcast-image-container">
                <img src=${i?.day?.condition?.icon} />
            </div>
            <span class="temprature">
                <p>${i?.day?.avgtemp_c}°C</p>
            </span>
        </div>`
    ).join('');
}
