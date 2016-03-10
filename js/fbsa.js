//file: fbsa.js
function deselect(e) {
  $('.pop').slideFadeToggle(function() {
    e.removeClass('selected');
  });
}
//Popup to get configuration: leftTeam, rightTeam, gameSize, question set.
$(function() {
  $('#doConfig').on('click', function() {
    if($(this).hasClass('selected')) {
      deselect($(this));
    } else {
      $(this).addClass('selected');
      $('.pop').slideFadeToggle();
    }
    return false;
  });
  $('.close').on('click', function() {
    deselect($('#doConfig'));
   console.log('Closed the popup: ' + $('#teamLeft').val() +' -> ' + $('#teamRight').val() + ' -> ' + $('#gameSize').val());
   configure(Number($('#teamLeft').val()), Number($('#teamRight').val()), Number($('#gameSize').val()));
    return false;
  });
});
$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

var items;
var teams =[];
var ballPositions = ['-30px', '200px', '515px', '830px', '1080px'];
var ans= ["right", "wrong"];
var answerColor = ['#FFFFFF','#000000'];
var count=100;
var ballDirection = 0; //will be one of {-1,1} from random draw later.
var ballLocation = 2;
var isVisible = 0; // hide answer is default.
var beep = document.getElementById("beep"); 
var homer = document.getElementById("homer"); 
var goal = document.getElementById("goal"); 
var stop = false;

$(document).ready( function () {
//alert('JQuery is loaded and ready.');
$('#falta').val(count);
$('#configButton').click(function(){
  //alert('Clicked Config Button.');
  
});
$('#showResponse').click(function(){
  isVisible=isVisible^1;
  $('#answer_A').css('color', answerColor[isVisible]);
  $('#rightWrong').focus(); 
});
  $('#rightWrong').change(function(){
     $('#saveGrade').focus();
});
 $('#stopTimer').click(function(){
      stop=true;
      numTimers--;
      if(numTimers < 1 ){
        $('#quest').disable(false);
        $('#stopTimer').disable(true);
     }
      console.log('NumTimers: ' + numTimers); 
  $('#seconds').val(0);
});
$('#saveGrade').click(function (){
  var ndx = teams.indexOf(Number($('#team').val())); 
  var rightWrong = $('#rightWrong').val();
  var ltt =  $('#leftTeamq'); 
  var rtt =  $('#rightTeamq'); 
  var row = (ndx<1)? ltt : rtt;
  var ot= (row === ltt)? rtt : ltt; //the table row for the other team .
  var num =$('#extras').val();
 // if the administrator entered a number into the "extras" text field, use it to fix the response. (Color it green) else show new number. CreateTd can be a goaleekick.
  if(num > 0 ){
    fixTd(num, rightWrong,row);
  }else{
    createTd(count, rightWrong, row, ot);
 }
 //if this is not a goaleekick, set the dropdown to the other team 
  if(ballLocation !== 0 && ballLocation !== 4){
    ndx=(ndx +1)%2;
   $('#team').val(teams[ndx]); 
  }
});
$('#dir').click(function(){
  ballDirection = ballDirection * -1;
  setDirectionIndicators(ballDirection);
});
$('#adv').click(function(){ //advance the ball in the current direction.
  ballLocation += ballDirection;
  $('#ball').css('left', ballPositions[ballLocation]);
 
  if(ballLocation === 0 && ballDirection === -1){
   console.log('Goal!!');
   goal.play();
   $('#leftScore').val(Number($('#leftScore').val()) + 1 );
   ballDirection = -ballDirection;
   setDirectionIndicators(ballDirection);
    $('#team').val(teams[1]);
  }
  if(ballLocation === 4 && ballDirection === 1){
   console.log('Goal!!');
   goal.play();
   $('#rightScore').val(Number($('#rightScore').val()) +1 );
   ballDirection = -ballDirection;
   setDirectionIndicators(ballDirection);
    $('#team').val(teams[0]);
  }
 
});
// get next question or question from extras
$('#quest').click(function(){
  var tm = Number($('#team').val());
  var num = Number($('#extras').val());
//  alert('Extras number is: ' + num );
  var question, answer;
  if(num > 1 ){
    question =  (tm === 1)?items[num].qp : items[num].qs;
    answer   = items[num].a;
    startTimer();
  } else {
    count--;
    if(count < 0 ){alert ('Clock is expired. Use Pink questions in the track. Penalty Kicks.');}
    updateClock(count);
    question =  (tm === 1)?items[count].qp : items[count].qs;
    answer   = items[count].a;
    startTimer();
}
 //Encode and set the question and answer, then hide the answer by turning it white on a white background.
  $('#question_A').text(question);
  $('#answer_A').text(answer);
  $('#answer_A').css('color', '#FFFFFF');
});
}); //end document.ready
var setDirectionIndicators=function(bdir){
  $('#leftArrow').css('z-index', (bdir > 0)?  -1:  1);
  $('#rightArrow').css('z-index',(bdir < 1)?  -1:  1);
  $('#mode').val(0); // go to advance mode always when setting direction indicators.
  if(bdir <0) {
     $('#rightTeamName').removeClass('possessing');
     $('#leftTeamName').addClass('possessing');
     $('#team').val(teams[0]);
  } else {
     $('#leftTeamName').removeClass('possessing');
     $('#rightTeamName').addClass('possessing');
     $('#team').val(teams[1]);
  }
}
var createTd=function(num, rw, thisTeam, otherTeam){
   updateClock(num);
   var td ='<td class="' + ans[rw] + '" id="' + num  + '" >' + num + '</td>';
   thisTeam.append(td);
 //if this question is for a goalee kick, put centered X with white background for the other team.
  if(ballLocation === 0 || ballLocation === 4){
  var xid= "X" + num;
  var xTd = '<td id=' + xid + ' class="goaleekick" >X</td>';
    otherTeam.append(xTd);
  }
 
}
var fixTd=function( num, rw, row){
   updateClock(num);
   var id='#' +num;
   $(id).removeClass(ans[rw^1]).addClass(ans[rw])
   $('#extras').val('');
}
var coinFlip = function(){
return Math.floor((Math.random() * 3)-1 ); //will be one of:{-1,0,1} if zero, tries again.Hence, either a -1 or +1 emerges to determine starting possession
}
var updateClock = function(num){
  $('#falta').val(num);
}
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});
var startTimer = function(){
   $('#seconds').val(30);
   numTimers++;
   // if numTimers > 0, enable the stopTimerButton and disable the quest button.
   if(numTimers > 0){
      $('#stopTimer').disable(false);
      $('#quest').disable(true);
   }
   console.log('NumTimers: ' + numTimers);
   var endTimeMS= new Date().getTime() + 30000;
   var timeinterval = setInterval(function(){
      var t = clockTick(endTimeMS);
      $('#seconds').val(t);
      if(stop) {
        clearInterval(timeinterval); 
        stop=false;
        $('#seconds').val(0);
      }
      if(t<=0){
       clearInterval(timeinterval);
       beep.play();
       setTimeout(function(){ homer.play();}, 700);
      }
    },1000);
}
var clockTick = function(etms){
  var nowMS = new Date().getTime();
  var tMS = etms - nowMS;
  var seconds = Math.floor(tMS/1000);
  return seconds;
}
var readFile=function() {
    console.log('Entered readFile...');
    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    var file = files[0];
    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      items = JSON.parse(evt.target.result);
      }
    };
      reader.readAsText(file, 'UTF-8');
  }   

