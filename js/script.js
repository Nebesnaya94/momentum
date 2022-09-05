// пункт 1 переменные
const time = document.querySelector(".time");
const setDate = document.querySelector(".date");

// пункт 2
const greeting = document.querySelector(".greeting");

let language = "en"; // язык страницы по умолчанию

const greetingTranslation = {
  // приветствия в зависимости от языка
  en: {
    morning: "Good morning, ",
    afternoon: "Good afternoon, ",
    evening: "Good evening, ",
    night: "Good night, ",
  },
  ru: {
    morning: "Доброе утро, ",
    afternoon: "Добрый день, ",
    evening: "Добрый вечер, ",
    night: "Доброй ночи, ",
  },
};

function getTimeOfDay() {
  // определение времени суток
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 0 && hours < 6) {
    return "night";
  } else if (hours >= 6 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
}
const timeOfDay = getTimeOfDay(); // переменная содержащая рассчитанное выше время суток

function showGreeting(language) {
  // отображение приветствия (значение свойства обьекта в обьекте greetingTranslation)
  greeting.textContent = greetingTranslation[language][timeOfDay];
}
//showGreeting(language);

function showTime() {
  // отображение на странице времени, даты и приветствия, с учетом языка
  const date = new Date();
  const currentTime = date.toLocaleTimeString(language);
  time.textContent = currentTime;
  function showDate() {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const currentDate = date.toLocaleDateString(language, options);
    setDate.textContent = currentDate;
  }
  // обновление каждую секунду
  setTimeout(showDate, 1000);
  setTimeout(showTime, 1000);
  setTimeout(showGreeting(language), 1000);
}
showTime();

const buttonLang = document.querySelector(".change-language"); // кнопка смены языка на странице
// смена языка по кнопке
buttonLang.addEventListener("click", () => {
  language == "en"
    ? ((language = "ru"), ruSettings())
    : ((language = "en"), enSettings());
  showGreeting(language); // смена языка приветствия
  buttonLang.textContent = `${language.toUpperCase()}`; // на кнопке отображается язык страницы в данный момент
  getWeather(language); // смена языка погоды
  getQuotes(language); // смена языка цитаты дня
});

const inputName = document.querySelector(".name"); // блок отображения имени (имя вводится вручную через input)

// сохранение введенного имени (при перезагрузке страницы)
function setLocalStorage() {
  localStorage.setItem("inputName", inputName.value);
}
window.addEventListener("beforeunload", setLocalStorage);

// загрузка сохраненного имени
function getLocalStorage() {
  if (localStorage.getItem("inputName")) {
    inputName.value = localStorage.getItem("inputName");
  }
}
window.addEventListener("load", getLocalStorage);

// получение случайного числа для выбора картинки с github
function getRandomNum() {
  return Math.floor(Math.random() * (20 - 1) + 1);
}

let bgNum = getRandomNum().toString().padStart(2, "0"); // отображение случайного числа в виде двухзначного
let randomNum = bgNum;

let body = document.querySelector("body");

