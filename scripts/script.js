const apiKey = "ef530fc0919d4b27adc122308230307";
const form = document.getElementById("weatherForm");
const locationInput = document.getElementById("locationInput");
// const aqiInput = document.getElementById("aqi");
const weatherResult = document.getElementById("weatherResult");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    weatherResult.classList.remove('showed-up');

    const location = locationInput.value;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("API request failed");
            }
            return response.json();
        })
        .then(data => {
            // Check if the API returned an error
            if (data.error) {
                throw new Error(data.error.message);
            }
            // Extract and use the data as needed
            const { current, location } = data
            const { temp_c, temp_f, condition, wind_mph, wind_kph, humidity, vis_km } = current;
            const { country, lat, localtime, localtime_epoch, lon, name, region, tz_id } = location;

            // Display the weather result
            weatherResult.classList.remove('warning');
            weatherResult.classList.add('showed-up');
            weatherResult.innerHTML = cardComponent(data);
        })
        .catch(error => {
            // Handle the error
            weatherResult.classList.add('showed-up');
            weatherResult.classList.add('warning');
            weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error("Error fetching weather data:", error);
        });
});


function cardComponent(data) {
    const { current, location } = data
    const { temp_c, temp_f, condition, wind_mph, wind_kph, humidity, vis_km } = current;
    const { country, lat, localtime, localtime_epoch, lon, name, region, tz_id } = location;
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
                <spn class="value">${wind_mph} mph (${wind_kph} kph)</spn>
            </div>
            <div class="rest-input">
                <span class="label">WiHumiditynd</span>
                <spn class="value">${humidity}%</spn>
            </div>
            <div class="rest-input">
                <span class="label">Visibility</span>
                <spn class="value">${vis_km}km</spn>
            </div>
        </div>`;
}