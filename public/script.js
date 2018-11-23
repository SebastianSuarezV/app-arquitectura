var socket = io();

var noiseCtx = document.getElementById('noise').getContext('2d');
var temperatureCtx = document.getElementById('temperature').getContext('2d');
var humidityCtx = document.getElementById('humidity').getContext('2d');

var noiseData = {
    labels: [0],
    datasets: [{
        data: [0],
        label: 'Ruido'
    }]
};

var temperatureData = {
    labels: [0],
    datasets: [{
        data: [0],
        label: 'Temperatura'
    }]
};

var humidityData = {
    labels: [0],
    datasets: [{
        data: [0],
        label: 'Humedad'
    }]
};

var noiseChart = new Chart(noiseCtx, {
    type: 'line',
    data: noiseData,
    options: {}
});

var temperatureChart = new Chart(temperatureCtx, {
    type: 'line',
    data: temperatureData,
    options: {}
});

var humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: humidityData,
    options: {}
});

socket.on('noise', function (value) {
    var length = noiseData.labels.length;
    if (length >= 20) {
        noiseData.datasets[0].data.shift();
        noiseData.labels.shift();
    }
    noiseData.labels.push(moment().format('HH:mm:ss'));
    noiseData.datasets[0].data.push(value);
    noiseChart.update();
});

socket.on('temperature', function (value) {
    var length = temperatureData.labels.length;
    if (length >= 20) {
        temperatureData.datasets[0].data.shift();
        temperatureData.labels.shift();
    }
    temperatureData.labels.push(moment().format('HH:mm:ss'));
    temperatureData.datasets[0].data.push(value);
    temperatureChart.update();
});

socket.on('humidity', function (value) {
    var length = humidityData.labels.length;
    if (length >= 20) {
        humidityData.datasets[0].data.shift();
        humidityData.labels.shift();
    }
    humidityData.labels.push(moment().format('HH:mm:ss'));
    humidityData.datasets[0].data.push(value);
    humidityChart.update();
});