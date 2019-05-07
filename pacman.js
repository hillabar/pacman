
var user;
var dictionary;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var shape=new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var time_waited;
var interval;
var interval2;
var keysDown = {};
var ghosts;
var notInitiateGhosts;
var ghostsNumber;
var img = new Image();
img.src = 'resources/ghost.png';
var cherryBonus = new Image();
cherryBonus.src = 'resources/cherryBonus.png';
var bonusPosition = new Object();
var bonusEaten;
var fruitSound = new sound("resources/sounds/pacman_eatfruit.wav");
var lifeBonus = new Image();
lifeBonus.src = 'resources/life.png';
var lifePosition = new Object();
var lifeEaten = false;

var lifes = 3;
var direction;
var food_remain;

var backgroundMusic;
var initiateGame = false;
var cancel = new Array(2);
cancel[0] = false;
cancel[1] = false;

var points;
var color_5_points;
var color_15_points;
var color_25_points;
var gameTime;
var timeBonus = new Image();
timeBonus.src = 'resources/time.png';
var timePosition = new Object();
var timeEaten = false;
var lblScore = document.getElementById("lblScore");
var lblTime = document.getElementById("lblTime");
var lblLifes= document.getElementById("lblLifes");
function Start() {
  canvas.focus();
  notInitiateGhosts = true;
  direction = 4;
  if(!initiateGame) {
    if($("#userName").text() != user) {
      $("#userName").text("Hello " + user + "!");
    }
    var container = document.getElementById('container');
    var colorList = {"5 points": color_5_points, "15 points": color_15_points, "25 points": color_25_points};
    $("#container").empty();
    for (var key in colorList) {
      var boxContainer = document.createElement("DIV");
      var box = document.createElement("DIV");
      var label = document.createElement("SPAN");

      label.innerHTML = key;
      box.className = "box";
      box.style.backgroundColor = colorList[key];

      boxContainer.appendChild(box);
      boxContainer.appendChild(label);

      container.appendChild(boxContainer);
    }

    ghosts = new Array(ghostsNumber);
    backgroundMusic = new sound("resources/sounds/Pac-man_theme_remix.mp3");
    backgroundMusic.play();
    lblLifes.value = lifes;
    score = 0;
    food_remain = points;
    start_time = new Date();
    initiateGame = true;
    var numofWalls = 100 - 3 - ghostsNumber - food_remain;
    var food_5_remain = Math.floor(food_remain*0.6);
    var food_15_remain = Math.floor(food_remain*0.3);
    var food_25_remain = Math.floor(food_remain*0.1);
    var allFood = food_5_remain+food_15_remain+food_25_remain;
    food_remain = allFood;
    board = new Array();
    pac_color="yellow";
    var placePacman = false;
    var placeLife = false;
    var placeTime = false;
    var placeSingle = placePacman && placeLife && placeTime;
    for (var i = 0; i < 10; i++) {
      board[i] = new Array();
      for (var j = 0; j < 10; j++) {

          board[i][j] = 0;
      }
    }
    var is = [1,8,1,8,3,6,3,6,4,5,4,5,4,5,0,9,0,9,2,7,2,7,1,8,1,8];
    var js = [1,1,8,8,5,5,6,6,6,6,2,2,3,3,4,4,5,5,1,1,8,8,2,2,7,7];
    var index = 0;
    while(numofWalls > 0 && index < 25)
    {
      board[is[index]][js[index]] = 4;
      numofWalls--;
      index++;
    }
    while(!placeSingle)
    {
      var emptyCell = findRandomEmptyCell(board);
      var corner = (emptyCell[0] == 0 && emptyCell[1] == 0) || (emptyCell[0] == 0 && emptyCell[1] == 9) || (emptyCell[0] == 9 && emptyCell[1] == 9) || (emptyCell[0] == 9 && emptyCell[1] == 0);
      if(corner)
        continue;
      if(!placePacman)
      {
        board[emptyCell[0]][emptyCell[1]] = 2;
        shape.i=emptyCell[0];
        shape.j=emptyCell[1];
        placePacman = true;
        if(placeTime && placeLife && placePacman)
          placeSingle = true;
        continue;
      }
      if(!placeLife)
      {
        board[emptyCell[0]][emptyCell[1]] = "life";
        placeLife = true;
        lifePosition.i = emptyCell[0];
        lifePosition.j = emptyCell[1];
        context.drawImage(lifeBonus, lifePosition.i*60,lifePosition.j*60,60,60);
        if(placeTime && placeLife && placePacman)
          placeSingle = true;
        continue;
      }
      if(!placeTime)
      {
        board[emptyCell[0]][emptyCell[1]] = "time";
        timePosition.i = emptyCell[0];
        timePosition.j = emptyCell[1];
        context.drawImage(timeBonus, timePosition.i*60 + 20,timePosition.j*60 + 20,40,40);
        placeTime = true;
        if(placeTime && placeLife && placePacman)
          placeSingle = true;
        continue;
      }
    }

    while (food_remain > 0) {
      var emptyCell = findRandomEmptyCell(board);
      if(food_5_remain > 0) {
        board[emptyCell[0]][emptyCell[1]] = 5;
        food_5_remain--;
        food_remain--;
        continue;
      }
      if(food_15_remain > 0) {
        board[emptyCell[0]][emptyCell[1]] = 15;
        food_15_remain--;
        food_remain--;
        continue;
      }
      if(food_25_remain > 0) {
        board[emptyCell[0]][emptyCell[1]] = 25;
        food_25_remain--;
        food_remain--;
        continue;
      }
    }
    food_remain = allFood;
    bonusEaten = false;
    bonusPosition.x = 540;
    bonusPosition.y = 540;
    context.drawImage(cherryBonus,bonusPosition.x,bonusPosition.y,60,60);
  }
  else if(cancel[0]){
    backgroundMusic.play();
    cancel[0] = false;
  }
  else{
    var emptyCell = findRandomEmptyCell(board);
    board[shape.i][shape.j] = 0;
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    board[emptyCell[0]][emptyCell[1]] = 2;

  }
  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener("keyup", function (e) {
    keysDown[e.keyCode] = false;
  }, false);
  interval=setInterval(UpdatePosition, 150);
}
function ResetGame(){
  window.clearInterval(interval);
  window.clearInterval(interval2);
  backgroundMusic.pause();

}
function findRandomEmptyCell(board){
  var i = Math.floor((Math.random() * 10));
  var j = Math.floor((Math.random() * 10));
  while(board[i][j]!=0)
  {
    i = Math.floor((Math.random() * 10));
    j = Math.floor((Math.random() * 10));
  }
  return [i,j];
}

