const userTab=document.querySelector('[data-user-weather]');
const searchTab=document.querySelector('[data-search-weather]');
const searchForm=document.querySelector('[data-searchForm]');

const userContainer=document.querySelector('.weather-container');

const grantAccessContainer=document.querySelector('.grant-location');
const searchFrom=document.querySelector('data-searchForm');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container');


// initially variable needd????
//  api key current tab

const API_KEY="42a466599eb1dfceadffde981aacdc73";

// hamesa usertab hi open ho current par
let currentTab=userTab;
currentTab.classList.add("current-tab");

// agar phele se hi present hia
getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        // for grey shade
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        



        if(!searchForm.classList.contains("active")){
            // search form ke andar active nahi pada therefore use active karo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //phele search wale tab par tha abb your weather wala visible karna hai
            searchForm.classList.remove("active");
            errordisplay.classList.remove('active');
            userInfoContainer.classList.remove("active"); // yeh wala from mai search karne ke bad wala hai
            //abhi your weather wale tab par hu 
            //abb apne apppp weather ayega vo tabi jab coordinates hoinge
            //lets check local storage first
            getFromSessionStorage();
            // grantAccessContainer.classList.add("active");
        }
    }
}
userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});


// check if my location cordinates are present or not at session storage
function getFromSessionStorage(){
    // for this sessionStorage.getItem inbuilt is used 
    const localCordinates=sessionStorage.getItem("user-coordinates");

    if(!localCordinates){
        // agar nahi mille
        // therefor we dont have access to location therefore grant access wale ko visible karo
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.add("active");
        console.log("grant wali");
        
        // we add listner to the button on granAccess
    }
    else{
        // agar local coordinate lat or lat padde hai to use KeyboardEvent
        const coordinates=JSON.parse(localCordinates);
        // JSON.parse it is converting json string to an object
        // json string ---->  '{"name":"John", "age":30, "car":null}'
        // json object ---->   {"name":"John", "age":30, "car":null}
        // no '' in object

        //function to fetch weather information according to the coordinates
        fetchUserWeatherInfo(coordinates);
    }
}


 async function fetchUserWeatherInfo(coordinates){
    // finding lat and lon from the coordinates
    const {lat,lon} = coordinates;
    // abhi mai api call kar raha hu therefore loader dekana hoga 
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");




    // API Call 
    try{
        const res=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data= await res.json();
        // res.json()  resoponse ko json format mai convert kar raha hota hai
        // abhi data aa gya loader ko hata do
        loadingScreen.classList.remove("active");
        //visible karo last wala tab
        userInfoContainer.classList.add("active");

        // add value to it mean render 
        renderWeather(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
        // homework i.e show the erorr image
    }
}


const grantAccessButton=document.querySelector('[data-grant-access');
grantAccessButton.addEventListener('click',getlocation);

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support available");
    }
}

function showPosition(position){
    const usercordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercordinates));
    // this is used above
    fetchUserWeatherInfo(usercordinates);
}


function renderWeather(weatherInfo){
    // firstly we have to fetch the element 

    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector('[data-weather-desc]');
    const weatherIcon=document.querySelector('[data-weather-icon]');
    const temp=document.querySelector('[data-temp]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const clouds=document.querySelector('[data-cloudiness]');





    //fetch value from weatherInfo object and put it UI elements
    // optional chaining operator(?.) --> it makes easier to safely access nested properties
    // if value is not present then this will give undefined value does not through error

    cityName.innerText=weatherInfo?.name;
    // we have link for icon 
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    //  [0] as array is there in weather

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    // toFixed is
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;
    // this is the data of the api
//     {
//         "coord": {
//             "lon": 17.66,
//             "lat": 14.33
//         },
//         "weather": [
//             {
//                 "id": 803,
//                 "main": "Clouds",
//                 "description": "broken clouds",
//                 "icon": "04d"
//             }
//         ],
//         "base": "stations",
//         "main": {
//             "temp": 310.11,
//             "feels_like": 307.14,
//             "temp_min": 310.11,
//             "temp_max": 310.11,
//             "pressure": 1012,
//             "humidity": 8,
//             "sea_level": 1012,
//             "grnd_level": 980
//         },
//         "visibility": 10000,
//         "wind": {
//             "speed": 7,
//             "deg": 38,
//             "gust": 8.23
//         },
//         "clouds": {
//             "all": 73
//         },
//         "dt": 1710146266,
//         "sys": {
//             "country": "TD",
//             "sunrise": 1710133177,
//             "sunset": 1710176352
//         },
//         "timezone": 3600,
//         "id": 7603255,
//         "name": "Barh el Gazel Region",
//         "cod": 200
//     }


}


const searchInput=document.querySelector("[data-searchInput]");
// searchInput.addEventListener('click',()=>{
//     searchInput.value="";
// })
searchTab.addEventListener('click',()=>{
    searchInput.value="";
})
searchForm.addEventListener('submit',(e)=>{
    errordisplay.classList.remove('active');
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        // this function will find according to the city name
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(cityName){

    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);

        const data=await res.json();
        //It looks up for the Sys-Namespace, whether it exists (or not).
        if(!data.sys){
            throw(data);
        }
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeather(data);
    }
    catch(err){
        console.log("error2");
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        errordisplay.classList.add('active');
        errordata.innerText=err.message;
        console.log(err);
    }
}
let errordata=document.querySelector('[errorMsg]');
let errordisplay=document.querySelector('.error-container');