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
var turn = database.ref().child("turn");

var playerOneKey = null;
var playerTwoKey = null;
var yourKey = "";

var playerOne = null;
var playerTwo = null;
var yourPlayer = "";
var yourPlayerName = "";

var p1Wins = 0;
var p1Losses = 0;
var p1Ties = 0;

var p2Wins = 0;
var p2Losses = 0;
var p2Ties = 0;


// listen to if there is a connection
// connected.on("value", function(snapshot) {
//     // if connected
//     if (snapshot.val()) {
//         console.log("connected");

//         // add user to the connections list
//         var conn = connections.push(true);

//         // remove user when they disconnect
//         conn.onDisconnect().remove();
//         // remove the player in players folder
//         // conn.onDisconnect(function () {
//         // });

//     } else {
//         console.log("disconnected");
//     }
// });


// connections.on("child_added", function(snapshot) { // do I need this????
//     console.log("child added");
//     console.log(snapshot.key);
//     var key = snapshot.key;

//     // don't add them if there are already 2 people here
//     var numOfChildren = 0;
//     players.once("value")
//         .then(function (snapshot) {
//             numOfChildren = snapshot.numChildren();
//             console.log(numOfChildren);
//         });
//     console.log(numOfChildren);

//     if (numOfChildren <= 2) {
//         if (!playerOneKey) {
//             playerOneKey = key;
//             yourPlayer = "playerOne";
//             yourKey = playerOneKey;

//         } else if (playerOneKey !== null && !playerTwoKey) {
//             playerTwoKey = key;
//             yourPlayer = "playerTwo";
//             yourKey = playerOneKey;

//         }
//     }

//     console.log(yourPlayer);
    
// });

// connections.on("value", function (snapshot) {
//     var numChildren = snapshot.numChildren();
//     console.log("value watch: " + snapshot.key);

//     // if () {}

//     if (numChildren > 2) {
//         console.log("more than 2 people trying to play");
//         // code here to hide playing section - show user a "players full - try later" message


//         // show sections to play here
//     } else if (numChildren === 1) {
//         console.log("only one person here");
//         // message about "wait for another person to join"

//     } else {
//         console.log("<= 2 people - let's play!");
//         // loop through and assign each to player1 or player2
//         snapshot.forEach(function (childSnapshot) {
//             var key = childSnapshot.key;

//         });
//     }
//     console.log("player1: " + playerOneKey);
//     console.log("player2: " + playerTwoKey);

// });



players.on("value", function (playerSnapshot) {

    if (playerSnapshot.hasChild("player1")) {
        playerOne = playerSnapshot.child("player1").val();

        // update page
        $(".player-one-name").text(playerOne.name);
        $("#p1-wins").text(playerOne.wins);
        $("#p1-losses").text(playerOne.losses);
        $("#p1-ties").text(playerOne.ties);
    }
    
    if (playerSnapshot.child("player2").exists()) {
        playerTwo = playerSnapshot.child("player2").val();

        // update page
        $(".player-two-name").text(playerTwo.name);
        $("#p2-wins").text(playerTwo.wins);
        $("#p2-losses").text(playerTwo.losses);
        $("#p2-ties").text(playerTwo.ties);
    }
});




players.on("child_removed", function (removedSnapshot) {
    console.log("child removed");

    var removedPlayer = removedSnapshot.val();
    console.log(removedPlayer);
    console.log(playerOne);

    var removedName = removedSnapshot.val().name;

    if (removedPlayer.name === playerOne.name) {
        console.log("player one match");
        // remove player name from html
        $(".player-one-name").text("waiting for player one");
    } else {
        console.log("player two match");
        // remove player name from html
        $(".player-two-name").text("waiting for player two");
    }




});





turn.on("value", function (turnSnapshot) {
    turn = turnSnapshot.val();
    // console.log(turn);

    if (turn === 1) {
        $(".player-turn").text("Player One");
    } else if (turn === 2) {
        $(".player-turn").text("Player Two");
    }
});