function GetKeyPressed() {
  if (keysDown[38]) {
    return 1;
  }
  if (keysDown[40]) {
    return 2;
  }
  if (keysDown[37]) {
    return 3;
  }
  if (keysDown[39]) {
    return 4;
  }
}

function Draw() {
  canvas.width=canvas.width; //clean board
  lblScore.value = score;
  lblTime.value = gameTime - time_elapsed;
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var center = new Object();
      center.x = i * 60 + 30;
      center.y = j * 60 + 30;
      if (board[i][j] == 2) {
        drawPacman(center.x, center.y);
      }
      else if (board[i][j] == 5) {
        drawPoint(center.x, center.y, color_5_points, 3);
      }
      else if(board[i][j] == 15){
        drawPoint(center.x, center.y, color_15_points, 5);
      }
      else if(board[i][j] == 25){
        drawPoint(center.x, center.y, color_25_points, 10);
      }
      else if (board[i][j] == 4) {
        context.beginPath();
        context.rect(center.x-30, center.y-30, 60, 60);
        context.fillStyle = "grey"; //color
        context.fill();
      }
      else if(board[i][j] == "life" && !lifeEaten)
      {
        context.drawImage(lifeBonus, lifePosition.i*60,lifePosition.j*60,60,60);
      }
      else if(board[i][j] == "time" && !timeEaten)
      {
        context.drawImage(timeBonus, timePosition.i*60 + 20,timePosition.j*60 + 20,40,40);
      }
    }
  }
  if(!bonusEaten)
    moveBonus();
}

