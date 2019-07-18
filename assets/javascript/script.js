var config = {
    apiKey: "AIzaSyAEL6QgOtfN-TEYZQjxXnuk_E0vbOMlUPw",
    authDomain: "train-scheduler-99c57.firebaseapp.com",
    databaseURL: "https://train-scheduler-99c57.firebaseio.com",
    projectId: "train-scheduler-99c57",
    storageBucket: "",
    messagingSenderId: "486602279632"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};

$("#submitBtn").on("click", function () {
    event.preventDefault();

    var train = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTime = $("#first-train").val().trim();

    var trainInfo = {
        formtrain: train,
        formdestination: destination,
        formfrequency: frequency,
        formfirsttime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(trainInfo);

    console.log(trainInfo.formtrain);
    console.log(trainInfo.formdestination);
    console.log(trainInfo.formfrequency);
    console.log(trainInfo.formfirsttime);
    console.log(trainInfo.dateAdded);


    $("#train-name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#first-train").val("");

});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

    $("#currentTime").text(currentTime.format("hh:mm a"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Frequecy: " + diffTime);

    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);

    var minutesAway = frequency - tRemainder;
    console.log("Minutes until next train " + minutesAway);

    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("Arrival: " + moment(nextArrival).format("hh:mm a"));

    $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

});