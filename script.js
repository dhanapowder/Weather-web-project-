// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const languageSelect = document.getElementById('languageSelect');
const unitToggle = document.getElementById('unitToggle');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');
const recentEvents = document.getElementById('recentEvents');
const weatherAnimation = document.getElementById('weatherAnimation');
const loadingOverlay = document.getElementById('loadingOverlay');
const weatherMap = document.getElementById('weatherMap');

// Weather data elements
const locationName = document.getElementById('locationName');
const locationDetails = document.getElementById('locationDetails');
const currentTemp = document.getElementById('currentTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const airQuality = document.getElementById('airQuality');
const uvIndex = document.getElementById('uvIndex');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const precipitation = document.getElementById('precipitation');
const expectedRainfall = document.getElementById('expectedRainfall');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const hourlyForecast = document.getElementById('hourlyForecast');
const dailyForecast = document.getElementById('dailyForecast');

// App state
let isCelsius = true;
let currentLocation = { name: "Nashik, Maharashtra", lat: 19.9975, lng: 73.7898 };
let events = JSON.parse(localStorage.getItem('weatherEvents')) || [];
let alarmTimeouts = [];
let map = null;
let mapMarker = null;

// API Configuration
const OPENWEATHER_API_KEY = '6fe79a4953f77345c2e67563564ae22a'; // Replace with your OpenWeather API key

// Crop database with seasonal information
const cropDatabase = {
    "wheat": { 
        name: "Wheat", 
        emoji: "🌾", 
        season: "Rabi (Winter)",
        tempRange: { min: 10, max: 25 },
        rainfall: "Moderate (500-700mm)",
        soil: "Well-drained loamy soil",
        duration: "120-150 days"
    },
    "rice": { 
        name: "Rice", 
        emoji: "🍚", 
        season: "Kharif (Monsoon)",
        tempRange: { min: 20, max: 35 },
        rainfall: "High (1000-2000mm)",
        soil: "Clayey loam with good water retention",
        duration: "90-150 days"
    },
    "corn": { 
        name: "Corn", 
        emoji: "🌽", 
        season: "Kharif (Monsoon)",
        tempRange: { min: 15, max: 35 },
        rainfall: "Moderate (600-1000mm)",
        soil: "Well-drained fertile soil",
        duration: "80-100 days"
    },
    "cotton": { 
        name: "Cotton", 
        emoji: "🧵", 
        season: "Kharif (Monsoon)",
        tempRange: { min: 20, max: 35 },
        rainfall: "Moderate (500-800mm)",
        soil: "Black cotton soil",
        duration: "150-180 days"
    },
    "sugarcane": { 
        name: "Sugarcane", 
        emoji: "🎋", 
        season: "Year-round",
        tempRange: { min: 20, max: 35 },
        rainfall: "High (1500-2500mm)",
        soil: "Deep rich loamy soil",
        duration: "12-18 months"
    },
    "soybean": { 
        name: "Soybean", 
        emoji: "🫘", 
        season: "Kharif (Monsoon)",
        tempRange: { min: 15, max: 30 },
        rainfall: "Moderate (600-800mm)",
        soil: "Well-drained loamy soil",
        duration: "90-120 days"
    },
    "potato": { 
        name: "Potato", 
        emoji: "🥔", 
        season: "Rabi (Winter)",
        tempRange: { min: 10, max: 25 },
        rainfall: "Low to Moderate (500-700mm)",
        soil: "Sandy loam soil",
        duration: "80-120 days"
    },
    "tomato": { 
        name: "Tomato", 
        emoji: "🍅", 
        season: "Year-round",
        tempRange: { min: 15, max: 30 },
        rainfall: "Moderate (600-900mm)",
        soil: "Well-drained sandy loam",
        duration: "90-120 days"
    }
};

// Location database for search
const locationDatabase = {
    "mumbai": { name: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777 },
    "pune": { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
    "delhi": { name: "Delhi", lat: 28.7041, lng: 77.1025 },
    "bangalore": { name: "Bangalore, Karnataka", lat: 12.9716, lng: 77.5946 },
    "chennai": { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    "kolkata": { name: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639 },
    "hyderabad": { name: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
    "ahmedabad": { name: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714 },
    "jaipur": { name: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873 },
    "lucknow": { name: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    "varanasi": { name: "Varanasi, Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
    "jaunpur": { name: "Jaunpur, Uttar Pradesh", lat: 25.7539, lng: 82.6869 },
    "gorakhpur": { name: "Gorakhpur, Uttar Pradesh", lat: 26.7606, lng: 83.3732 },
    "allahabad": { name: "Prayagraj, Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
    "kanpur": { name: "Kanpur, Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
    "nagpur": { name: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882 },
    "indore": { name: "Indore, Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
    "bhopal": { name: "Bhopal, Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    "patna": { name: "Patna, Bihar", lat: 25.5941, lng: 85.1376 },
    "ranchi": { name: "Ranchi, Jharkhand", lat: 23.3441, lng: 85.3096 }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadWeatherData();
    setupEventListeners();
    checkLocationPermission();
    renderEvents();
    renderRecentEvents();
    setupAlarms();
    
    // Set minimum date to today for event form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').min = today;
});

// Initialize map with Leaflet
function initializeMap() {
    map = L.map('weatherMap').setView([currentLocation.lat, currentLocation.lng], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    mapMarker = L.marker([currentLocation.lat, currentLocation.lng])
        .addTo(map)
        .bindPopup(`<b>${currentLocation.name}</b><br>Current location`)
        .openPopup();
}

// Update map with new location
function updateMap(lat, lng, locationName) {
    if (map) {
        map.setView([lat, lng], 12);
        
        if (mapMarker) {
            map.removeLayer(mapMarker);
        }
        
        mapMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${locationName}</b><br>Current location`)
            .openPopup();
    }
}

// Show loading indicator
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Hide loading indicator
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('light-mode', !this.checked);
    });
    
    unitToggle.addEventListener('click', function() {
        isCelsius = !isCelsius;
        unitToggle.textContent = isCelsius ? '°C / °F' : '°F / °C';
        loadWeatherData();
        renderEvents();
        renderRecentEvents();
    });
    
    searchButton.addEventListener('click', searchLocation);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });
    
    voiceSearchBtn.addEventListener('click', startVoiceSearch);
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });
}

// Enhanced weather data loading with API integration
async function loadWeatherData() {
    showLoading();
    
    try {
        // Get current weather data
        const weatherData = await getCurrentWeather();
        
        // Update UI with weather data
        updateWeatherUI(weatherData);
        
        // Get agricultural data and recommendations
        const agriData = await getAgriculturalData(weatherData);
        updateAgriculturalUI(agriData);
        
        // Generate forecasts
        generateHourlyForecast();
        generateDailyForecast();
        
        showNotification(`Weather data loaded for ${currentLocation.name}`);
        
    } catch (error) {
        console.error('Error loading weather data:', error);
        showNotification('Error loading weather data. Using simulated data.');
        loadSimulatedWeatherData();
    } finally {
        hideLoading();
    }
}

// Get current weather data from API
async function getCurrentWeather() {
    // Try OpenWeatherMap API first
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            return {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                condition: data.weather[0].main,
                description: data.weather[0].description,
                visibility: (data.visibility / 1000).toFixed(1),
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        }
    } catch (error) {
        console.warn('OpenWeather API failed, using simulated data');
    }
    
    // Fallback to simulated data
    return getSimulatedWeatherData();
}

// Get agricultural data and recommendations
async function getAgriculturalData(weatherData) {
    const currentMonth = new Date().getMonth();
    const season = getCurrentSeason(currentMonth);
    
    // Get suitable crops for current season and weather
    const suitableCrops = getSuitableCrops(season, weatherData.temperature, weatherData.humidity);
    
    // Get soil health data (simulated)
    const soilHealth = getSoilHealthData();
    
    // Get farming alerts based on weather conditions
    const alerts = getFarmingAlerts(weatherData);
    
    // Get farming tips
    const tips = getFarmingTips(season, weatherData);
    
    return {
        suitableCrops,
        soilHealth,
        alerts,
        tips,
        season
    };
}

// Update weather UI
function updateWeatherUI(weatherData) {
    const temp = isCelsius ? weatherData.temperature : celsiusToFahrenheit(weatherData.temperature);
    const condition = weatherData.condition;
    const conditionEmoji = getWeatherEmoji(condition);
    
    currentTemp.textContent = isCelsius ? `${temp}°C` : `${temp}°F`;
    weatherCondition.textContent = weatherData.description;
    weatherIcon.textContent = conditionEmoji;
    
    setWeatherIconAnimation(condition, weatherIcon);
    createWeatherAnimation(condition);
    
    feelsLike.textContent = isCelsius ? 
        `${weatherData.feelsLike}°C` : 
        `${celsiusToFahrenheit(weatherData.feelsLike)}°F`;
        
    humidity.textContent = `${weatherData.humidity}%`;
    windSpeed.textContent = `${weatherData.windSpeed} km/h`;
    airQuality.textContent = `${Math.floor(Math.random() * 100) + 20} (Moderate)`;
    uvIndex.textContent = `${Math.floor(Math.random() * 8) + 2} (Moderate)`;
    visibility.textContent = `${weatherData.visibility} km`;
    pressure.textContent = `${weatherData.pressure} hPa`;
    precipitation.textContent = `${Math.floor(Math.random() * 30)}%`;
    expectedRainfall.textContent = `${(Math.random() * 10).toFixed(1)} mm`;
    sunrise.textContent = weatherData.sunrise;
    sunset.textContent = weatherData.sunset;
}

// Update agricultural UI
function updateAgriculturalUI(agriData) {
    updateCropRecommendations(agriData.suitableCrops);
    updateSoilHealth(agriData.soilHealth);
    updateAgriculturalAlerts(agriData.alerts);
    updateFarmingTips(agriData.tips);
}

// Update crop recommendations
function updateCropRecommendations(crops) {
    const container = document.getElementById('cropRecommendation');
    if (!container) return;
    
    container.innerHTML = '';
    
    crops.slice(0, 4).forEach(crop => {
        const cropElement = document.createElement('div');
        cropElement.className = 'crop-item';
        cropElement.innerHTML = `
            <span class="crop-icon">${crop.emoji}</span>
            <div class="crop-name">${crop.name}</div>
            <div class="crop-season">${crop.season}</div>
            <div class="crop-details">
                Temp: ${crop.tempRange.min}°C - ${crop.tempRange.max}°C<br>
                Rainfall: ${crop.rainfall}<br>
                Soil: ${crop.soil}
            </div>
        `;
        container.appendChild(cropElement);
    });
}

// Update soil health metrics
function updateSoilHealth(soilData) {
    const container = document.getElementById('soilHealth');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(soilData).forEach(([key, value]) => {
        const metricElement = document.createElement('div');
        metricElement.className = 'soil-metric';
        metricElement.innerHTML = `
            <div class="soil-value">${value.value}</div>
            <div class="soil-label">${value.label}</div>
        `;
        container.appendChild(metricElement);
    });
}

// Update agricultural alerts
function updateAgriculturalAlerts(alerts) {
    const container = document.getElementById('agriculturalAlerts');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (alerts.length === 0) {
        container.innerHTML = '<div class="alert-item info">✅ No critical alerts. Good conditions for farming.</div>';
        return;
    }
    
    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item ${alert.type}`;
        alertElement.innerHTML = `
            <span class="alert-icon">${alert.emoji}</span>
            <span>${alert.message}</span>
        `;
        container.appendChild(alertElement);
    });
}

// Update farming tips
function updateFarmingTips(tips) {
    const container = document.getElementById('farmingTips');
    if (!container) return;
    
    container.innerHTML = '';
    
    tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.innerHTML = `
            <span class="tip-icon">${tip.emoji}</span>
            <div class="tip-content">
                <div class="tip-title">${tip.title}</div>
                <div class="tip-description">${tip.description}</div>
            </div>
        `;
        container.appendChild(tipElement);
    });
}

// Helper functions for agricultural data
function getCurrentSeason(month) {
    if (month >= 2 && month <= 5) return "Summer";
    if (month >= 6 && month <= 9) return "Monsoon";
    return "Winter";
}

function getSuitableCrops(season, temperature, humidity) {
    return Object.values(cropDatabase).filter(crop => {
        const tempSuitable = temperature >= crop.tempRange.min && temperature <= crop.tempRange.max;
        const seasonSuitable = crop.season.toLowerCase().includes(season.toLowerCase()) || 
                             crop.season === "Year-round";
        return tempSuitable && seasonSuitable;
    });
}

function getSoilHealthData() {
    return {
        moisture: { value: `${Math.floor(Math.random() * 30) + 50}%`, label: "Soil Moisture" },
        nitrogen: { value: `${Math.floor(Math.random() * 40) + 30}ppm`, label: "Nitrogen" },
        phosphorus: { value: `${Math.floor(Math.random() * 30) + 20}ppm`, label: "Phosphorus" },
        potassium: { value: `${Math.floor(Math.random() * 200) + 100}ppm`, label: "Potassium" }
    };
}

function getFarmingAlerts(weatherData) {
    const alerts = [];
    
    if (weatherData.temperature > 35) {
        alerts.push({
            type: "warning",
            emoji: "🌡️",
            message: "High temperature alert! Consider irrigation and shade management."
        });
    }
    
    if (weatherData.temperature < 10) {
        alerts.push({
            type: "warning",
            emoji: "❄️",
            message: "Low temperature warning! Protect sensitive crops from frost."
        });
    }
    
    if (weatherData.humidity > 80) {
        alerts.push({
            type: "warning",
            emoji: "💧",
            message: "High humidity may promote fungal diseases. Monitor crops closely."
        });
    }
    
    if (parseFloat(weatherData.visibility) < 2) {
        alerts.push({
            type: "info",
            emoji: "🌫️",
            message: "Low visibility. Be cautious with machinery operations."
        });
    }
    
    return alerts;
}

function getFarmingTips(season, weatherData) {
    const tips = [];
    
    if (season === "Monsoon") {
        tips.push({
            emoji: "🌧️",
            title: "Monsoon Planting",
            description: "Ideal time for rice transplantation and sowing of kharif crops like maize and cotton."
        });
        
        tips.push({
            emoji: "🚜",
            title: "Soil Preparation",
            description: "Ensure proper drainage to prevent waterlogging. Add organic matter to improve soil structure."
        });
    }
    
    if (weatherData.temperature > 30) {
        tips.push({
            emoji: "💦",
            title: "Irrigation Management",
            description: "Water crops early morning or late evening to reduce evaporation losses."
        });
    }
    
    tips.push({
        emoji: "🔍",
        title: "Crop Monitoring",
        description: "Regularly check for pests and diseases. Early detection helps in effective management."
    });
    
    tips.push({
        emoji: "🌱",
        title: "Soil Health",
        description: "Test soil nutrients every season and apply fertilizers based on crop requirements."
    });
    
    return tips.slice(0, 3);
}

// Simulated weather data fallback
function getSimulatedWeatherData() {
    const temp = Math.floor(Math.random() * 30) + 15;
    const condition = getWeatherCondition(temp);
    
    return {
        temperature: temp,
        feelsLike: temp + Math.floor(Math.random() * 3) - 1,
        humidity: Math.floor(Math.random() * 40) + 40,
        pressure: Math.floor(Math.random() * 30) + 990,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        condition: condition,
        description: condition,
        visibility: (Math.random() * 15 + 5).toFixed(1),
        sunrise: `${Math.floor(Math.random() * 2) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
        sunset: `${Math.floor(Math.random() * 2) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`
    };
}

function loadSimulatedWeatherData() {
    const weatherData = getSimulatedWeatherData();
    updateWeatherUI(weatherData);
    
    const agriData = getAgriculturalData(weatherData);
    updateAgriculturalUI(agriData);
}

// Create weather-specific animations
function createWeatherAnimation(condition) {
    // Clear previous animations
    weatherAnimation.innerHTML = '';
    weatherAnimation.className = 'weather-animation';
    
    // Add animation based on weather condition
    if (condition.includes('rain') || condition.includes('Rain') || condition.includes('drizzle')) {
        weatherAnimation.classList.add('rain-animation');
        createRainAnimation();
    } else if (condition.includes('snow') || condition.includes('Snow') || condition.includes('ice')) {
        weatherAnimation.classList.add('snow-animation');
        createSnowAnimation();
    } else if (condition.includes('cloud') || condition.includes('Cloud') || condition.includes('overcast')) {
        weatherAnimation.classList.add('cloud-animation');
    } else if (condition.includes('storm') || condition.includes('Storm') || condition.includes('thunder')) {
        weatherAnimation.classList.add('storm-animation');
    } else if (condition.includes('wind') || condition.includes('Wind') || condition.includes('breeze')) {
        weatherAnimation.classList.add('wind-animation');
    } else {
        // Default to sunny animation
        weatherAnimation.classList.add('sun-animation');
    }
}

// Create rain animation
function createRainAnimation() {
    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
        raindrop.style.animationDelay = `${Math.random() * 5}s`;
        weatherAnimation.appendChild(raindrop);
    }
}

// Create snow animation
function createSnowAnimation() {
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${5 + Math.random() * 10}s`;
        snowflake.style.animationDelay = `${Math.random() * 10}s`;
        weatherAnimation.appendChild(snowflake);
    }
}

// Set weather icon animation class
function setWeatherIconAnimation(condition, iconElement) {
    // Remove all animation classes
    iconElement.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'windy', 'foggy', 'partly-cloudy');
    
    // Add appropriate animation class based on condition
    if (condition.includes('sun') || condition.includes('clear')) {
        iconElement.classList.add('sunny');
    } else if (condition.includes('cloud') && condition.includes('partly')) {
        iconElement.classList.add('partly-cloudy');
    } else if (condition.includes('cloud')) {
        iconElement.classList.add('cloudy');
    } else if (condition.includes('rain')) {
        iconElement.classList.add('rainy');
    } else if (condition.includes('storm') || condition.includes('thunder')) {
        iconElement.classList.add('stormy');
    } else if (condition.includes('snow')) {
        iconElement.classList.add('snowy');
    } else if (condition.includes('wind')) {
        iconElement.classList.add('windy');
    } else if (condition.includes('fog') || condition.includes('mist')) {
        iconElement.classList.add('foggy');
    } else {
        // Default to sunny
        iconElement.classList.add('sunny');
    }
}

// Save event to localStorage
function saveEvent() {
    const eventName = document.getElementById('eventName').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventAlarm = document.getElementById('eventAlarm').value;
    
    const event = {
        id: Date.now(),
        name: eventName,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        alarm: parseInt(eventAlarm),
        createdAt: new Date().toISOString()
    };
    
    events.push(event);
    localStorage.setItem('weatherEvents', JSON.stringify(events));
    
    // Reset form
    eventForm.reset();
    
    // Re-render events and set up alarms
    renderEvents();
    renderRecentEvents();
    setupAlarms();
    
    showNotification(`Event "${eventName}" saved successfully!`);
}

// Get simulated weather for a location
function getSimulatedWeather(location, eventDateTime = null) {
    // In a real app, this would fetch from an API
    // For demo, we'll generate location-specific weather
    const locationHash = location.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Use location hash to create consistent but varied weather
    const baseTemp = isCelsius ? 
        Math.floor((locationHash % 30) + 10) : 
        Math.floor((locationHash % 54) + 50);
        
    // Calculate expected temperature for event time
    let expectedTemp = baseTemp;
    if (eventDateTime) {
        // Simulate temperature variation based on time of day
        const hour = eventDateTime.getHours();
        if (hour >= 6 && hour < 12) {
            expectedTemp += 2; // Morning warming
        } else if (hour >= 12 && hour < 18) {
            expectedTemp += 5; // Afternoon peak
        } else if (hour >= 18 && hour < 22) {
            expectedTemp += 3; // Evening cooling
        } else {
            expectedTemp -= 2; // Night cooling
        }
        
        // Add some random variation
        expectedTemp += Math.floor((locationHash % 7) - 3);
    }
    
    const condition = getWeatherCondition(expectedTemp);
    const conditionEmoji = getWeatherEmoji(condition);
    
    // Determine if there's an alert (30% chance)
    const hasAlert = (locationHash % 10) < 3;
    const alerts = [
        "Heavy rain expected",
        "High winds forecast",
        "Temperature extreme",
        "Poor air quality",
        "UV alert"
    ];
    const alert = hasAlert ? alerts[locationHash % alerts.length] : null;
    
    // Check for temperature alerts
    const tempAlerts = [];
    if (expectedTemp < (isCelsius ? 10 : 50)) {
        tempAlerts.push("Too cold for outdoor activities");
    } else if (expectedTemp > (isCelsius ? 30 : 86)) {
        tempAlerts.push("Too hot for outdoor activities");
    }
    
    return {
        currentTemp: isCelsius ? `${baseTemp}°C` : `${celsiusToFahrenheit(baseTemp)}°F`,
        expectedTemp: isCelsius ? `${expectedTemp}°C` : `${celsiusToFahrenheit(expectedTemp)}°F`,
        condition: condition,
        emoji: conditionEmoji,
        alert: alert,
        tempAlerts: tempAlerts
    };
}

// Render events list
function renderEvents() {
    eventList.innerHTML = '';
    
    if (events.length === 0) {
        eventList.innerHTML = '<p>No events saved yet. Add your first event above!</p>';
        return;
    }
    
    // Sort events by date
    events.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    
    events.forEach(event => {
        const eventDate = new Date(event.date + 'T' + event.time);
        const now = new Date();
        const timeDiff = eventDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        let statusText = '';
        let statusClass = '';
        
        if (timeDiff < 0) {
            statusText = 'Past Event';
            statusClass = 'past';
        } else if (daysDiff === 0) {
            statusText = 'Today';
            statusClass = 'today';
        } else if (daysDiff === 1) {
            statusText = 'Tomorrow';
            statusClass = 'tomorrow';
        } else {
            statusText = `In ${daysDiff} days`;
            statusClass = 'future';
        }
        
        // Get weather for event location
        const weather = getSimulatedWeather(event.location, eventDate);
        
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${statusClass}`;
        eventElement.innerHTML = `
            <div class="event-info">
                <h4>${event.name}</h4>
                <div class="event-details">
                    <div>Location: ${event.location}</div>
                    <div>Date: ${formatDate(event.date)} at ${event.time}</div>
                    <div>Alert: ${getAlarmText(event.alarm)} before</div>
                    <div>Status: ${statusText}</div>
                </div>
                <div class="event-weather">
                    <div>Current: ${weather.emoji} ${weather.currentTemp} - ${weather.condition}</div>
                    <div>Expected: ${weather.emoji} ${weather.expectedTemp} - ${weather.condition}</div>
                    ${weather.alert ? `<div class="weather-alert">⚠️ ${weather.alert}</div>` : ''}
                    ${weather.tempAlerts.map(alert => `<div class="weather-alert temp-alert">🌡️ ${alert}</div>`).join('')}
                </div>
            </div>
            <div class="event-actions">
                <button class="btn btn-small" onclick="editEvent(${event.id})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
        
        eventList.appendChild(eventElement);
    });
}

// Render recent events (last 5)
function renderRecentEvents() {
    recentEvents.innerHTML = '';
    
    if (events.length === 0) {
        recentEvents.innerHTML = '<p>No events saved yet.</p>';
        return;
    }
    
    // Get last 5 events
    const recentEventsList = [...events]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    recentEventsList.forEach(event => {
        const eventDate = new Date(event.date + 'T' + event.time);
        // Get weather for event location
        const weather = getSimulatedWeather(event.location, eventDate);
        
        const eventElement = document.createElement('div');
        eventElement.className = 'recent-event-card';
        eventElement.innerHTML = `
            <h4>${event.name}</h4>
            <div class="event-date">${formatDate(event.date)} at ${event.time}</div>
            <div class="event-location">
                <span>📍</span> ${event.location}
            </div>
            <div class="event-weather-info">
                <div class="current-temp">${weather.currentTemp}</div>
                <div class="expected-temp">Expected: ${weather.expectedTemp}</div>
                <div>${weather.emoji} ${weather.condition}</div>
                ${weather.alert ? `<div class="weather-alert">⚠️ ${weather.alert}</div>` : ''}
                ${weather.tempAlerts.map(alert => `<div class="weather-alert temp-alert">🌡️ ${alert}</div>`).join('')}
            </div>
            <div style="margin-top: 15px;">
                <button class="btn btn-small" onclick="viewEvent(${event.id})">View Details</button>
            </div>
        `;
        
        recentEvents.appendChild(eventElement);
    });
}

// View event details
function viewEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        const eventDate = new Date(event.date + 'T' + event.time);
        const weather = getSimulatedWeather(event.location, eventDate);
        showNotification(`Event: ${event.name} on ${formatDate(event.date)} at ${event.time}. Current: ${weather.currentTemp}, Expected: ${weather.expectedTemp}, ${weather.condition}${weather.alert ? ` (Alert: ${weather.alert})` : ''}`);
    }
}

// Delete event
function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    localStorage.setItem('weatherEvents', JSON.stringify(events));
    renderEvents();
    renderRecentEvents();
    setupAlarms();
    showNotification('Event deleted successfully');
}

// Edit event
function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventAlarm').value = event.alarm;
        
        // Remove the event being edited
        deleteEvent(id);
        
        showNotification(`Editing event: ${event.name}`);
    }
}

// Set up alarms for events
function setupAlarms() {
    // Clear existing timeouts
    alarmTimeouts.forEach(timeout => clearTimeout(timeout));
    alarmTimeouts = [];
    
    const now = new Date();
    
    events.forEach(event => {
        const eventDateTime = new Date(event.date + 'T' + event.time);
        const alarmTime = new Date(eventDateTime.getTime() - event.alarm * 60 * 1000);
        
        // If alarm time is in the future, set a timeout
        if (alarmTime > now) {
            const timeout = setTimeout(() => {
                triggerAlarm(event);
            }, alarmTime - now);
            
            alarmTimeouts.push(timeout);
        }
    });
}

// Trigger alarm for an event
function triggerAlarm(event) {
    const eventDateTime = new Date(event.date + 'T' + event.time);
    const weather = getSimulatedWeather(event.location, eventDateTime);
    let alertMessage = `Reminder: Your event "${event.name}" at ${event.location} is coming up in ${getAlarmText(event.alarm)}! `;
    alertMessage += `Current: ${weather.currentTemp}, Expected: ${weather.expectedTemp}, ${weather.condition}`;
    
    if (weather.alert) {
        alertMessage += ` (Alert: ${weather.alert})`;
    }
    
    if (weather.tempAlerts.length > 0) {
        alertMessage += ` (Temperature: ${weather.tempAlerts.join(', ')})`;
    }
    
    showNotification(alertMessage);
    speak(alertMessage);
    
    // Play alarm sound
    playAlarmSound();
}

// Play alarm sound
function playAlarmSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    
    // Stop after 1 second
    setTimeout(() => {
        oscillator.stop();
    }, 1000);
}

// Search for a location using geocoding API
async function searchLocation() {
    const query = searchInput.value.trim();
    if (query) {
        // Show loading indicator
        showLoading();
        
        showNotification(`Searching for "${query}"...`);
        
        try {
            // First check our local database
            let foundLocation = null;
            const queryLower = query.toLowerCase();
            
            for (const [key, location] of Object.entries(locationDatabase)) {
                if (queryLower.includes(key) || key.includes(queryLower)) {
                    foundLocation = location;
                    break;
                }
            }
            
            // If not found in local database, use OpenStreetMap Nominatim API
            if (!foundLocation) {
                foundLocation = await geocodeLocation(query);
            }
            
            if (foundLocation) {
                currentLocation = foundLocation;
                updateMap(foundLocation.lat, foundLocation.lng, foundLocation.name);
                loadWeatherData();
                locationName.textContent = foundLocation.name;
                locationDetails.textContent = "Location found successfully";
                showNotification(`Weather data loaded for ${foundLocation.name}`);
            } else {
                showNotification(`Could not find location: ${query}`);
            }
        } catch (error) {
            console.error('Error searching location:', error);
            showNotification('Error searching for location. Please try again.');
        } finally {
            // Hide loading indicator
            hideLoading();
        }
    }
}

// Geocode location using OpenStreetMap Nominatim API
async function geocodeLocation(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = data[0];
            return {
                name: result.display_name.split(',')[0] + ', ' + result.display_name.split(',')[1],
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Start voice search
function startVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            voiceSearchBtn.style.color = 'var(--electric-blue)';
            showNotification("Listening... Speak now");
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchLocation();
        };
        
        recognition.onerror = function(event) {
            showNotification("Error occurred in recognition: " + event.error);
        };
        
        recognition.onend = function() {
            voiceSearchBtn.style.color = '';
        };
        
        recognition.start();
    } else {
        showNotification("Voice recognition not supported in this browser");
    }
}

