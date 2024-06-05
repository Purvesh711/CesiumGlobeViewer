// Replace with your Cesium ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDk2NmUwOS1mZTRmLTQ1OTYtYjVlZC1mMDhhMjY1ZTBmYzAiLCJpZCI6MjIwMjE4LCJpYXQiOjE3MTc1ODAzODh9.0Km33R-vIYNSgVA5q9Q73odRpGM8FYbfEtS-nNBb-Io';

// Initialize the Cesium Viewer in the HTML element with the ID cesiumContainer.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// Function to display information
function showInfo(city, latitude, longitude, temperature) {
    const infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = `City: ${city}<br>Latitude: ${latitude}°<br>Longitude: ${longitude}°<br>Temperature: ${temperature}°C`;
}

// Function to get city name using OpenCage Geocoding API
async function getCityName(latitude, longitude) {
    const apiKey = '8c00482c865e45a8b2f22975aae8c1c7';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results[0].components.city || 'Unknown';
}

// Function to get temperature using OpenWeatherMap API
async function getTemperature(latitude, longitude) {
    const apiKey = '5f2b3e37e849eba6b03bd16af2bcb9c0';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.main.temp;
}

// Event listener for click events
viewer.screenSpaceEventHandler.setInputAction(async function(click) {
    const cartesian = viewer.scene.pickPosition(click.position);
    if (Cesium.defined(cartesian)) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);

        const city = await getCityName(latitude, longitude);
        const temperature = await getTemperature(latitude, longitude);

        showInfo(city, latitude, longitude, temperature);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