var configure=function(lt,rt,sz){
  readFile();
  teams = [lt,rt];
  console.log('Configuring Game with: ' + lt + ', ' + rt + ', ' + sz);
  $("#scoreBarLeftDiv").html(scoreBars[lt] +  '<input type="text" id="leftScore"  name="leftScore"  class="scoreInput" readonly="true" value="0">'); 
  $("#scoreBarRightDiv").html(scoreBars[rt] + '<input type="text" id="rightScore" name="rightScore" class="scoreInput" readonly="true" value="0">'); 
  $("#leftGoalBarDiv").html(  goalBars[lt]); 
  $("#rightGoalBarDiv").html( goalBars[rt]); 
  $("#leftArrowDiv").html(leftArrows[lt]); 
  $("#rightArrowDiv").html( rightArrows[rt]); 
  var leftTd ='<td id="leftTeamName"  class= "trackName" >' + countries[lt] + '</td>';
  var rightTd='<td id="rightTeamName" class= "trackName" >' + countries[rt] +'</td>';
  $('#leftTeamq').html(leftTd);
  $('#rightTeamq').html(rightTd);
//select teams in tracking.
  var leftOption  = '<option value=' + lt + '>' + countries[lt] + '</option>';
  var rightOption = '<option value=' + rt + '>' + countries[rt] + '</option>';
  $('#team').html(leftOption + rightOption);
 // Random draw to decide who has possession at start of game. 
  while(ballDirection === 0){
   ballDirection = coinFlip();
 }
 setDirectionIndicators(ballDirection); 
 count = sz;
 updateClock(sz);
}
// Data for the app.
  var leftArrows= [
                   '<img id="leftArrow" src="../public/images/ArrowLeftA.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftB.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftC.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftM.png">'
                  ];
  var rightArrows= [
                    '<img id="rightArrow" src="../public/images/ArrowRightA.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightB.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightC.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightM.png">'
                   ];
  var countries = ["Argentina", "Brasil", "Chile", "Mexico"];
  var scoreBars =[
                  '<img class="scoreBar" src="../public/images/ArgentinaScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/BrasilScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/ChileScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/MexicoScoreBar.png">'
                 ];
 var goalBars =[
                '<img class="goalBar" src="../public/images/ArgentinaScoreBar.png">'
               , '<img class="goalBar" src="../public/images/BrasilScoreBar.png">'
               , '<img class="goalBar" src="../public/images/ChileScoreBar.png">'
               , '<img class="goalBar" src="../public/images/MexicoScoreBar.png">'
               ];
)(jQuery);
