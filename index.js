const express = require('express')
const server = express();

const requester = require("axios")

const hostname = 'localhost';
const port = 3000

const url = "http://" + hostname + ":" + port + "/"

server.listen(port, hostname, () => {
    console.log("listening on port " + port + " and hostname " + hostname)
});


server.get("/", (req, res) => {
    console.log("GET from / request successfull")
    eventList = trimEventList
    res.status(200).send("Welcome!")
});



server.post("/", (req, res) => {
    console.log("POST request successfull")
    res.status(200).send("Hello World from post")
});


server.get("/events", (req, res) => {
    eventList = trimEventList();
    res.status(200).send(eventList);
});

server.get("/events/event", (req, res) => {
    //name = req.data.name
    //eventObj = findEvent(name)
    console.log(req)
    name = req.data.name
    console.log(req.name)
    res.status(200).send("eventList");

    //res.status(200).send(eventList);
});



// requests //
// ----------------------------------------------------------------------- //

requester.get(url + "events", {  
}) 
.then(() => {
    console.log("get response is working")
    console.log("Event list: \n" + res.data)
})
.catch((error) =>{
    console.log("event list response error")
    console.log("error res: " + error)
})

requester.get(url + "events/event?name=The Whistlers") 
.then((res) => {
    console.log("Specifict event: \n" + res.data)
})
.catch((error) =>{
    console.log("specific event response error")
    console.log("error res is: " + error)
})



// functions //
// ---------------------------------------------------------------------//

function findEvent(name){
    for (var i = 0; i < events.length; i++){
        if (name === events[i].name) {
            return events[i]
        }
    }
};

function trimEventList(){
    var eventArr = [];
    for (var i = 0; i < events.length; i++){
        var newObj = {
            id:events[i].id,
            name:events[i].name,
            capacity:events[i].capacity,
            startDate:events[i].startDate,
            endDate:events[i].endDate
        }
        eventArr.push(newObj) 
    }       
    return eventArr
}


// database //
// -------------------------------------------------------------------------------------//

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5}
];

console.log("ran everything without errors")