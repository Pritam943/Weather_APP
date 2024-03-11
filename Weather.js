const apikey="######################";
window.addEventListener("load",()=>{
    // console.log("Hello Loader");
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                // console.log(data);
                // console.log(new Date().getTime())
                // var dat= new Date(data.dt)
                // console.log(dat.toLocaleString(undefined,'Asia/Kolkata'))
                // console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})


function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        // console.log(data);
        weatherReport(data);
    })
    // document.getElementById('input').value='';
}

function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        // console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        // console.log(data);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        // console.log(data.name,data.sys.country);
    
        // console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText = data.weather[0].description;
        // console.log(data.weather[0].description)
        
        let icon1= data.weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl
    })

}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000); //Converts the UNIX timestamp to a JavaScript Date object.
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))
        
        //Creates a new <div> element with the class next.
        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');
        
        //Creates a <div> element.
        let div= document.createElement('div');

        //Creates a <p> element to display the time with the class time.
        let time= document.createElement('p');
        time.setAttribute('class','time')

       //set the time in the Asia/Kolkata timezone without minutes (replacing ':00').
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');
        
        //Creates a <p> element to display the temperature.
        let temp= document.createElement('p');

        //add max and min temperature to it.
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        
        //Appends the time and temperature elements to the inner <div>.
        div.appendChild(time)
        div.appendChild(temp)

        //Creates a <p> element to display the weather description
        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        //Appends the inner <div> and the description element to the outer <div>.
        hourR.appendChild(div);
        hourR.appendChild(desc)

        //Appends the outer <div> to the .templist element.
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){

    //The .weekF element's content is cleared to ensure a fresh update.
    document.querySelector('.weekF').innerHTML=''
    
    //The function then iterates through the forecast.list array, starting from the 8th entry and incrementing by 8 in each iteration. This ensures that only data for every 8th entry (which represents a day) is considered.
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);

        //A new <div> element with the class dayF is created.
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        //A <p> element for displaying the date with the class date is created. The date is obtained from the timestamp of the forecast entry and converted to a human-readable format using the toDateString method, with the timezone set to Asia/Kolkata.
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);
        
        //A <p> element for displaying the temperature is created. The temperature values are calculated from the forecast data and converted from Kelvin to Celsius.
        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)
        
        //A <p> element for displaying the weather description is created.
        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;

        //All the created elements are appended to the <div> element.
        div.appendChild(description);
        
        //Finally, the <div> element is appended to the .weekF element, which presumably represents the weekly forecast in the HTML document.
        document.querySelector('.weekF').appendChild(div)
    }
} 