function UpdatePosition() {

  board[shape.i][shape.j]=0;
  var x = GetKeyPressed();
  if(x)
    direction = x;
  if(x==1)
  {
    if(shape.j>0 && board[shape.i][shape.j-1]!=4)
    {
      shape.j--;
    }
  }
  if(x==2)
  {
    if(shape.j<9 && board[shape.i][shape.j+1]!=4)
    {
      shape.j++;
    }
  }
  if(x==3)
  {
    if(shape.i>0 && board[shape.i-1][shape.j]!=4)
    {
      shape.i--;
    }
  }
  if(x==4)
  {
    if(shape.i<9 && board[shape.i+1][shape.j]!=4)
    {
      shape.i++;
    }
  }
  updateBonuses();
  board[shape.i][shape.j]=2;

  Draw();
  if(notInitiateGhosts) {
    if(!cancel[1]) {
      initiateGhosts();
    }
    else{
      drawGhosts();
    }
    cancel[1] = false;
    notInitiateGhosts = false;
    interval2 = setInterval(moveGhosts, 700);
  }
  else
  {
    drawGhosts();
  }
  if(food_remain == 0 || lblTime.value <= 0)
  {
    endGameHandler();
  }

  for(var i = 0; i < ghosts.length; i++) {
    if ((ghosts[i].x / 60) == shape.i && (ghosts[i].y / 60) == shape.j) {
      pacmenEatenHandler();
    }
  }

}
function updateBonuses(){
  if(board[shape.i][shape.j]==5 || board[shape.i][shape.j]==15 || board[shape.i][shape.j]==25)
  {
    score += board[shape.i][shape.j];
    food_remain--;
  }
  else if(board[shape.i][shape.j]== "life" && !lifeEaten)
  {
    lifeEaten = true;
    lblLifes.value++;
  }
  else if(board[shape.i][shape.j]== "time" && !timeEaten)
  {
    timeEaten = true;
    gameTime += 10;
  }
  var currentTime=new Date();
  time_elapsed=Math.floor((currentTime-start_time)/1000);
  if(score>=250&&time_elapsed<=10)
  {
    pac_color="blue";
  }
}