// установка фоновой картинки с github
function setBg() {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${randomNum}.jpg`;
  img.addEventListener("load", () => {
    body.style.backgroundImage = `url(${img.src})`;
  });
}
setBg();

function getSlideNext() {
  // слайдер смены фоновой картинки с github (пролистывает вперед)
  randomNum++;
  if (+randomNum > 20) {
    randomNum = 1;
  }
  randomNum = randomNum.toString().padStart(2, "0");
  setBg();
}

function getSlidePrev() {
  // слайдер смены фоновой картинки с github (пролистывает назад)
  randomNum--;
  if (+randomNum < 1) {
    randomNum = 20;
  }
  randomNum = randomNum.toString().padStart(2, "0");
  setBg();
}

// кнопки слайдера фоновых картинок
let nextSlide = document.querySelector(".slide-next");
let prevSlide = document.querySelector(".slide-prev");

// https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=en&appid=66e8a6a93db75d089b9160ce586c23e2&units=metric - моя ссылка отображения погоды (после регистрации)

// блоки отображения погоды
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const windSpeed = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");

// изменение города, для которого показывается прогноз погоды
let city = document.querySelector(".city");
city.addEventListener("change", () => {
  getWeather(language);
});

// сохранение измененного города при перезагрузке страницы
function setCity() {
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setCity);

// отображение измененного города (при изменении значения "Minsk" по умолчанию)
function getCity() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  } else {
    city.value = "Minsk";
  }
}
window.addEventListener("load", getCity);

// отображение города по умолчанию или сохраненного ранее
if (localStorage.getItem("city")) {
  city.value = localStorage.getItem("city");
} else {
  city.value = "Minsk";
}

// функция получения погоды в зависимости от языка
async function getWeather(language) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=66e8a6a93db75d089b9160ce586c23e2&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  const weatherText = {
    en: {
      windDescription: `Wind speed: ${data.wind.speed.toFixed(1)} m/s`,
      humidityDescription: `Humidity: ${data.main.humidity}%`,
    },
    ru: {
      windDescription: `Скорость ветра: ${data.wind.speed.toFixed(1)} м/с`,
      humidityDescription: `Влажность: ${data.main.humidity}%`,
    },
  };

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  windSpeed.textContent = weatherText[language].windDescription;
  humidity.textContent = weatherText[language].humidityDescription;
}
getWeather(language);

// переменные для блоков с цитатами и кнопки
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");

// функция для смены цитаты
async function getQuotes(language) {
  const quotes = "data.json"; // ссылка на созданный (свой) файл json
  const res = await fetch(quotes); // получение файла с цитатами
  const data = await res.json(); // получение содержимого файла с цитатами

  let quoteNumber = Math.round(Math.random() * 8); // номер случайной цитаты

  // добавление цитаты в на страницу
  quote.textContent = `${data[quoteNumber][language].text}`;
  author.textContent = `${data[quoteNumber][language].author}`;
}
getQuotes(language);

changeQuote.addEventListener("click", () => {
  getQuotes(language);
}); // слушатель на кнопку смены цитаты

const audio = new Audio(); // объект audio (вместо тега html)
const playBtn = document.querySelector(".play"); // кнопка play/pause

import playList from "./playList.js"; // подключение плейлиста с треками

let isPlay = false; // по умолчанию аудио не воспроизводится

let playNum = 0; // 0 - первый трек (первый элемент массива)

// функция переключения между play и pause, также меняет иконку в плеере
function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
    isPlay = true;
    playBtn.classList.add("pause");
  } else if (isPlay) {
    audio.pause();
    isPlay = false;
    playBtn.classList.remove("pause");
  }
  playListTrack[playNum].classList.add("item-active"); // выделить активный трек
}
playBtn.addEventListener("click", playAudio);

// функция пролистывания треков вперед
function playNext() {
  playListTrack[playNum].classList.remove("item-active"); // отменить выделение текущего трека

  playNum++; // пролистать дальше
  isPlay = false;
  if (playNum > 3) {
    playNum = 0;
  }
  playAudio(); // запустить воспроизведение на следующем треке
}

// функция пролистывания треков назад
function playPrev() {
  playListTrack[playNum].classList.remove("item-active"); // отменить выделение текущего трека

  playNum--; // пролистать дальше
  isPlay = false;
  if (playNum < 0) {
    playNum = 3;
  }
  playAudio(); // запустить воспроизведение на следующем треке
}

// подключение пролистывания по кнопкам
const btnNext = document.querySelector(".play-next");
const btnPrev = document.querySelector(".play-prev");
btnNext.addEventListener("click", playNext);
btnPrev.addEventListener("click", playPrev);

const playListContainer = document.querySelector(".play-list"); // переменная для контейнера с плейлистом

playList.forEach((element) => {
  // перебором по количеству элементов в плейлисте создаются пункты li в контейнере ul
  const li = document.createElement("li");

  li.classList.add("play-item"); // обозначение li как элемента плейлиста
  li.textContent = element.title;
  playListContainer.append(li); // вставка новых li в конец контейнера
});

const playListTrack = document.querySelectorAll(".play-list li"); // обозначение плейлиста как массива

// https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=owhsJ8P4oa3a_Z7QOG7mZVA1vUxXHy9TIt9PsYUd6sk - ссылка для получения картинок Unsplash API (после регистрации)

const changeBackground = document.querySelector(".change-background"); // кнопка переключения источника фоновой картинки (GitHub или Unsplash API)

// функция получения картинки из Unsplash API (асинхронная для ожидания данных с сайта)
async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=${timeOfDay}&client_id=owhsJ8P4oa3a_Z7QOG7mZVA1vUxXHy9TIt9PsYUd6sk`;
  const res = await fetch(url);
  const data = await res.json();

  body.style.backgroundImage = `url(${data.urls.regular})`;
  body.style.backgroundSize = "cover";
}

let isDefault = true; // по умолчанию фоновая картинка с github

// смена источника картинки по кнопке
changeBackground.addEventListener("click", () => {
  if (isDefault == true) {
    getLinkToImage();
    isDefault = false;
  } else if (isDefault == false) {
    setBg();
    isDefault = true;
  }
});

// слайдер картинок с GitHub или Unsplash API в зависимости от картинки, которая отображается на данный момент
nextSlide.addEventListener("click", () => {
  isDefault ? getSlideNext() : getLinkToImage();
});
prevSlide.addEventListener("click", () => {
  isDefault ? getSlidePrev() : getLinkToImage();
});

