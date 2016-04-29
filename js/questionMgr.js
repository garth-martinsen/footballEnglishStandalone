//-----constructor----------------------
var QuestionMgr = function(config){
 questionMgr          = this; 
 this.questionSet     = config.questionSet;             //map of questions for game (key:count(Integer), value: item( JSON Object) ). Read/randomized from file by popupMgr. 
 this.goalKicks       = [];                             // integer array[12]: missed questions + unused questions. Integers are used to fetch from questionSet.
 this.timer           = new QTimer(config.timerDuration); // second countdown timer for each question.
 this.remainingCount  = config.gameSize;                // gets decremented for each question tracked.
 this.teams           = config.teams;                   // integer array with left team and right team. eg: [2,3] would be Chile vs Mexico.
 this.numTimers       = 0;                              // increments for new question displayed. decrements when timer  clears/times out. 
 this.gameState       = 0;                              // integer, one of two values {0,1}. Normal play is 0. Endgame kicks is 1. Set to endgame when remainingCount=0
 this.created         = 'QuestionMgr_' + new Date().toString().slice(-45).substring(3,24);
 this.defineHandlers();
 return this;
}

var questionMgr;
var CLOCK=0, ENDGAME=1;

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

QuestionMgr.prototype.defineHandlers = function(){
    $('#quest').on(       'click',    questionMgr.displayNextItem );
    $('#showResponse').on('click',    questionMgr.revealAnswer );
    $('#stopTimer').on(   'click',    this.timer.stopTimer );
}

QuestionMgr.prototype.initialize = function(){
  this.updateClock(this.remainingCount);
  $('#extras').val("");
}

 // after questionMgr.changeToGoalKicks function is called, decrementClock will not be called again. question numbers will come from the goalKicks array.

QuestionMgr.prototype.changeToGoalKicks = function(){
   questionMgr.gameState=ENDGAME; //Sets the type of play to endgame (1).
   $('#game').trigger('clock:expired');
   questionMgr.gatherKickQuestions();
   var num = questionMgr.goalKicks.splice(0,1)[0];
   $('#extras').val(num);
   ball.setKickLocation();
   alert('Game clock is expired. 3 Goal kicks for each team. First: ' + countries[possessionMgr.getPossessor()]);
   return num;
}

QuestionMgr.prototype.decrementClock = function(){
 var num;
 this.remainingCount--;
 if(this.remainingCount < 0){ 
     num= questionMgr.changeToGoalKicks(); 
 } else { 
     num = this.remainingCount;
     this.updateClock(num);
 }
 return num;
}

QuestionMgr.prototype.updateClock = function(count ){
  $('#falta').val(count);
}

// the randomized map key values start at zero and ascend. The game starts at gameSize and decrements. The nextQuestion will be at the index of remainingCount or the extras value input.

//questionMgr.nextQuestion() returns the next item (JSON Object). the num used to fetch it can come from this.remainingCount, or from first element of this.goalKicks array.

QuestionMgr.prototype.nextQuestion = function( ){
 var ndx;
 if(questionMgr.isEndGame()){
  ndx = this.goalKicks.splice(0,1)[0];      //splice removes the first element of goalKicks and returns an array of length 1, get the element at 0
  $('#extras').val(ndx);
 }else{
   ndx = this.decrementClock();
 }
 return questionMgr.questionSet.get(ndx)[0];    //map returns array of length 1, get the first element, [0]
}

QuestionMgr.prototype.displayItem = function(item){
  var tm  = Number($('#team').val()); 
  var q = (tm === 1)? item.qp : item.qs; // if tm === 1 portuquese, else spanish.
  $('#question_A').text(q);
  $('#answer_A').text(item.a);
  //hide the answer until button is pushed.Done with css classes. 
  $('#answer_A').css('color', '#FFFFFF');
  this.timer.startTimer();
  this.numTimers++;
}

QuestionMgr.prototype.revealAnswer = function(item ){
$('#answer_A').css('color',"rgb(0, 0, 0)");  // black text will make the answer visible.
}

QuestionMgr.prototype.clearTimer30 = function( ){
  questionMgr.timer.stop = true;
  this.numTimers--;
  if(this.numTimers < 1 ){
     $('#quest').disable(false);
     $('#stopTimer').disable(true);
  } else {
     $('#quest').disable(true);
     $('#stopTimer').disable(false);
  }
}
 
QuestionMgr.prototype.gatherKickQuestions = function(){
   var questionsNeeded = 12;                       //Assume 3 goal kicks/team (6 kicks)  at the end of the game clock. Two questions per kick. ( 2 X 3 x 2= 12).
   var i;
   var questionArray = $('.wrong');
   var gameSize = popupMgr.getConfig().gameSize;
   for(i=0; i< questionArray.length; i++){
     this.goalKicks.push(Number(questionArray[i].id));
   }
   var more = questionsNeeded - this.goalKicks.length + 1;
   for(i=1; i < more; i++){
     this.goalKicks.push(gameSize + i );
  }
 $('#extras').val(questionMgr.goalKicks[0]);
}

QuestionMgr.prototype.isRevisited = function(num){
   var array = $('.wrong');
   var result=false;
   for(i=0; i< array.length; i++){
      if (Number(array[i].id) == num )
       { result = true;
         break;
       } 
}
   return result;
}
QuestionMgr.prototype.getClock = function(num){
  return $('#falta').val();
}

QuestionMgr.prototype.isEndGame = function(num){
  return questionMgr.gameState === ENDGAME;
}

QuestionMgr.prototype.displayNextItem = function () {
   questionMgr.displayItem(questionMgr.nextQuestion());
}
