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



const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const requester = require("axios");

server.use(bodyParser.json());

const hostname = 'localhost';
const port = 3232;

const url = "http://" + hostname + ":" + port + "/api/v1/";


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
    }
    return eventArr
}

function findEvent(id){
    for (var i = 0; i < events.length; i++){
        if (id == events[i].id) {
            return events[i]
        }
    }
    return -1
}

function makeBookingList(bookingsArr){
    var eventBookingsArr = []
    for (var i = 0; i < bookings.length; i++){
        if (bookings[i].id = bookingsArr[i]) {
            eventBookingsArr.push(bookings[i])
        }
    }
    return eventBookingsArr
}

function findBooking(bookingsIDArr, id){

    for (var i = 0; i < bookings.length; i++){
        if (id == bookingsIDArr[i]) {
            return bookings[id]
        }
        else if (i == (bookingsIDArr.length)){
            return -1
        }
    }
    return -1
}

function createEvent(eventDetails){
    if (validateCreateInfo(eventDetails)){
        var dateArr = eventDetails.startDate.split(" ");
        var sdate = dateArr[0]
        var stime = dateArr[1]
        var startDate = sdate.split("-");
        var startTime = stime.split(":");

        var dateArr = eventDetails.endDate.split(" ");
        var edate = dateArr[0]
        var etime = dateArr[1]
        var endDate = edate.split("-");
        var endTime = etime.split(":");
        let event = {
            id: generateEventID(),
            name: eventDetails.name,
            description: eventDetails.description,
            location: eventDetails.location,
            capacity: parseInt(eventDetails.capacity),
            startDate: new Date(Date.UTC(
                parseInt(startDate[0]), // Year
                parseInt(startDate[1]), // Month
                parseInt(startDate[2]), // Date
                parseInt(startTime[0]), // Hours
                parseInt(startTime[1])  // Minutes
            )),
            endDate: new Date(Date.UTC(
                parseInt(endDate[0]), // Year
                parseInt(endDate[1]), // Month
                parseInt(endDate[2]), // Date
                parseInt(endTime[0]), // Hours
                parseInt(endTime[1])  // Minutes
            )),
            bookings: []
        };
        events.push(event)
        return event
    }
    else{
        return -1
    }
}


function validateCreateInfo(createParams){
    const validStartDate = (new Date(createParams.startDate)).getTime() > 0;

    const validEndDate = (new Date(createParams.endDate)).getTime() > 0;

    const validCap = Number.isInteger(parseInt(createParams.capacity))

    if(validStartDate && validEndDate && validCap){return true}
    return false
}

function generateEventID(){
    return events.length
}

// Endpoints //
// ---------------------------------------------------------------------//

// Server listener
server.listen(port, hostname, () => {
    console.log("listening on port " + port + " and hostname " + hostname)
});

// Read All Events
server.get("/api/v1/events", (req, res) => {
    eventList = makeEventList();
    res.status(200).send(eventList);
});

// Read Individual Event
server.get("/api/v1/events/event/:eventID", (req, res) => {
    var eventID = req.params.eventID;
    var eventObj = findEvent(eventID);
    
    res.status(200).send(eventObj);
});

// Read all Bookings
server.get("/api/v1/events/event/:eventID/bookings", (req, res) => {
    var eventID = req.params.eventID;
    var eventObj = findEvent(eventID);
    var bookingsArr = eventObj.bookings;
    var eventBookingsArr = makeBookingList(bookingsArr);
    res.status(200).send(eventBookingsArr);
});

server.post("/api/v1/events/createEvent", (req, res) => {
    var eventParams = req.body;
    var retEvent = createEvent(eventParams);
    console.log('RetEvent: ' + retEvent);
    if(retEvent !== -1){
        res.status(200).send(retEvent)
    }
    else{
        res.status(400).send(retEvent)
    }
});


// Read Individual Booking
server.get("/api/v1/events/event/:eventID/bookings/booking/:bookingID", (req, res) => {
    eventID = req.params.eventID;
    if (findEvent(eventID) !== -1) {
        var bookingID = req.params.bookingID;
        var eventObj = findEvent(eventID);
        var bookingsIDArr = eventObj.bookings;
        var booking = findBooking(bookingsIDArr, bookingID);
        if (booking !== -1){
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

// Default for not allowed statements
server.use("*", (req, res) => {
    res.status(405).send("This request is not allowed.")
});

server.get("/api/v1/events/create", (req, res) => {
    var eventList = makeEventList();
    res.status(200).send(eventList);
});



// requests //
// ----------------------------------------------------------------------- //

requester.post(url + "events/createEvent",{
    name: "The Wolf of Wall Street",
    capacity: "40",
    startDate: "2020-03-10 22:30:00",
    endDate: "2020-03-11 00:45:00",
    description: "Based on the true story of Jordan Belfort",
    location: "Egilshöll Salur 1"})
    .then((res) => {
        console.log("Specific booking for event: \n" + res.data)
    })
    .catch((error) => {
        console.log("create event response error");
        console.log("error res is: " + error)
    });



requester.get(url + "events", {
})
.then((res) => {
    console.log("get response is working");
    console.log("Event list: \n" + res.data)
})
// .catch((error) =>{
//     console.log("event list response error");
//     console.log("error res: " + error)
// })
//
// requester.get(url + "events/event/1")
// .then((res) => {
//     console.log("Specific event: \n" + res.data)
// })
// .catch((error) =>{
//     console.log("specific event response error");
//     console.log("error res is: " + error)
// });
//
// requester.get(url + "events/event/0/bookings")
// .then((res) => {
//     console.log("Bookings for event: \n" + res.data)
// })
// .catch((error) =>{
//     console.log("bookings for event response error");
//     console.log("error res is: " + error)
// });
//
// requester.get(url + "events/event/1/bookings/booking/3")
// .then((res) => {
//     console.log("Specific booking for event: \n" + res.data)
// })
// .catch((error) => {
//     console.log("specific booking response error");
//     console.log("error res is: " + error)
// });