// Generate hourly forecast
function generateHourlyForecast() {
    hourlyForecast.innerHTML = '';
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hourTemp = isCelsius ? 
            Math.floor(Math.random() * 10) + 18 : 
            Math.floor(Math.random() * 18) + 64;
            
        const hourIcon = getRandomWeatherEmoji();
        const hourCondition = getWeatherCondition(hourTemp);
            
        const hourItem = document.createElement('div');
        hourItem.className = 'hour-item';
        hourItem.innerHTML = `
            <div>${hour.getHours()}:00</div>
            <div class="hour-icon">${hourIcon}</div>
            <div>${isCelsius ? `${hourTemp}°C` : `${celsiusToFahrenheit(hourTemp)}°F`}</div>
        `;
        
        // Set animation for hour icon
        const iconElement = hourItem.querySelector('.hour-icon');
        setWeatherIconAnimation(hourCondition, iconElement);
        
        hourlyForecast.appendChild(hourItem);
    }
}

// Generate daily forecast
function generateDailyForecast() {
    dailyForecast.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        const dayName = i === 0 ? 'Today' : days[date.getDay()];
        const highTemp = isCelsius ? 
            Math.floor(Math.random() * 10) + 20 : 
            Math.floor(Math.random() * 18) + 68;
        const lowTemp = isCelsius ? 
            Math.floor(Math.random() * 10) + 10 : 
            Math.floor(Math.random() * 18) + 50;
            
        const dayIcon = getRandomWeatherEmoji();
        const dayCondition = getWeatherCondition((highTemp + lowTemp) / 2);
            
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';
        dayItem.innerHTML = `
            <div><strong>${dayName}</strong></div>
            <div class="day-icon">${dayIcon}</div>
            <div>H: ${isCelsius ? `${highTemp}°C` : `${celsiusToFahrenheit(highTemp)}°F`}</div>
            <div>L: ${isCelsius ? `${lowTemp}°C` : `${celsiusToFahrenheit(lowTemp)}°F`}</div>
        `;
        
        // Set animation for day icon
        const iconElement = dayItem.querySelector('.day-icon');
        setWeatherIconAnimation(dayCondition, iconElement);
        
        dailyForecast.appendChild(dayItem);
    }
}

