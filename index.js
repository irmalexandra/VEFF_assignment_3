// database //
// -------------------------------------------------------------------------------------//

//The following is an example of an array of two events.
var events = [
    { id: 430, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [40,23,19] },
    { id: 100, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [20] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 40, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 23, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 19, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5},
    { id: 20, firstName: "Rikki", lastName: "Rikkisson", tel: "+35312345", email: "rikki@besti.is", spots: 1}
];

// CONSTANTS //
const express = require('express');
const server = express();

const bodyParser = require('body-parser');
const requester = require("axios");

const hostname = 'localhost';
const port = 3232;
const url = "http://" + hostname + ":" + port + "/api/v1/";

var eventsLength = events.length;
var bookingsLength = bookings.length;

server.use(bodyParser.json());
// ---------------------------------------------------------------//

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
    var eventBookingsArr = [];
    for (var i = 0; i < bookings.length; i++){
        for(var j = 0; j < bookingsArr.length; j++){
            if (bookings[i].id === bookingsArr[j]) {
                eventBookingsArr.push(bookings[i])
            }
        }

    }
    return eventBookingsArr
}

function findBooking(bookingsIDArr, id){

    for (var i = 0; i < bookings.length; i++){
        if (id === bookingsIDArr[i]) {
            return bookings[id]
        }
        else if (i === (bookingsIDArr.length)){
            return -1
        }
    }
    return -1
}

function createEvent(eventDetails){
    if (validateCreateEventInfo(eventDetails)){
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

        if(eventDetails.description == undefined){eventDetails.description = ""}
        if(eventDetails.location == undefined){eventDetails.location = ""}

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
        events.push(event);
        return event
    }
    else{
        return -1
    }
}

function validateCreateEventInfo(eventDetails){
    let capOverOrEqualZero = false;
    const validStartDate = (new Date(eventDetails.startDate)).getTime() > 0;

    const validEndDate = (new Date(eventDetails.endDate)).getTime() > 0;

    const validCap = Number.isInteger(parseInt(eventDetails.capacity));
    if(validCap){capOverOrEqualZero = parseInt(eventDetails.capacity) >= 0;}

    if(validStartDate && validEndDate && validCap && capOverOrEqualZero){return true}
    return false
}

function generateEventID(){
    var eventID = eventsLength
    eventsLength++
    return eventID
}

function generateBookingID(){
    var bookingID = bookingsLength
    bookingsLength++
    return bookingID
}

function checkSpots(spots, eventID){
    let currentEvent = findEvent(eventID);
    let currentBookingsIDs = currentEvent.bookings;
    let currentBookings = makeBookingList(currentBookingsIDs);
    let availableSpots = currentEvent.capacity
    for(var i = 0; i < currentBookings.length; i++){
        availableSpots -= currentBookings[i].spots
    }
    availableSpots -= spots
    if(availableSpots > 0){return true}
    return false
}

function validateCreateBookingInfo(bookingDetails){
    if(bookingDetails.tel != undefined || bookingDetails.email != undefined){
        let spotsOverZero = bookingDetails.spots > 0;
        let validSpots = false;
        if(spotsOverZero){validSpots = checkSpots(bookingDetails.spots, bookingDetails.eventID)}
        if(spotsOverZero && validSpots){return true}
    }
    return false

}

function createBooking(bookingDetails){
    if(validateCreateBookingInfo(bookingDetails)){
        if(bookingDetails.tel == undefined){bookingDetails.tel = ""}
        if(bookingDetails.email == undefined){bookingDetails.email = ""}
        let booking = {
            id: generateBookingID(),
            firstName: bookingDetails.firstName,
            lastName: bookingDetails.lastName,
            tel: bookingDetails.tel,
            email: bookingDetails.email,
            spots: bookingDetails.spots
        };
        let currentEVent = findEvent(bookingDetails.eventID);
        currentEVent.bookings.push(booking.id)
        bookings.push(booking)
        return booking
    }
    else{
        return -1
    }
}