const settings = document.querySelector(".settings"); // кнопка настроек
const settingsContainer = document.querySelector(".settings-container"); // список настроек (в настройках только отображение/скрытие разных блоков страницы, смена языка и фона отдельными кнопками)

// отображение блока со списком настроек по клику на кнопку
settings.addEventListener("click", () => {
  settingsContainer.classList.toggle("active");
});

// изменение языка настроек на текущем языке страницы, текст пункта настроек зависит от того, отображается ли блок в данных момент (показать/скрыть)
const hideTime = document.querySelector(".hide-time");
hideTime.addEventListener("click", () => {
  time.classList.toggle("invisible");
  if (hideTime.textContent.includes("Hide")) {
    hideTime.textContent = "Show time";
  } else if (hideTime.textContent.includes("Show")) {
    hideTime.textContent = "Hide time";
  } else if (hideTime.textContent.includes("Скрыть")) {
    hideTime.textContent = "Показать время";
  } else {
    hideTime.textContent = "Скрыть время";
  }
});

const hideDate = document.querySelector(".hide-date");
hideDate.addEventListener("click", () => {
  setDate.classList.toggle("invisible");
  if (hideDate.textContent.includes("Hide")) {
    hideDate.textContent = "Show date";
  } else if (hideDate.textContent.includes("Show")) {
    hideDate.textContent = "Hide date";
  } else if (hideDate.textContent.includes("Скрыть")) {
    hideDate.textContent = "Показать дату";
  } else {
    hideDate.textContent = "Скрыть дату";
  }
});

const hideGreeting = document.querySelector(".hide-greeting");
const greetingContainer = document.querySelector(".greeting-container");
hideGreeting.addEventListener("click", () => {
  greetingContainer.classList.toggle("invisible");
  if (hideGreeting.textContent.includes("Hide")) {
    hideGreeting.textContent = "Show greeting";
  } else if (hideGreeting.textContent.includes("Show")) {
    hideGreeting.textContent = "Hide greeting";
  } else if (hideGreeting.textContent.includes("Скрыть")) {
    hideGreeting.textContent = "Показать приветствие";
  } else {
    hideGreeting.textContent = "Скрыть приветствие";
  }
});

const hideQuote = document.querySelector(".hide-quote");
hideQuote.addEventListener("click", () => {
  changeQuote.classList.toggle("invisible");
  quote.classList.toggle("invisible");
  author.classList.toggle("invisible");
  if (hideQuote.textContent.includes("Hide")) {
    hideQuote.textContent = "Show quote";
  } else if (hideQuote.textContent.includes("Show")) {
    hideQuote.textContent = "Hide quote";
  } else if (hideQuote.textContent.includes("Скрыть")) {
    hideQuote.textContent = "Показать цитату дня";
  } else {
    hideQuote.textContent = "Скрыть цитату дня";
  }
});

const weather = document.querySelector(".weather");
const hideWeather = document.querySelector(".hide-weather");
hideWeather.addEventListener("click", () => {
  weather.classList.toggle("invisible");
  if (hideWeather.textContent.includes("Hide")) {
    hideWeather.textContent = "Show weather";
  } else if (hideWeather.textContent.includes("Show")) {
    hideWeather.textContent = "Hide weather";
  } else if (hideWeather.textContent.includes("Скрыть")) {
    hideWeather.textContent = "Показать погоду";
  } else {
    hideWeather.textContent = "Скрыть погоду";
  }
});

const player = document.querySelector(".player");
const hideAudioPlayer = document.querySelector(".hide-audio-player");
hideAudioPlayer.addEventListener("click", () => {
  player.classList.toggle("invisible");
  if (hideAudioPlayer.textContent.includes("Hide")) {
    hideAudioPlayer.textContent = "Show audio player";
  } else if (hideAudioPlayer.textContent.includes("Show")) {
    hideAudioPlayer.textContent = "Hide audio player";
  } else if (hideAudioPlayer.textContent.includes("Скрыть")) {
    hideAudioPlayer.textContent = "Показать аудиоплеер";
  } else {
    hideAudioPlayer.textContent = "Скрыть аудиоплеер";
  }
});

// функции текста настроек (для смены в зависимости от языка страницы)
function enSettings() {
  hideTime.textContent = "Hide time";
  hideDate.textContent = "Hide date";
  hideGreeting.textContent = "Hide greeting";
  hideQuote.textContent = "Hide quote";
  hideWeather.textContent = "Hide weather";
  hideAudioPlayer.textContent = "Hide audio player";
}

function ruSettings() {
  hideTime.textContent = "Скрыть время";
  hideDate.textContent = "Скрыть дату";
  hideGreeting.textContent = "Скрыть приветствие";
  hideQuote.textContent = "Скрыть цитату дня";
  hideWeather.textContent = "Скрыть погоду";
  hideAudioPlayer.textContent = "Скрыть аудиоплеер";
}
