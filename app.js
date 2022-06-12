const express = require("express");
const https = require("https");         // initializing https not require to initialize in hyper
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response){          // https method
    console.log(response.statusCode);

    response.on("data", function(data){       // response method
      const weatherData = JSON.parse(data)    // JSON.parse() method --> When receiving data from a web server, the data is always a string. JSON.parse(), the data becomes a JS object.
      console.log(weatherData);               // JSON.stringify() method --> converts a JavaScript object or value to a JSON string

      const temp = weatherData.main.temp;
      console.log(temp);

      const weatherDescription = weatherData.weather[0].description;
      console.log(weatherDescription);

      const icon = weatherData.weather[0].icon;
      console.log(icon);
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";                // image url path from open weather site

      res.write("<h1>The temperature in "+ query +" is " + temp + " degrees Celcius.</h1>");        // res.write(), res.send() are https method
      res.write("<h2>The weather is currently " + weatherDescription + " in "+ query +"</h2>");     // res.send() can only be called once, res.write() can be called many times, but you must call end yourself.
      res.write("<img src=" + imageURL + ">");

      res.send();
    });
  });
});


app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
