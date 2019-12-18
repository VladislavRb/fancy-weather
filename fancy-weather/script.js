const globalTimerObj = {
    timer: null
};







async function loadFromAPITo(responseObj, URL){
    const promise = fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            responseObj.response = data;
        });

    await promise;
}







function initMap(longitude, latitude){
    function successCallback(pos){
        mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZGlzbGF2cmIiLCJhIjoiY2szdm94d2txMG9iejNtbzMxaHZkb2RrdSJ9.Js5G-q0mvoMuvaictqK-2A';
        const mapSettings = {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 10
        };
        const map = new mapboxgl.Map(mapSettings);
    }
    navigator.geolocation.getCurrentPosition(successCallback);
}







function activateMicro(){
    const audioSearch = document.getElementsByClassName('header__search-block__audio-search')[0];
    audioSearch.style.backgroundImage = 'url("assets/micro-icons/micro-active.png")';

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    const language = localStorage.getItem('lang');
    recognition.lang = language;

    let city = 'Minsk';

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        city = transcript;
    });

    recognition.addEventListener('audioend', e => {
        loadDataFromAPIToElements('openweathermap', language, city);
        loadDataFromAPIToElements('unsplash', language, city);
        loadDataFromAPIToElements('opencage', language, city);
    });

    recognition.start();
}