// Get weather condition based on temperature
function getWeatherCondition(temp) {
    if (temp < 10) return "Too Cold";
    if (temp > 30) return "Too Hot";
    return "Comfortable";
}

// Get weather emoji based on condition
function getWeatherEmoji(condition) {
    const emojis = {
        "Too Cold": "❄️",
        "Too Hot": "🔥",
        "Comfortable": "☀️",
        "Clear": "☀️",
        "Clouds": "☁️",
        "Rain": "🌧️",
        "Drizzle": "🌦️",
        "Thunderstorm": "⛈️",
        "Snow": "❄️",
        "Mist": "🌫️"
    };
    return emojis[condition] || "☀️";
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

// Get random weather emoji
function getRandomWeatherEmoji() {
    const emojis = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌦️', '❄️'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// Show weather alert
function showWeatherAlert() {
    const alerts = [
        "Heavy rain expected in your area in the next 2 hours.",
        "Temperature dropping rapidly. Dress warmly.",
        "High UV index today. Use sunscreen.",
        "Strong winds expected. Secure outdoor objects.",
        "Air quality alert: Poor conditions expected."
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    showNotification(`Weather Alert: ${randomAlert}`);
    speak(randomAlert);
}

// Show notification
function showNotification(message) {
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Text to speech
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Check location permission
function checkLocationPermission() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                currentLocation = {
                    name: "Your Current Location",
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateMap(currentLocation.lat, currentLocation.lng, currentLocation.name);
                loadWeatherData();
                locationName.textContent = "Your Current Location";
                locationDetails.textContent = "Based on your device location";
                showNotification("Using your current location");
            },
            function(error) {
                showNotification("Location access denied. Using default location.");
            }
        );
    }
}

// Helper functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getAlarmText(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else if (minutes < 1440) {
        return `${Math.floor(minutes / 60)} hours`;
    } else {
        return `${Math.floor(minutes / 1440)} days`;
    }
}