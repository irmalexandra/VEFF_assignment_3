// database //
// -------------------------------------------------------------------------------------//

var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [8,16,33] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [34,39] },
    { id: 2, name: "third event", description: "Some place", location: "Some loc", capacity: 50, startDate: new Date(Date.UTC(2020, 03, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 03, 12, 16, 0)), bookings: [77] },
    { id: 3, name: "empty event", description: "Some place", location: "Some loc", capacity: 50, startDate: new Date(Date.UTC(2020, 03, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 03, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 8, firstName: "person_08", lastName: "p08", tel: "0000008", email: "p8@", spots: 8},
    { id: 16, firstName: "person_33", lastName: "p33", tel: "0000033", email: "p33@", spots: 3},
    { id: 33, firstName: "person_16", lastName: "p16", tel: "0000016", email: "p16@", spots: 10},
    { id: 34, firstName: "person_07", lastName: "p07", tel: "0000007", email: "p7@", spots: 2},
    { id: 39, firstName: "person_22", lastName: "p22", tel: "0000022", email: "p22@", spots: 1},
    { id: 46, firstName: "person_03", lastName: "p03", tel: "0000003", email: "p3@", spots: 0},
    { id: 77, firstName: "person_04", lastName: "p04", tel: "0000004", email: "p4@", spots: 5}
];

// CONSTANTS //
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.json());
server.use(cors());

const hostname = 'localhost';
const port = process.env.PORT || 3000;

var eventsLength = events.length;
var bookingsLength = bookings.length;


// ---------------------------------------------------------------//

// functions //

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
// ---------------------------------------------------------------------//
// Server listener
server.listen(port, hostname, () => {
    console.log("listening on port " + port + " and hostname " + hostname)
});

// Read All Events
server.get("/api/v1/events", (req, res) => {
    eventList = makeEventList();
    
    if (eventList.length > 0) {
        res.status(200).send(eventList);
    }
    else {
        res.status(404).send("No events found")
    }
});
