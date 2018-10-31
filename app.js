const express = require('express');
const app = express();
const util = require('util');
const bodyparser = require('body-parser');
const nodefetch = require('node-fetch');
const PORT = process.env.PORT || 4000;

var getLocation = async url => {
 
  try {
    const response = await nodefetch(url);
    var json = await response.json();
    console.log(json);
    var jsonretrieved = JSON.parse(json);
    console.log(json)
  } catch (error) {
    console.log(error);
  }
  return jsonretrieved;
};
app.use('/', express.static('public'));
 
app.get('/search', function(req, res){
  var city = req.query.city;
  var stato = req.query.stato;
  console.log(req.query.city);
  console.log(req.query.stato);
  var url = "http://www.mapquestapi.com/geocoding/v1/address?key=HY7NLFLAGEdYkMXxZBfeSeGzqX93fROe&inFormat=kvp&outFormat=json&location="+ city +"%2C"+ stato +"&ignoreLatLngInput=true";
  nodefetch(url).then(result => {
    return result.json();
  }).then(json => {
    // console.log(JSON.parse(json));
    var lat = json['results'][0]['locations'][0]['displayLatLng'];
    console.log(lat);
    var urlsunset = `https://api.sunrise-sunset.org/json?lat=${lat['lat']}&lng=${lat['lng']}&date=today&formatted=0`;
    nodefetch(urlsunset).then(result => {
      return result.json();
    }).then(data => {
      var sunset = new Date(data['results']['sunset']);
      var sunrise = new Date(data['results']['sunrise']);
      // var sunsets = sunset.toDateString() + "  " + sunset.toTimeString();
      // var sunrises = sunrise.toDateString() + "  " + sunrise.toTimeString();
      // res.json(data);
      res.send(`<p>Sunset:  ${sunset}</p><br />
                Sunrise: ${sunrise}`);
    }).catch(error => console.log(error));
    // res.json(json);
  }).catch(error => console.log(error));
});
 
app.listen(PORT, () => console.log('Example app listening on port '+ PORT));