function deleteAllEvents(){
    if(events.length > 0){
        let retEvents = [];
        for(var i = 0; i < events.length; i++){
            let bookingsArr = makeBookingList(events[i].bookings)
            events[i].bookings = bookingsArr;
        }
        retEvents = events.slice();
        events = []
        return retEvents;
    }
    return -1
}

function deleteEvent(eventIDstr){
    let eventID = parseInt(eventIDstr);
    let retEvent = findEvent(eventID);
    if(retEvent !== -1 && retEvent.bookings.length === 0) {
        let eventIndex = findEventIndex(eventID);
        if (eventIndex !== -1) {
            events.splice(eventIndex, 1);
            return retEvent
        } else {
            return -1
        }
    }
    return -1
}

function findEventIndex(eventID){
    for(var i = 0; i < events.length; i++){
        if(eventID === events[i].id){return i}
    }
    return -1
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

// Create Event
server.post("/api/v1/events/createEvent", (req, res) => {
    var eventParams = req.body;
    var retEvent = createEvent(eventParams);
    console.log('RetEvent: ' + retEvent);
    if(retEvent !== -1){
        res.status(201).send(retEvent)
    }
    else{
        res.status(400).send("Invalid event info")
    }
});

// Create Booking
server.post("/api/v1/events/event/bookings/createBooking", (req, res) => {
    var bookingParams = req.body;
    var retBooking = createBooking(bookingParams);
    if(retBooking !== -1){
        res.status(201).send(retBooking)
    }
    else{
        res.status(400).send("Invalid booking info")
    }
});

// Delete Event
server.delete("/api/v1/events/event/:eventID/deleteEvent", (req , res) => {
    let eventID = req.params.eventID
    let retEvent = deleteEvent(eventID)
    if(retEvent !== -1){
        res.status(200).send(retEvent)
    }
    else{
        res.status(400).send("Invalid event info")
    }
});

// Delete All
server.delete("/api/v1/events/deleteAllEvents", (req, res) =>{
    let retEvents = deleteAllEvents()
    if(retEvents !== -1){
        res.status(200).send(retEvents)
    }
    else{
        res.status(400).send(retEvents)
    }
});

// Default for not allowed statements
server.use("*", (req, res) => {
    res.status(405).send("This request is not allowed.")
});




// requests //
// ----------------------------------------------------------------------- //
//

requester.delete(url + "events/deleteAllEVents")
    .then((res) => {
        console.log("Delete all events successful")
        console.log("Events deleted :"+ res.data)
    })
    .catch((error) => {
        console.log("Delete events not successfull")
        console.log("error is "+ error)
    })

// requester.post(url + "events/event/bookings/createBooking",{
//     eventID: 0,
//     firstName: "Loki",
//     lastName: "LOKI!",
//     tel: 123467,
//     spots: 5
// })
//     .then((res) => {
//         console.log("Create booking : \n" + res.data)
//     })
//     .catch((error) => {
//         console.log("create booking response error");
//         console.log("error res is: " + error)
//     });

// requester.delete(url+"events/event/100/deleteEVent")
//     .then((res) => {
//         console.log("Deleted event: "+res.data)
//     })
//     .catch((error) => {
//         console.log("delete event response error")
//         console.log("error is: "+ error)
//     });

// requester.post(url + "events/createEvent",{
//     name: "The Wolf of Wall Street",
//     capacity: "40",
//     startDate: "2020-03-10 22:30:00",
//     endDate: "2020-03-11 00:45:00",
//     description: "Based on the true story of Jordan Belfort",
//     location: "Egilshöll Salur 1"})
//     .then((res) => {
//         console.log("Specific booking for event: \n" + res.data)
//     })
//     .catch((error) => {
//         console.log("create event response error");
//         console.log("error res is: " + error)
//     });
//
//
//
// requester.get(url + "events", {
// })
// .then((res) => {
//     console.log("get response is working");
//     console.log("Event list: \n" + res.data)
// })
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
//
//
//


