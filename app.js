
// Function to update the weather display and forecast cards
function updateWeatherDisplay(response) {
    const header = document.querySelector('.weather-info__description');
    const cityDisplay = document.querySelector('.weather-info__city');
    const date = document.querySelector('.weather-info__date');
    const time = document.querySelector('.weather-info__time');
    const degree = document.querySelector('.weather-info__temperature');
    const image = document.querySelector('.weather-img');
    const displayDegree = document.querySelector('.weather-info__display');

    const formattedDate = formatDate(response.data.location.localtime);
    const formattedTime = formatTime(response.data.location.localtime);
    header.textContent = response.data.current.condition.text;
    cityDisplay.textContent = response.data.location.name;
    date.textContent = formattedDate;
    time.textContent = formattedTime;
    degree.textContent = `${response.data.current.temp_c}°C`;
    image.innerHTML = `<img src="${response.data.current.condition.icon}" >`;

    const forecastday = response.data.forecast.forecastday;

    // Clear existing forecast cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.remove());

    // Create new forecast cards
    for (const day of forecastday) {
        createCard(getDayOfWeek(day.date), day.day.maxtemp_c, day.day.mintemp_c, day.day.condition.icon);
    }

    // Add event listener to toggle between Celsius and Fahrenheit
    displayDegree.addEventListener('click', function () {
        if (displayDegree.textContent === 'Display °C') {
            displayDegree.textContent = 'Display °F';
            degree.textContent = `${response.data.current.temp_f}°F`;
        } else if (displayDegree.textContent === 'Display °F') {
            displayDegree.textContent = 'Display °C';
            degree.textContent = `${response.data.current.temp_c}°C`;
        }
    });
}

// Function to get weather data and update the display
const getData = async (city) => {
    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=3fcc144c19a04b2b9b2231613232207&q=${city}&days=7`);
        updateWeatherDisplay(response);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

const input = document.querySelector('.search-box-input');

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getData(input.value);
        input.value = '';
    }
});


getData("new york")


function createCard(dateDisplay, highTemp, lowTemp, imageDisplay) {
    const cardContainer = document.querySelector('.card-container')
    const newCard = document.createElement('div')
    newCard.classList.add('card')

    const date = document.createElement('p')
    date.classList.add('date')
    date.textContent = dateDisplay

    const high = document.createElement('p')
    high.classList.add('tem-high')
    high.textContent = `${highTemp} °C`

    const low = document.createElement('p')
    low.classList.add('low-high')
    low.textContent = `${lowTemp} °C`

    const image = document.createElement('p')
    image.classList.add('image')
    image.innerHTML = `<img src="${imageDisplay}" >`

    newCard.append(date, high, low, image)
    cardContainer.append(newCard)

}


function formatDate(dateTimeStr) {
    const date = new Date(dateTimeStr);

    const optionsDate = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: '2-digit'
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);

    return formattedDate;
}

function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);

    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);

    return formattedTime;
}


function getDayOfWeek(dateString) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}