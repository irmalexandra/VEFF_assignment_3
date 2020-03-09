const express = require('express')
const server = express();

const requester = require("axios")

const hostname = 'localhost';
const port = 3232

const url = "http://" + hostname + ":" + port + "/api/v1/"

server.listen(port, hostname, () => {
    console.log("listening on port " + port + " and hostname " + hostname)
});


server.get("/api/v1/events", (req, res) => {
    eventList = makeEventList();
    res.status(200).send(eventList);
});

server.get("/api/v1/events/event/:eventID", (req, res) => {
    
    var eventID = req.params.eventID
    var eventObj = findEvent(eventID)
    
    res.status(200).send(eventObj);
});

server.get("/api/v1/events/event/:eventID/bookings", (req, res) => {
    var eventID = req.params.eventID
    var eventObj = findEvent(eventID)
    var bookingsArr = eventObj.bookings
    var eventBookingsArr = makeBookingList(bookingsArr)
    res.status(200).send(eventBookingsArr);
});

server.get("/api/v1/events/event/:eventID/bookings/booking/:bookingID", (req, res) => {
    eventID = req.params.eventID
    if (findEvent(eventID) != -1) {
        var bookingID = req.params.bookingID
        var eventObj = findEvent(eventID)
        var bookingsIDArr = eventObj.bookings
        var booking = findBooking(bookingsIDArr, bookingID)
        if (booking != -1){
            res.status(200).send(booking);
        }
        else {
            res.status(404).send("Booking not found for this event.")
        }
    }
    else {
        res.status(404).send("Event not found.")
    }
});

server.use("*", (req, res) => {
    res.status(405).send("This request is not allowed.")
});


// requests //
// ----------------------------------------------------------------------- //

requester.get(url + "events", {  
}) 
.then((res) => {
    console.log("get response is working")
    console.log("Event list: \n" + res.data)
})
.catch((error) =>{
    console.log("event list response error")
    console.log("error res: " + error)
})

requester.get(url + "events/event/1") 
.then((res) => {
    console.log("Specific event: \n" + res.data)
})
.catch((error) =>{
    console.log("specific event response error")
    console.log("error res is: " + error)
})

requester.get(url + "events/event/0/bookings") 
.then((res) => {
    console.log("Bookings for event: \n" + res.data)
})
.catch((error) =>{
    console.log("bookings for event response error")
    console.log("error res is: " + error)
})

requester.get(url + "events/event/1/bookings/booking/3") 
.then((res) => {
    console.log("Specific booking for event: \n" + res.data)
})
.catch((error) => {
    console.log("specific booking response error")
    console.log("error res is: " + error)
})


// functions //
// ---------------------------------------------------------------------//


function makeEventList(){
    var eventArr = [];
    for (var i = 0; i < events.length; i++){
        var newObj = {
            id:events[i].id,
            name:events[i].name,
            capacity:events[i].capacity,
            startDate:events[i].startDate,
            endDate:events[i].endDate
        };
        eventArr.push(newObj) 
    };
    return eventArr
};

function findEvent(id){
    for (var i = 0; i < events.length; i++){
        if (id == events[i].id) {
            return events[i]
        };
    };
    return -1
};

function makeBookingList(bookingsArr){
    var eventBookingsArr = []
    for (var i = 0; i < bookings.length; i++){
        if (bookings[i].id = bookingsArr[i]) {
            eventBookingsArr.push(bookings[i])
        };
    };
    return eventBookingsArr
};

function findBooking(bookingsIDArr, id){
    
    for (var i = 0; i < bookings.length; i++){
        if (id == bookingsIDArr[i]) {
            return bookings[id]
        }
        else if (i == (bookingsIDArr.length)){
            return -1
        };
    };
    return -1
};

// database //
// -------------------------------------------------------------------------------------//

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [3] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5},
    { id: 3, firstName: "Rikki", lastName: "Rikkisson", tel: "+35312345", email: "rikki@besti.is", spots: 1}
];
