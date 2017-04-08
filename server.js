// Timestamp Microservice Project by Yasmin Melean 06/04/2017
// Using Node.js, Express and Pug. Moment module deals with different date formats.
var moment = require("moment");
var timezone = require("moment-timezone");
var express = require("express");
var app = express();
var PORT = 3000;

// I use the actual date of the server as an example for the user in the problem description. 
// This date is not necessary the real time of the client.
var now = moment();
var nowUnix = now.unix();
var strdate, timestamp;

// Function where the string is validated. If is a number (positive or negative) returns a date
// Depending on the date there are glitches that need to be corrected. Ex. Feb 30 is accepted.
// Modification need to be added as moment().isValid() soon will be deprecated for certain formats.
var checkString = function(param){
  strdate = null;
  timestamp = null;
  if(!isNaN(param)){
    timestamp = parseInt(param).toString();
    strdate = moment.unix(timestamp).utc().format("LL");
  }else{
    if(moment(param).isValid()){
      strdate = moment(param).utc().format("LL");
      timestamp = moment.utc(param).unix().toString();
    }
  }
};

//npm install pug in order to use pug, Express loads the module internally using:
app.set("view engine", "pug");
app.set("views", __dirname+"/static");

app.get("/", function(request, response){
  var url = request.protocol + "://" + request.hostname;
  response.render("index", {natural: now.format("LLL"), unix: nowUnix, path: url});
  console.log("request sent from: ", url);
});

//Gets the parameter passed as a string from the url and checks if it is a natural date,
// an Unix timestamp or else.
app.get("/:id", function(request, response){
  checkString(request.params.id);
  response.send({ "unix": timestamp, "natural": strdate}); 
});

// Starts a server and listens in PORT connection
// The default routing is 0.0.0.0 represented by :: in IPv6
var server = app.listen(PORT, function(){
  var host = server.address().address;
  if(host == "::"){   host = "0.0.0.0" }
  var port = server.address().port;
  console.log("Timestamp Microservice running at http://%s:%s", host, port);
});
