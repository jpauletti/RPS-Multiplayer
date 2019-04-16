// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGGh9CwznHMYSbhqQgaGAM5ZcDXoYfba8",
    authDomain: "rps-multiplayer-8dfb9.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-8dfb9.firebaseio.com",
    projectId: "rps-multiplayer-8dfb9",
    storageBucket: "rps-multiplayer-8dfb9.appspot.com",
    messagingSenderId: "152178685678"
};

firebase.initializeApp(config);

var database = firebase.database();

// store connections here
var connections = database.ref("/connections");

// updated when the client's connections state changes - boolean value - true if connected, false if not
var connected = database.ref(".info/connected");

// listen to if there is a connection
connected.on("value", function(snapshot) {
    // if connected
    if (snapshot.val()) {
        console.log("connected");

        // add user to the connections list
        var conn = connections.push(true);

        // remove user when they disconnect
        conn.onDisconnect().remove();

    } else {
        console.log("disconnected");
    }
});


connections.on("child_added", function(snapshot) { // do I need this????
    console.log("child added");
});

connections.on("value", function (snapshot) {
    var numChildren = snapshot.numChildren();

    if (numChildren > 2) {
        console.log("more than 2 people trying to play");
        // show sections to play here
    } else {
        console.log("<= 2 people - let's play!");
        // code here to hide playing section - show user a "players full - try later" message
    }

});








// // ==================================================================================================
// // from practice exercise

// // Create a variable to reference the database.
// var database = firebase.database();

// // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// // connectionsRef references a specific location in our database.
// // All of our connections will be stored in this directory.
// var connectionsRef = database.ref("/connections");

// // '.info/connected' is a special location provided by Firebase that is updated every time
// // the client's connection state changes.
// // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
// var connectedRef = database.ref(".info/connected");

// // When the client's connection state changes...
// connectedRef.on("value", function (snap) {

//     // If they are connected..
//     if (snap.val()) {

//         // Add user to the connections list.
//         var con = connectionsRef.push(true);

//         // Remove user from the connection list when they disconnect.
//         con.onDisconnect().remove();
//     }
// });

// // When first loaded or when the connections list changes...
// connectionsRef.on("value", function (snapshot) {

//     // Display the viewer count in the html.
//     // The number of online users is the number of children in the connections list.
//     $("#watchers").text(snapshot.numChildren());
// });

// // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// // Set Initial Counter
// var initialValue = 100;
// var clickCounter = initialValue;

// // At the page load and subsequent value changes, get a snapshot of the local data.
// // This callback allows the page to stay updated with the values in firebase node "clicks"
// database.ref("/clicks").on("value", function (snapshot) {

//     // Print the local data to the console.
//     console.log(snapshot.val());


//     // Change the HTML to reflect the local value in firebase.
//     clickCounter = snapshot.val().clickCount;

//     // Log the value of the clickCounter
//     console.log(clickCounter);

//     // Change the HTML to reflect the local value in firebase.
//     $("#click-value").text(clickCounter);

//     // If any errors are experienced, log them to console.
// }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
// });

// // --------------------------------------------------------------

// // Whenever a user clicks the click-button
// $("#click-button").on("click", function () {

//     // Reduce the clickCounter by 1
//     clickCounter--;

//     // Alert User and reset the counter
//     if (clickCounter === 0) {
//         alert("Phew! You made it! That sure was a lot of clicking.");
//         clickCounter = initialValue;
//     }

//     // Save new value to Firebase
//     database.ref("/clicks").set({
//         clickCount: clickCounter
//     });

//     // Log the value of clickCounter
//     console.log(clickCounter);
// });

// // Whenever a user clicks the restart button
// $("#restart-button").on("click", function () {

//     // Set the clickCounter back to initialValue
//     clickCounter = initialValue;

//     // Save new value to Firebase
//     database.ref("/clicks").set({
//         clickCount: clickCounter
//     });

//     // Log the value of clickCounter
//     console.log(clickCounter);

//     // Change the HTML Values
//     $("#click-value").text(clickCounter);
// });
