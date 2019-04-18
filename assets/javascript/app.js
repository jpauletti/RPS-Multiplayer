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

// player info
var players = database.ref("/players");

// whose turn it is
var turn = database.ref("/turn");

var playerOne = null;
var playerTwo = null;
var yourPlayer = "";

var numOfPlayers = 0;
// listen to if there is a connection
connected.on("value", function(snapshot) {
    // if connected
    if (snapshot.val()) {
        console.log("connected");

        // add user to the connections list
        var conn = connections.push(true);

        // if (numOfPlayers <= 2) {
        //     // add user to the connections list
        //     var conn = connections.push(true);
        //     numOfPlayers++;
        // } 
        // else {
        //     numOfPlayers = 0;
        //     var i = 0;
        //     database.ref("/connections" + i)
        //     numO
        // }

        // remove user when they disconnect
        conn.onDisconnect().remove();

    } else {
        console.log("disconnected");
    }
});


connections.on("child_added", function(snapshot) { // do I need this????
    console.log("child added");
    console.log(snapshot.key);
    var key = snapshot.key;

    // playerOne = snapshot.key;
    // console.log(playerOne);

    if (!playerOne) {
        playerOne = key;
        yourPlayer = "playerOne";
        players.push({
            id: key,
            name: yourPlayer,
            wins: 0,
            losses: 0,
            ties: 0
        });
    } else {
        playerTwo = key;
        yourPlayer = "playerTwo";
        players.push({
            id: key,
            name: yourPlayer,
            wins: 0,
            losses: 0,
            ties: 0
        });
    }
    
});

connections.on("value", function (snapshot) {
    var numChildren = snapshot.numChildren();
    console.log("value watch: " + snapshot.key);

    // if () {}

    if (numChildren > 2) {
        console.log("more than 2 people trying to play");
        // code here to hide playing section - show user a "players full - try later" message


        // show sections to play here
    } else if (numChildren === 1) {
        console.log("only one person here");
        // message about "wait for another person to join"

    } else {
        console.log("<= 2 people - let's play!");
        // loop through and assign each to player1 or player2
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;

            if (!playerOne) {
                playerOne = key;
                yourPlayer = key;
                players.push({
                    id: key,
                    name: "",
                    wins: 0,
                    losses: 0,
                    ties: 0
                });
            } else {
                playerTwo = key;
                yourPlayer = key;
                players.push({
                    id: key,
                    name: "",
                    wins: 0,
                    losses: 0,
                    ties: 0
                });
            }

            console.log("player1: " + playerOne);
            console.log("playertwo: " + playerTwo);
        });
    }

});

// connections.child(playerOne).on();








// // ==================================================================================================
// RPS GAME

// know when 2 people have joined the game
// after that, every following group of 2 gets a new game created for them

    // know when each player clicks on rock, paper, or scissors and save their choice


// hover on image, show text
var test = "";
$("img").on("mouseenter mouseleave", function () {
    test = $(this);
    var id = $(this).attr("id");
    console.log($(this).parent().parent().next().children(".choice-" + id).html());
    $(this).parent().parent().next().children(".choice-" + id).children().toggleClass("hide");
})



var app = {
    $rock: $("#rock"),
    $paper: $("#paper"),
    $scissors: $("#scissors")
};

app.$rock.on("click", function () {
    console.log("rock");

    if (turn === yourPlayer) {
        // save choice
        // go to next turn
    } else {
        // nothing bc not your turn
    }
})

app.$paper.on("click", function () {
    console.log("paper");
});

app.$scissors.on("click", function () {
    console.log("scissors");
});


// if (connections.child(playerOne))
// console.log(connections.hasChild(playerOne));
// console.log(database.child(playerOne));


// if player 1 wins (all possible ways),
// p1wins++

// if player 2 wins (all possible ways),
// p2wins++

// otherwise, it's a tie