function endGame(string){
  bootbox.confirm({
    message:string,
    buttons: {
      confirm: {
        label: 'New Game',
        className: 'btn-success'
      },
      cancel: {
        label: 'Go to Main Menu',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      console.log("AlertCallback");
      ResetGame();
      $("#game").hide();
      if(result) {
        $("#gameSettings").show(1000);
      }
      else{
        $("#welcome").show(1000);
      }
    }
  });
}
function endGameHandler(){
  setTimeout(function () {
    backgroundMusic.pause();
  }, 1700);
  window.clearInterval(interval);
  window.clearInterval(interval2);
  if(score < 500)
  {
    setTimeout(endGame("Time's up! You can do better, your score is"+score), 200);
  }
  else
  {
    var win = new sound("resources/sounds/Ta_Da.mp3")
    win.play();
    if(lblTime.value <= 0)
      setTimeout(endGame("Time's up! We have a Winner!!! your score is " + score), 200);
    else
      setTimeout(endGame("We have a Winner!!! your score is " + score), 200);
  }
}
function pacmenEatenHandler(){
  var eaten = new sound("resources/sounds/pacman_death.wav");
  lblLifes.value--;
  backgroundMusic.pause();
  setTimeout(function () {
    eaten.play();
  }, 10);
  setTimeout(function () {
    backgroundMusic.play();
  }, 1700);
  Draw();
  window.clearInterval(interval);
  window.clearInterval(interval2);
  if (lblLifes.value == 0) {
    var dead = new sound("resources/sounds/Booing-sound-effect.mp3");
    setTimeout(function(){
      dead.play();
    },10);
    setTimeout(function () {
      backgroundMusic.pause();
    }, 1700);
    setTimeout(endGame("You Lost! your score is " + score), 100);

  }
  else {
    setTimeout(function () {
      Start();
    }, 1500);
  }
}
function initiateGhosts()
{
  ghosts[0] = new Object();
  ghosts[0].x = 0;
  ghosts[0].y = 0;

  if(ghostsNumber > 1) {
    ghosts[1] = new Object();
    ghosts[1].x = 540;
    ghosts[1].y = 0;
  }

  if(ghostsNumber > 2) {
    ghosts[2] = new Object();
    ghosts[2].x = 0;
    ghosts[2].y = 540;
  }
  drawGhosts();
}

function drawGhosts()
{
  for (var i = 0; i < ghostsNumber; i++) {
    context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
  }
}

function moveGhosts()
{
  Draw();
  var r1 = [];
  var r2 = [];
  var r3 = [];
  var r4 = [];
  for (var j = 0; j < ghostsNumber; j++) {
    r1.push(false);
    r2.push(false);
    r3.push(false);
    r4.push(false);
  }
  for (var i = 0; i < ghostsNumber; i++) {
    var r = Math.random();
    var x = ghosts[i].x / 60;
    var y = ghosts[i].y / 60;
    if (x == shape.i && y > shape.j && y > 0 && board[x][y - 1] != 4) {
      ghosts[i].y = ghosts[i].y - 60;
      context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
    }
    else if (x == shape.i && y < shape.j  && y < 9 && board[x][y + 1] != 4) {
      ghosts[i].y = ghosts[i].y + 60;
      context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
    }
    else if (y == shape.j && x > shape.i && x > 0 && board[x - 1][y] != 4) {
      ghosts[i].x = ghosts[i].x - 60;
      context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
    }
    else if (y == shape.j && x < shape.i && x < 9 && board[x + 1][y] != 4) {
      ghosts[i].x = ghosts[i].x + 60;
      context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
    }
    else if (r < 0.25 && !r1[i]) {
      if (x > shape.i && x > 0 && board[x - 1][y] != 4) {
        ghosts[i].x = ghosts[i].x - 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else {
        r1[i] = true;
        i--;
        continue;
      }
    }
    else if (r < 0.5 && !r2[i]) {
      if (x < shape.i && x < 9 && board[x + 1][y] != 4) {
        ghosts[i].x = ghosts[i].x + 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else {
        r2[i] = true;
        i--;
        continue;
      }
    }
    else if (r < 0.75 && !r3[i]) {
      if (y > shape.j && y > 0 && board[x][y - 1] != 4) {
        ghosts[i].y = ghosts[i].y - 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else {
        r3[i] = true;
        i--;
        continue;
      }
    }
    else if(r < 1 && !r4[i]) {
      if (y < shape.j && y < 9 && board[x][y + 1] != 4) {
        ghosts[i].y = ghosts[i].y + 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else {
        r4[i] = true;
        i--;
        continue;
      }
    }
    else{
      if (x > 0 && board[x - 1][y] != 4) {
        ghosts[i].x = ghosts[i].x - 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else if (x < 9 && board[x + 1][y] != 4) {
        ghosts[i].x = ghosts[i].x + 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else if (y > 0 && board[x][y - 1] != 4) {
        ghosts[i].y = ghosts[i].y - 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
      else if(y < 9 && board[x][y + 1] != 4) {
        ghosts[i].y = ghosts[i].y + 60;
        context.drawImage(img, ghosts[i].x, ghosts[i].y, 60, 60);
      }
    }
    if ((ghosts[i].x / 60)  == shape.i && (ghosts[i].y / 60) == shape.j) {
      pacmenEatenHandler();
    }
  }
}

function moveBonus()
{
  var r = Math.random();
  var x = bonusPosition.x / 60;
  var y = bonusPosition.y / 60;
  if(r < 0.25)
  {
    if(x < 9 && board[x+1][y] != 4) {
      bonusPosition.x = bonusPosition.x + 60;
      context.drawImage(cherryBonus,bonusPosition.x,bonusPosition.y,60,60);
    }
    else
      moveBonus();
  }
  else if(r < 0.5)
  {
    if(x > 0 && board[x-1][y] != 4) {
      bonusPosition.x = bonusPosition.x - 60;
      context.drawImage(cherryBonus,bonusPosition.x,bonusPosition.y,60,60);            }
    else
      moveBonus();
  }
  else if(r < 0.75)
  {
    if(y < 9 && board[x][y+1] != 4) {
      bonusPosition.y = bonusPosition.y + 60;
      context.drawImage(cherryBonus,bonusPosition.x,bonusPosition.y,60,60);
    }
    else
      moveBonus();
  }
  else
  {
    if(y > 0 && board[x][y-1] != 4) {
      bonusPosition.y = bonusPosition.y - 60;
      context.drawImage(cherryBonus,bonusPosition.x,bonusPosition.y,60,60);
    }
    else
      moveBonus();
  }

  if(x == shape.i && y == shape.j)
  {
    score += 50;
    bonusEaten = true;
    fruitSound.play();
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.pause = function(){
    this.sound.pause();
  }
}

function drawPoint(x, y, color, radius){
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI); // circle
  context.fillStyle = color; //color
  context.fill();
}

function drawPacman(x, y) {
  var startDraw;
  var endDraw;
  var eyeCenterX;
  var eyeCenterY;
  switch (direction) {
    case 2:
      startDraw = Math.PI * 0.65
      endDraw = Math.PI * 0.35
      eyeCenterX = x + 15;
      eyeCenterY = y - 5;
      break;
    case 1:
      startDraw = Math.PI * 1.65;
      endDraw = Math.PI * 1.35;
      eyeCenterX = x - 15;
      eyeCenterY = y - 5;
      break;
    case 3:
      startDraw = Math.PI * 1.15;
      endDraw = Math.PI * 0.85;
      eyeCenterX = x - 5;
      eyeCenterY = y - 15;
      break;
    case 4:
      startDraw = Math.PI * 0.15;
      endDraw = Math.PI * 1.85;
      eyeCenterX = x + 5;
      eyeCenterY = y - 15;
      break;

  }
  context.beginPath();
  context.arc(x, y, 30, startDraw, endDraw); // half circle
  context.lineTo(x, y);
  context.fillStyle = pac_color; //color
  context.fill();
  context.beginPath();
  context.arc(eyeCenterX, eyeCenterY, 5, 0, 2 * Math.PI); // circle
  context.fillStyle = "black"; //color
  context.fill();


}
/***********************************/



function Dictionary() {
  this.dictionary = [];

  this.add = function(key, value) {
    if (key && value) {
      this.dictionary.push({
        key: key,
        value: value
      });
      return this.dictionary;
    }
  };

  this.find = function(key) {
    for (var i = 0; i < this.dictionary.length; i++) {
      if (this.dictionary[i].key == key)
        return this.dictionary[i].value;
    }
    return -1;
  };
  this.keyExists = function(key){
    for (var i = 0; i < this.dictionary.length; i++) {
      if (this.dictionary[i].key == key)
        return true;
    }
    return false;
  }

}
$(function() {
  if(!dictionary) {
    dictionary = new Dictionary();
  }
  $('.content').show().hide();
  $('#welcome').show(1000);
  dictionary.add('a', 'a'); //default user
});

/*welcome screen buttons*/
$('#registerButton').on('click', function(){
  $('#welcome').hide(500);
  $(".loginForm").val('');
  $('#register').slideDown(500);
});
$('#loginButton').on('click', function() {
  $('#welcome').hide(500);
  $(".loginForm").val('');
  $('#login').slideDown(500);
});

/*register form submit button*/
$('#submit-button').on('submit', function(event){
event.preventDefault();
event.stopPropagation();
var formAttributes = document.getElementsByClassName("form-control");
var userName = formAttributes[0].value;
var firstName = formAttributes[1].value;
var lastName = formAttributes[2].value;
var date = formAttributes[3].value;
var password = formAttributes[5].value;
dictionary.add(userName, password);
$('#register').hide();
$('#welcome').show();
});

/*login button*/
$('#loginBut').on('click', function(event){
  event.preventDefault();
  event.stopPropagation();
  var loginAttributes = document.getElementsByClassName("loginForm");
  var userName = loginAttributes[0].value;
  user = loginAttributes[0].value;
  var password = loginAttributes[1].value;
  if(dictionary.find(userName) == -1 || dictionary.find(userName) != password){
    alert("Incorrect username or password.");
  }
  else{
    //move to game window
    $('#login').hide();
    $('#gameSettings').show();
  }

});

/*menu links*/
$('#refHome').on('click', function(){
  if($("#game").is(':visible')){
    endGameThroughMenu("welcome");
  }
  else {
    $('.content').hide();
    $('#welcome').show(1000);
  }
});
$('#refRegister').on('click', function(){
  if($("#game").is(':visible')) {
    endGameThroughMenu("register");
  }
  else {
    $('.content').hide();
    $(".loginForm").val('');
    $('#register').show(500);
  }
});
$('#refLogin').on('click', function(){
  if($("#game").is(':visible')) {
    endGameThroughMenu("login");
  }
  else {
    $('.content').hide();
    $(".loginForm").val('');
    $('#login').show(500);
  }
});


$('#startGameButton').on('click', function (event) {
  event.preventDefault();
  event.stopPropagation();
  var settings = $('.gameSetting');
  points = settings[0].value; //validate
  color_5_points = settings[1].value;
  color_15_points = settings[2].value;
  color_25_points = settings[3].value;
  gameTime = parseInt(settings[4].value);
  ghostsNumber = parseInt($('#selectNumOfGhosts').val());
  $('#gameSettings').hide();
  $('#game').show(function(){
    initiateGame = false;
    cancel[0] = false;
    cancel[1] = false;
    Start();
  });

});
$(document).on("click", ".alert", function(e) {
  bootbox.alert("We are Eyal Arviv and Shani Houri and we love web programming." +
    "<br/> It was hard to find the right code and js/css files to use for this assignment", function() {
    console.log("Alert Callback");
    $("#welcome").show(1000);
  });
});

$(document).on('click',".newgamebutton", function() {
  time_waited = parseInt(lblTime.value);
  ResetGame();
  bootbox.confirm({
    message:"Tired already?",
    buttons: {
        confirm: {
          label: 'New Game',
          className: 'btn-success'
        },
        cancel: {
          label: 'Resume Game',
          className: 'btn-danger'
        }
    },
    callback: function (result) {

      console.log("AlertCallback");
      if(result) {
        $("#game").hide();
        $("#gameSettings").show(1000);
      }
      else{
        gameTime = time_waited;
        start_time = new Date();
        cancel[0] = true;
        cancel[1] = true;
        Start();
      }
    }
  });
});


function endGameThroughMenu(content){
  time_waited = parseInt(lblTime.value);
  ResetGame();
  bootbox.confirm({
    message:'Leaving already?',
    buttons: {
      confirm: {
        label: 'Leave game',
        className: 'btn-success'
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      console.log("AlertCallback");
      if(result) {
        $("#game").hide();
        if(content == "welcome"){
          $("#welcome").show(1000);
        }
        else if(content == "register"){
          $("#register").slideDown(1000);
        }
        else if(content == "login"){
          $("#login").slideDown(1000);
        }
      }
      else{
        gameTime = time_waited;
        start_time = new Date();
        cancel[0] = true;
        cancel[1] = true;
        Start();
      }
    }
  });
}
/***********************************/
