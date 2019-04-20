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
// var connected = database.ref(".info/connected");

// player info
var players = database.ref("/players");

// whose turn it is
var turn = database.ref().child("turn");

var playerOne = null;
var playerTwo = null;
var yourPlayer = "";
var yourPlayerName = "";



players.on("value", function (playerSnapshot) {

    if (playerSnapshot.hasChild("player1")) {
        playerOne = playerSnapshot.child("player1").val();

        // update page
        $(".player-one-name").text(playerOne.name);
        // make updated "scores" green for a moment
        $("#p1-wins").text(playerOne.wins).css("color", "green");
        $("#p1-losses").text(playerOne.losses).css("color", "green");
        $("#p1-ties").text(playerOne.ties).css("color", "green");

        // go back to black color after 1 second
        var timeout = setTimeout(function () {
            $("#p1-wins").css("color", "black");
            $("#p1-losses").css("color", "black");
            $("#p1-ties").css("color", "black");
        }, 1000);
    }
    
    if (playerSnapshot.hasChild("player2")) {
        playerTwo = playerSnapshot.child("player2").val();

        // update page
        $(".player-two-name").text(playerTwo.name);
        // make updated "scores" green for a moment
        $("#p2-wins").text(playerTwo.wins).css("color", "green");
        $("#p2-losses").text(playerTwo.losses).css("color", "green");
        $("#p2-ties").text(playerTwo.ties).css("color", "green");

        // go back to black color after 1 second
        var timeout = setTimeout(function () {
            $("#p2-wins").css("color", "black");
            $("#p2-losses").css("color", "black");
            $("#p2-ties").css("color", "black");
        }, 1000);
    }
}, function (errorObject) {
    console.log("an error occurred");
    console.log(errorObject.code);
});


// players.child("player1").on("value", function (p1snap) {

// })



// player leaves game
players.on("child_removed", function (removedSnapshot) {
    console.log("child removed");

    var removedPlayer = removedSnapshot.val();
    console.log(removedPlayer.name);

    // remove name from page
    if (removedPlayer.name === playerOne.name) {
        console.log("player one match");
        // remove player name from html
        $(".player-one-name").text("waiting for player one");
    } else {
        console.log("player two match");
        // remove player name from html
        $(".player-two-name").text("waiting for player two");
    }

}, function (errorObject) {
    console.log("an error occurred");
    console.log(errorObject.code);
});





turn.on("value", function (turnSnapshot) {
    turn = turnSnapshot.val();
    // console.log(turn);

    if (turn === 1) {
        $(".player-turn").text("Player One");
    } else if (turn === 2) {
        $(".player-turn").text("Player Two");
    }
}, function (errorObject) {
    console.log("an error occurred");
    console.log(errorObject.code);
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
        console.log(choice);

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
        console.log(choice);

        // update DB
        players.child("player2").set(playerTwo);

        // then
        // DECIDE WINNER
        console.log(playerOne.choice);
        console.log(playerTwo.choice);
        if (playerOne.choice === playerTwo.choice) {
            console.log("tie");
            playerOne.ties++;
            playerTwo.ties++;
            $("#message").text("It's a tie.");
        } else if ((playerOne.choice === "rock" && playerTwo.choice === "scissors") || playerOne.choice === "scissors" && playerTwo.choice === "paper" || playerOne.choice === "paper" && playerTwo.choice === "rock") {
            console.log("player 1 wins this round");
            playerOne.wins++;
            playerTwo.losses++;
            $("#message").text("Player One Wins!");
        } else {
            console.log("player 2 wins this round");
            playerTwo.wins++;
            playerOne.losses++;
            $("#message").text("Player Two Wins!");
        }
        console.log(playerTwo);

        // clear choices for next round
        // playerOne.choice = "";  // why does removing this, make player 2 work again?
        // playerTwo.choice = "";
        console.log(playerTwo);
        players.set({
            player1: playerOne,
            player2: playerTwo
        });
        console.log(playerTwo);


        // change turn
        turn = 1;
        database.ref().child("turn").set(turn);
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