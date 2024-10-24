function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "86ff9a97ce73e8cbe229229aa94af148"; // Thay thế bằng API key của bạn

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {
            // Kiểm tra xem geoData có tồn tại và có dữ liệu không
            if (!geoData || geoData.length === 0) {
                document.getElementById("weatherInfo").innerHTML = "<p>City not found!</p>";
                return;
            }

            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (data.cod !== "404" && data.sys && data.sys.country) {
                const weatherInfo = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Pressure: ${data.main.pressure} hPa</p>
                `;
                document.getElementById("weatherInfo").innerHTML = weatherInfo;

                // Thêm phần gợi ý trang phục và sức khỏe
                const suggestions = getSuggestions(data.main.temp, data.weather[0].main);
                document.getElementById("suggestions").innerHTML = suggestions;
            } else {
                document.getElementById("weatherInfo").innerHTML = "<p>City not found or invalid API key!</p>";
            }
        })
        .catch(error => {
            document.getElementById("weatherInfo").innerHTML = "<p>Error fetching data!</p>";
            console.error(error);
        });
}

// Hàm để đưa ra gợi ý về trang phục, phụ kiện và sức khỏe
function getSuggestions(temp, weatherCondition) {
    let outfitSuggestion = "";
    let healthAdvice = "";

    if (temp < 10) {
        outfitSuggestion = "Wear a heavy coat, scarf, and gloves. Stay warm!";
        healthAdvice = "It's cold outside. Make sure to dress warmly to avoid catching a cold.";
    } else if (temp >= 10 && temp < 20) {
        outfitSuggestion = "Wear a jacket and consider bringing a scarf.";
        healthAdvice = "The weather is cool. You should stay warm and be careful when going outside.";
    } else if (temp >= 20 && temp < 30) {
        outfitSuggestion = "A light shirt or T-shirt will be comfortable.";
        healthAdvice = "The weather is pleasant. Make sure to stay hydrated.";
    } else if (temp >= 30) {
        outfitSuggestion = "Wear light clothing like shorts and a T-shirt.";
        healthAdvice = "It's hot outside. Stay hydrated and avoid the sun during peak hours.";
    }

    // Gợi ý dựa trên điều kiện thời tiết
    if (weatherCondition === "Rain") {
        outfitSuggestion += " Don't forget to bring an umbrella!";
        healthAdvice += " Avoid staying in the rain too long to prevent getting sick.";
    } else if (weatherCondition === "Snow") {
        outfitSuggestion += " Wear a warm hat and boots for the snow.";
        healthAdvice += " Be careful on slippery roads.";
    } else if (weatherCondition === "Clear") {
        healthAdvice += " It's a sunny day! Wear sunscreen if you're outside for a long time.";
    }

    return `
        <h3>Outfit Suggestion:</h3>
        <p>${outfitSuggestion}</p>
        <h3>Health Advice:</h3>
        <p>${healthAdvice}</p>
    `;
}
