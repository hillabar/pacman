
var user;
var dictionary;
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

var userName = document.getElementById('usernameID').value;
var firstName = formAttributes[5].value;
var lastName = formAttributes[2].value;
var date = formAttributes[3].value;
var password = document.getElementById('passwordID').value;
dictionary.add(userName, password);
$('#register').hide(500);
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
/*----------------------------------------------------------?????????????????????*/
$(document).on("click", ".alert", function(e) {
  bootbox.alert("We are Eyal Arviv and Shani Houri and we love web programming." +
    "<br/> It was hard to find the right code and js/css files to use for this assignment", function() {
    console.log("Alert Callback");
    $("#welcome").show(1000);
  });
});

/***********************************/