// // ==================================================================================================
// RPS GAME

// know when 2 people have joined the game
// after that, every following group of 2 gets a new game created for them




var app = {
    $rock: $("#rock"),
    $paper: $("#paper"),
    $scissors: $("#scissors")
};








$("#add-name").on("click", function (event) {
    event.preventDefault();
    // console.log("submit");

    // get name
    var name = $("#name").val().trim();
    yourPlayer = name;

    // console.log(playerOne);
    // console.log(playerTwo);

    // if (yourPlayer === "playerOne") {
    if (playerOne === null) {
        // console.log("player one");
        
        // use it as player one name
        $(".player-one-name").text(name);
        
        // set player info
        playerOne = {
            name: name,
            wins: 0,
            losses: 0,
            ties: 0,
            choice: ""
        }
    
        // set player 1
        // update DB
        players.child("/player1").set(playerOne);

        // remove player if they disconnect or refresh the page
        players.child("player1").onDisconnect().remove();

        // set turn to 1; player 1 goes first
        database.ref().child("turn").set(1);
        

    } else if (playerOne !== null && playerTwo === null) {
        console.log("player two");
        // use it as player two name
        $(".player-two-name").text(name);

        // set player info
        playerTwo = {
            name: name,
            wins: 0,
            losses: 0,
            ties: 0,
            choice: ""
        }

        // set player 2
        // update DB
        players.child("/player2").set(playerTwo);

        // remove player if they disconnect or refresh the page
        players.child("player2").onDisconnect().remove();

    }

    // clear input
    $("#name").val("");

});








// watch player one's choices
$(".p1choice").on("click", function () {

    // if both players are here & it's player one's turn
    if (playerOne && playerTwo && (yourPlayer === playerOne.name) && (turn === 1)) {
        var choice = $(this).attr("id");
        playerOne.choice = choice;

        // update DB
        players.child("player1").set(playerOne);

        // change turn
        turn = 2;
        database.ref().child("turn").set(turn);

    }


    
})



// watch player two's choices
$(".p2choice").on("click", function () {

    // if both players are here & it's player two's turn
    if (playerOne && playerTwo && (yourPlayer === playerTwo.name) && (turn === 2)) {
        var choice = $(this).attr("id");
        playerTwo.choice = choice;

        // update DB
        players.child("player2").set(playerTwo);

        // change turn
        turn = 1;
        database.ref().child("turn").set(turn);

        // then
        // DECIDE WINNER
        console.log(playerOne.choice);
        console.log(playerTwo.choice);
        if (playerOne.choice === playerTwo.choice) {
            console.log("tie");
            playerOne.ties++;
            playerTwo.ties++;
        } else if ((playerOne.choice === "rock" && playerTwo.choice === "scissors") || playerOne.choice === "scissors" && playerTwo.choice === "paper" || playerOne.choice === "paper" && playerTwo.choice === "rock") {
            console.log("player 1 wins this round");
            playerOne.wins++;
        } else {
            console.log("player 2 wins this round");
            playerTwo.wins++;
        }

        // clear choices for next round
        playerOne.choice = "";
        playerTwo.choice = "";
        players.child("player1").set(playerOne);
        players.child("player2").set(playerTwo);
    }

})





// app.$rock.on("click", function () {
//     console.log("rock");

//     if (turn === yourPlayer) {
//         // save choice
//         // go to next turn
//     } else {
//         // nothing bc not your turn
//     }
// })

// app.$paper.on("click", function () {
//     console.log("paper");
// });

// app.$scissors.on("click", function () {
//     console.log("scissors");
// });


// if (connections.child(playerOne))
// console.log(connections.hasChild(playerOne));
// console.log(database.child(playerOne));


// if player 1 wins (all possible ways),
// p1wins++

// if player 2 wins (all possible ways),
// p2wins++

// otherwise, it's a tie