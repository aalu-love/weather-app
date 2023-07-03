const apiKey = "ef530fc0919d4b27adc122308230307";
const form = document.getElementById("weatherForm");
const locationInput = document.getElementById("locationInput");
// const aqiInput = document.getElementById("aqi");
const weatherResult = document.getElementById("weatherResult");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

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
            weatherResult.style.display = "block"; // Show the weather result element
            weatherResult.innerHTML = `
        <p>Temperature: ${temp_c}°C (${temp_f}°F)</p>
        <p>Condition: ${condition?.text}</p>
        <p>Wind: ${wind_mph} mph (${wind_kph} kph)</p>
        <p>Humidity: ${humidity}%</p>
        <p>Visibility: ${vis_km}km</p>
        <p>Weather: <img src=${condition?.icon} /></p>
        <p>Country: ${country}</p>
        <p>Location: ${name}, ${region}</p>
      `;
        })
        .catch(error => {
            // Handle the error
            weatherResult.style.display = "block"; // Show the weather result element
            weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error("Error fetching weather data:", error);
        });
});
