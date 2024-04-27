var input = document.querySelector('.input_text');
var main = document.querySelector('#name');
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var icon = document.querySelector('.icon');
var button = document.querySelector('.submit');
var latitudeElement = document.querySelector('.latitude');
var forecastElement = document.querySelector('.forecast');

//Exibe a temperatura, descrição, icon e o nome da cidade que metemos no input text. Também foi convertido Kelvin para Celsius e a linguagem para pt
button.addEventListener('click', function (name) {
  fetch('http://api.openweathermap.org/data/2.5/weather?q=' + input.value + '&APPID=0503813858c019c4d5fce902682d15fa&lang=pt')
    .then(response => response.json())
    .then(data => {
      var tempValueKelvin = data['main']['temp'];
      var tempValueCelsius = (tempValueKelvin - 273.15).toFixed(0);
      var nameValue = data['name'];
      var descValue = data['weather'][0]['description'];
      var iconId = data['weather'][0]['id'];

      main.innerHTML = nameValue;
      desc.innerHTML = "Descrição - " + descValue;
      temp.innerHTML = tempValueCelsius + "°C";
      icon.innerHTML = '<i class="wi wi-owm-' + iconId + '"></i>';

      input.value = "";

      /* O nome da cidade que foi inserido no input text será convertido para a latitude e longitude para a api do forecast funcionar, visto que o 
      OpenWeatherMap Forecast só mostra as temperaturas se tivermos a latitude e a longitude*/
      fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(nameValue) + '&limit=5&appid=0503813858c019c4d5fce902682d15fa&lan=pt')
        .then(response => response.json())
        .then(geoData => {
          if (geoData.length > 0) {
            var latitude = geoData[0].lat;
            var longitude = geoData[0].lon;
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            /* Aqui chamamos a api do forecast para exibir a temperatura da cidade que metermos para as próximas horas. Chamamos as variáveis latitude e longitude
            para que a api forecast funcione corretamente*/ 
            fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=0503813858c019c4d5fce902682d15fa&lang=pt')
              .then(response => response.json())
              .then(forecastData => {

                forecastElement.innerHTML = "";

                for (var i = 0; i < 5; i++) {
                  var forecastItem = forecastData.list[i];
                  var forecastDateTime = forecastItem.dt_txt;
                  var forecastTime = forecastDateTime.substring(11, 16);
                  var forecastTemperature = (forecastItem.main.temp - 273.15).toFixed(0);
                  var forecastDescription = forecastItem.weather[0].description;
                  var forecasticonId = forecastItem.weather[0].id, forecastTime;

                  var forecastItemElement = document.createElement("p");
                  forecastItemElement.innerHTML = '<i class="wi wi-owm-' + forecasticonId + '"></i>' + " - " + forecastTime + " - " + forecastTemperature + "°C - " + forecastDescription;

                  forecastElement.appendChild(forecastItemElement);
                }
              })
              .catch(err => console.error("Erro na obtenção dos dados de previsão do tempo:", err));
          }
        })
        .catch(err => console.error("Erro na obtenção da latitude e longitude:", err));
    })
    .catch(err => alert("Cidade Incorreta!"));
});



