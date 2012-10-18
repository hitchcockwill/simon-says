// Simple Simon - Version 1
// Created by Will Hitchcock

var round;
var currPress;
var boxToPress;
var gameScore;
var BOARD;
var gameSpeed;
var animating = true;
var gameOver;

$(document).ready(function() {

    $("#start").click(function(event) {
        event.preventDefault;
        $(this).html("New game");
        simon();
    });

    $("#board > div").click(function() {
        if (!animating && !gameOver) {
            var clickSpeed = 200;
            var box = $(this).index();
            flashSingle(box, clickSpeed);
            press(box);
        }
    });

    //Global Variables
    BOARD = $("#board > div");
});

function simon() {
    round = 0;
    gameSpeed = 500;
    boxToPress = [];
    gameOver = false;
    
    BOARD.children().removeClass("wrong replace");
    $("#round h4").removeClass("gameOver");
    gameScore = 0;
    printScore();
    nextRound();
}

function press(box) {
    if (currPress < round - 1 && box === boxToPress[currPress]) {
        gameScore++;
        printScore();
        currPress++;
    }
    else if (currPress === round - 1 && box === boxToPress[currPress]) {
        BOARD.parent().addClass("noShadow");
        /*for (i = 0; i < BOARD.length; i++) {
            flashBoxFull(i, gameSpeed * 2);
        } */
        var t = setTimeout(function() {
            nextRound();
        },
        gameSpeed * 4);
        gameScore++;
        printScore();
    }
    else {
        BOARD.eq(box).children().addClass("replace wrong");
        flashSingle(box, gameSpeed*2);
        printScore();
        gameOver = true;
        printGameOver();
    }
}

function nextRound() {
    BOARD.parent().removeClass("noShadow");
    printRound();
    boxToPress[round] = randomBox();
    currPress = 0;
    round++;
    if ((round + 1) % 5 === 0) {
        gameSpeed -= 50;
    }
    animating = true;
  	flashBoxFull(0, gameSpeed);
}


//Helper Methods
function randomBox() {
    var number = Math.floor(Math.random() * 4);
    return number;
}

function flashBoxFull(index, speed) {
    var count = index;
    var box;
	var theSpeed = speed;
	
	playAudio(boxToPress[count]);
    box = BOARD.eq(boxToPress[count]);
    box.children().animate({
        "opacity": "1"
    },
    theSpeed,
    function() {
        box.children().animate({
            "opacity": "0"
        },
        theSpeed,
        function() {
            if (boxToPress[count + 1] != undefined) {
				count++;
				flashBoxFull(count, speed);	
			} else {
            	animating = false;
			}
        });
    });
}

function flashSingle(index, speed) {
    playAudio(index);
    animating = true;
    var box = BOARD.eq(index);
    box.children().animate({
        "opacity": "1"
    },
    speed,
    function() {
        box.children().animate({
            "opacity": "0"
        },
        speed, function(){animating=false;});
    });
}

//User Interface Manipulation
function printGameOver() {
    $("#round h4").addClass("gameOver").html("game</br>over");
}

function printScore() {
    $("#score h4").html(gameScore);
}
function printRound() {
    $("#round h4").html(round + 1);
}

// Audio Stuff 
function playAudio(index) {
    var audio =  $(".audio" + index)[0];
    console.log(audio)
    audio.play();
}