function localDateString(TZMilliseconds){
    const ruWeekdays = ['Понедельник', 
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ];

    const engWeekdays = ['Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    const ruMonths = ['Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    const engMonths = ['January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const lang = localStorage.getItem('lang');

    const months = lang == 'ru' ? ruMonths : engMonths;
    const weekDays = lang == 'ru' ? ruWeekdays : engWeekdays;

    const currentDate = new Date();
    let GreenwichDateString = currentDate.toLocaleString('en-ZA', {timeZone: 'UTC'});
    GreenwichDateString = GreenwichDateString.replace(',', '')
        .replace('/', ' ')
        .replace('/', ' ')
        .replace(':', ' ')
        .replace(':', ' ');

    const GreenwichDateArray = GreenwichDateString.split(' ')
        .map(x => +x);

    if(GreenwichDateArray[1]){
        GreenwichDateArray[1] --;
    }
    else{
        GreenwichDateArray[1] = 11;
        GreenwichDateArray[0] --;
    }

    const GreenwichDate = new Date(...GreenwichDateArray);
    const userTZDate = new Date(GreenwichDate.getTime() + TZMilliseconds);

    const hours = userTZDate.getHours() < 10 ? `0${userTZDate.getHours()}` : `${userTZDate.getHours()}`;
    const minutes = userTZDate.getMinutes() < 10 ? `0${userTZDate.getMinutes()}` : `${userTZDate.getMinutes()}`;
    const month = months[userTZDate.getMonth()];

    if(! localStorage.getItem('month')){
        localStorage.setItem('month', month);
    }

    const localDateString = `${weekDays[(userTZDate.getDay() + 6) % 7]} ${userTZDate.getDate()} ${month}  ${hours}:${minutes}`;
    return localDateString;
}







function resetMicroIcon(){
    document.getElementsByClassName('header__search-block__audio-search')[0].style.backgroundImage = 'url("assets/micro-icons/micro-inactive.png")';
}







function Header(){
    const header = document.createElement('header');

    const headerSettingsBlock = document.createElement('div');
    headerSettingsBlock.className = 'header__settings-block';

    const changeBackgroundButton = document.createElement('button');
    changeBackgroundButton.className = 'header__settings-block__change-back-btn';
    const changeLangButton = document.createElement('button');
    changeLangButton.className = 'header__settings-block__change-lang-btn';
    changeLangButton.textContent = 'en';
    changeLangButton.onclick = () => {
        const city = localStorage.getItem('city');

        if(changeLangButton.textContent == 'en'){
            loadDataFromAPIToElements('openweathermap', 'ru', city);
            loadDataFromAPIToElements('opencage', 'ru', city);
            changeLangButton.textContent = 'ru';
        }
        else{
            loadDataFromAPIToElements('openweathermap', 'en', city);
            loadDataFromAPIToElements('opencage', 'en', city);
            changeLangButton.textContent = 'en';
        }
    };
    const temperatureBlock = document.createElement('div');
    temperatureBlock.className = 'header__settings-block__change-t-block';

    const toFahrenheitButton = document.createElement('button');
    toFahrenheitButton.className = 'header__settings-block__to-f-btn';
    toFahrenheitButton.textContent = 'F°';
    toFahrenheitButton.style.color = 'rgb(100, 100, 100)';
    toFahrenheitButton.style.backgroundColor = 'rgb(255, 255, 255)';

    const toCelsiusButton = document.createElement('button');
    toCelsiusButton.className = 'header__settings-block__to-c-btn';
    toCelsiusButton.textContent = 'C°';
    toCelsiusButton.style.backgroundColor = 'rgb(100, 100, 100)';

    temperatureBlock.appendChild(toFahrenheitButton);
    temperatureBlock.appendChild(toCelsiusButton);

    changeBackgroundButton.onclick = function() {
        loadDataFromAPIToElements('unsplash', localStorage.getItem('lang'), localStorage.getItem('city'));
    };

    headerSettingsBlock.appendChild(changeBackgroundButton);
    headerSettingsBlock.appendChild(changeLangButton);
    headerSettingsBlock.appendChild(temperatureBlock);



    const headerSearchBlock = document.createElement('div');
    headerSearchBlock.className = 'header__search-block';

    const audioSearch = document.createElement('button');
    audioSearch.className = 'header__search-block__audio-search';



    audioSearch.onclick = activateMicro;

    const searchBar = document.createElement('input');
    searchBar.className = 'header__search-block__search-bar';
    const searchButton = document.createElement('button');
    searchButton.className = 'header__search-block__search-btn';
    searchButton.onclick = () => {
        const city = document.getElementsByClassName('header__search-block__search-bar')[0].value;
        const language = localStorage.getItem('lang');

        loadDataFromAPIToElements('openweathermap', language, city);
        loadDataFromAPIToElements('unsplash', language, city);
        loadDataFromAPIToElements('opencage', language, city);
    };

    headerSearchBlock.appendChild(audioSearch);
    headerSearchBlock.appendChild(searchBar);
    headerSearchBlock.appendChild(searchButton);




    header.appendChild(headerSettingsBlock);
    header.appendChild(headerSearchBlock);
    return header;
}







function MainDataBlock(){
    const mainDataBlock = document.createElement('div');
    mainDataBlock.className = 'maindata';

    const cityBlock = document.createElement('div');
    cityBlock.className = 'maindata__city-block';

    const dateBlock = document.createElement('div');
    dateBlock.className = 'maindata__date-block';

    mainDataBlock.appendChild(cityBlock);
    mainDataBlock.appendChild(dateBlock);

    const weatherBlock = document.createElement('div');
    weatherBlock.className = 'maindata__weather-block';

    const weatherIcon = document.createElement('div');
    weatherIcon.className = 'maindata__weather-block__weather-icon';
    const tValueBlock = document.createElement('div');
    tValueBlock.className = 'maindata__weather-block__t-value-block';
    const forecastBlock = document.createElement('div');
    forecastBlock.className = 'maindata__weather-block__forecast';

    const forecastWeather = document.createElement('div');
    forecastWeather.className = 'maindata__weather-block__forecast-weather';
    const forecastTemperature = document.createElement('div');
    forecastTemperature.className = 'maindata__weather-block__forecast-temperature';
    const forecastWind = document.createElement('div');
    forecastWind.className = 'maindata__weather-block__forecast-wind';
    const forecastHumidity = document.createElement('div');
    forecastHumidity.className = 'maindata__weather-block__forecast-humidity';

    forecastBlock.appendChild(forecastWeather);
    forecastBlock.appendChild(forecastTemperature);
    forecastBlock.appendChild(forecastWind);
    forecastBlock.appendChild(forecastHumidity);


    weatherBlock.appendChild(tValueBlock);
    weatherBlock.appendChild(weatherIcon);
    weatherBlock.appendChild(forecastBlock);

    mainDataBlock.appendChild(weatherBlock);

    const futureForecastBlock = document.createElement('div');
    futureForecastBlock.className = 'maindata__future-forecast-block';

    for(let i = 0; i < 3; i++){
        const dayForecast = document.createElement('div');
        dayForecast.className = 'maindata__future-forecast-block__day';

        const dayForecastDay = document.createElement('div');
        dayForecastDay.className = 'maindata__future-forecast-block__day-name';
        const dayForecastTemperature = document.createElement('div');
        dayForecastTemperature.className = 'maindata__future-forecast-block__day-temperature';
        const dayForecastWeatherIcon = document.createElement('div');
        dayForecastWeatherIcon.className = 'maindata__future-forecast-block__day-weather-icon';

        dayForecast.appendChild(dayForecastDay);
        dayForecast.appendChild(dayForecastTemperature);
        dayForecast.appendChild(dayForecastWeatherIcon);

        futureForecastBlock.appendChild(dayForecast);
    }

    mainDataBlock.appendChild(futureForecastBlock);

    return mainDataBlock;
}







function LatLongBlock(){
    const latLongBlock = document.createElement('div');
    latLongBlock.className = 'lat-long-block';

    const map = document.createElement('div');
    map.id = 'map';

    const lat = document.createElement('div');
    lat.className = 'lat-long-block__lat';

    const long = document.createElement('div');
    long.className = 'lat-long-block__long';


    latLongBlock.appendChild(map);
    latLongBlock.appendChild(lat);
    latLongBlock.appendChild(long);

    return latLongBlock;
}








function loadDataFromAPIToElements(resourse, lang = 'en', city = 'Minsk'){
    localStorage.setItem('lang', lang);
    localStorage.setItem('city', city);

    const URLs = {
        ipinfo: 'https://ipinfo.io/json?token=f48d7e0a2e5050',
        openweathermap: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=metric&APPID=b8e271f114537a13c8edd9a557470aca`,
        unsplash: `https://api.unsplash.com/photos/random?query=city,${city}&client_id=130fd2ad584aa4dd5484ad823a977edd1386d1337d61348091d0af210380ec08&w=1080`,
        opencage: `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=e29f098d25794ce3a6af8df34fe89433&pretty=1&no_annotations=1&language=${lang}`
    };

    const icons = {
        sun: 'assets/weather-icons/sun.svg',
        clouds: 'assets/weather-icons/clouds.svg',
        snow: 'assets/weather-icons/snow.svg',
        rain: 'assets/weather-icons/rain.svg',
        clear: 'assets/weather-icons/sun.svg'
    };
    
    const responseObj = {
        response: null
    };

    function loadDate(TZMilliseconds){
        if(globalTimerObj.timer){
            clearTimeout(globalTimerObj.timer);
            globalTimerObj.timer = null;
        }

        const showCurrentTimeId = setInterval(() => {
            const currentTimeElement = document.getElementsByClassName('maindata__date-block')[0];
            currentTimeElement.textContent = localDateString(TZMilliseconds);
        }, 1000);

        globalTimerObj.timer = showCurrentTimeId;

        const loadingTimer = setInterval(() => {
            const currentTimeElement = document.getElementsByClassName('maindata__date-block')[0];
            if(['', 'loading /', 'loading \\'].includes(currentTimeElement.textContent)){
                if(currentTimeElement.textContent == 'loading \\'){
                    currentTimeElement.textContent = 'loading /';
                }
                else{
                    if(currentTimeElement.textContent == 'loading /'){
                        currentTimeElement.textContent = 'loading \\';
                    }
                    else{
                        currentTimeElement.textContent = 'loading /';
                    }
                }
            }
            else{
                clearTimeout(loadingTimer);
            }
        }, 10);
    }

    loadFromAPITo(responseObj, URLs[resourse]);

    const waitTimerId = setInterval(() => {
        if( !Object.values(responseObj).includes(null) ){
            switch(resourse){
            case 'ipinfo':
                break;
            case 'openweathermap':
                const ruWeekdays = ['Понедельник', 
                    'Вторник',
                    'Среда',
                    'Четверг',
                    'Пятница',
                    'Суббота',
                    'Воскресенье'
                ];

                const engWeekdays = ['Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ];

                const currentForecast = responseObj.response.list[0];

                const tValueBlock = document.getElementsByClassName('maindata__weather-block__t-value-block')[0];
                const weatherIcon = document.getElementsByClassName('maindata__weather-block__weather-icon')[0];
                const forecastWeather = document.getElementsByClassName('maindata__weather-block__forecast-weather')[0];
                const forecastTemperature = document.getElementsByClassName('maindata__weather-block__forecast-temperature')[0];
                const forecastWind = document.getElementsByClassName('maindata__weather-block__forecast-wind')[0];
                const forecastHumidity = document.getElementsByClassName('maindata__weather-block__forecast-humidity')[0];

                tValueBlock.textContent = `${Math.round(currentForecast.main.temp)}°`;
                weatherIcon.style.backgroundImage = `url(${icons[currentForecast.weather[0].main.toLowerCase()]})`;
                forecastWeather.textContent = currentForecast.weather[0].description;
                forecastTemperature.textContent = lang == 'ru' ? `ощущается: ${Math.round(currentForecast.main.feels_like)}°` : `feels like: ${Math.round(currentForecast.main.feels_like)}°`;
                forecastWind.textContent = currentForecast.wind.speed.toFixed(1) + (lang == 'ru' ? 'м/с' : 'm/s');
                forecastHumidity.textContent = (lang == 'ru' ? 'влажность: ' : 'humidity: ') + currentForecast.main.humidity + '%';




                const weekDays = lang == 'ru' ? ruWeekdays : engWeekdays;

                const currentDate = new Date(currentForecast.dt_txt);
                const currentDay = currentDate.getDay();

                let nextDate;
                let nextDateIndex = 0;
                for(let weatherItem of responseObj.response.list){
                    nextDate = new Date(weatherItem.dt_txt);
                    if(( nextDate.getDay() % 7 == (currentDay + 1) % 7 ) && ( nextDate.getHours() == 12 )){
                        break;
                    }
                    nextDateIndex ++;
                }

                const dayNameArray = document.getElementsByClassName('maindata__future-forecast-block__day-name');
                const dayTemperatureArray = document.getElementsByClassName('maindata__future-forecast-block__day-temperature');
                const dayWeatherIconArray = document.getElementsByClassName('maindata__future-forecast-block__day-weather-icon');

                for(let i = 0; i < 3; i++){
                    dayNameArray[i].textContent = weekDays[(nextDate.getDay() + i + 6) % 7];
                    dayTemperatureArray[i].textContent = `${Math.round(responseObj.response.list[nextDateIndex + 8 * i].main.temp)}°`;

                    const weatherString = responseObj.response.list[nextDateIndex + 8 * i].weather[0].main.toLowerCase();

                    dayWeatherIconArray[i].style.backgroundImage = `url(${icons[weatherString]})`;
                }

                loadDate(responseObj.response.city.timezone * 1000);

                resetMicroIcon();
                const toFBtn = document.getElementsByClassName('header__settings-block__to-f-btn')[0];
                const toCBtn = document.getElementsByClassName('header__settings-block__to-c-btn')[0];

                toFBtn.onclick = () => {
                    const mainTemp = currentForecast.main.temp;
                    const mainTempBlock = document.getElementsByClassName('maindata__weather-block__t-value-block')[0];
                    mainTempBlock.textContent = `${Math.round(1.8 * mainTemp + 32)}°`;

                    for(let i = 0; i < 3; i++){
                        const temp = responseObj.response.list[nextDateIndex + 8 * i].main.temp;
                        const tempBlock = document.getElementsByClassName('maindata__future-forecast-block__day-temperature')[i];
                        tempBlock.textContent = `${Math.round(1.8 * temp + 32)}°`;
                    }

                    toFBtn.style.backgroundColor = 'rgb(100, 100, 100)';
                    toFBtn.style.color = 'rgb(255, 255, 255)';
                    toCBtn.style.backgroundColor = 'rgb(255, 255, 255)';
                    toCBtn.style.color = 'rgb(100, 100, 100)';
                };

                toCBtn.onclick = () => {
                    const mainTempBlock = document.getElementsByClassName('maindata__weather-block__t-value-block')[0];
                    mainTempBlock.textContent = `${Math.round(currentForecast.main.temp)}°`;

                    for(let i = 0; i < 3; i++){
                        const tempBlock = document.getElementsByClassName('maindata__future-forecast-block__day-temperature')[i];
                        tempBlock.textContent = `${Math.round(responseObj.response.list[nextDateIndex + 8 * i].main.temp)}°`;
                    }

                    toFBtn.style.backgroundColor = 'rgb(255, 255, 255)';
                    toFBtn.style.color = 'rgb(100, 100, 100)';
                    toCBtn.style.backgroundColor = 'rgb(100, 100, 100)';
                    toCBtn.style.color = 'rgb(255, 255, 255)';
                };

                break;
            case 'unsplash':
                document.body.style.backgroundImage = `url(${responseObj.response.urls.small})`;
                break;
            case 'opencage':
                const userLocation = responseObj.response.results[0];
                const cityBlock = document.getElementsByClassName('maindata__city-block')[0];
                cityBlock.textContent = userLocation.formatted;
                const longitude = userLocation.geometry.lng;
                const latitude = userLocation.geometry.lat;
                initMap(longitude, latitude);
                const lat = document.getElementsByClassName('lat-long-block__lat')[0];
                const long = document.getElementsByClassName('lat-long-block__long')[0];
                lat.textContent = `${lang == 'ru' ? 'Широта' : 'Latitude'}: ${latitude.toFixed(2).replace('.', '°')}'`;
                long.textContent = `${lang == 'ru' ? 'Долгота' : 'Longitude'}: ${longitude.toFixed(2).replace('.', '°')}'`;
                break;
            default:
                console.log('not defined');
            }
            clearTimeout(waitTimerId);
        }
    }, 50);
}







function main(){
    document.body.style.height = `${window.innerHeight}px`;
    const main = document.getElementsByTagName('main')[0];

    main.appendChild(Header());
    main.appendChild(MainDataBlock());
    main.appendChild(LatLongBlock());

    loadDataFromAPIToElements('openweathermap');
    loadDataFromAPIToElements('opencage');
}

main();