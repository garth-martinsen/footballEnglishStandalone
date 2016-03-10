//-----constructor----------------------
var QuestionMgr = function(qset, gc , gmsz, xtras, tmr, qb, ab, cb, qd, ad){
 this.questionSet     = qset;   //array of questions used to play the game. Read from file during game.configuration.
 this.gameClock       = gc;     //readOnly text input, Decrementing Counter for each question tracked. Used to get next question.
 this.extras          = xtras;  //text input to revisit questions. Its value trumps gameClock for index of next question/answer.          
 this.timer           = tmr;    // 30 second countdown timer for each question.
 this.questionButton  = $(qb);  // button. when clicked, the next question & answer are displayed but answer is hidden.
 this.answerButton    = $(ab);  // button. When clicked, the hidden answer is displayed.
 this.clearButton     = $(cb);  // button. when clicked, the timer is cleared and ceases to count down.
 this.questionDisplay = $(qd);  // textArea where the question is displayed.
 this.answerDisplay   = $(ad);  // textArea where the answer is displayed.
 this.gameSize        = gmsz;   // initial value of the clock
 this.remainingCount  = gmsz;   // gets decremented for each question tracked.
 return this;
}


QuestionMgr.prototype.initialize = function(){
  this.updateClock(this.remainingCount);
  this.extras.value = "";
}

QuestionMgr.prototype.displayNextItem = function(item){
  this.questionDisplay.content(item.q);
  this.answerDisplay.content(item.a);
  //hide the answer until button is pushed.Done with css classes. 
  this.timer.start();
}

QuestionMgr.prototype.revealAnswer = function(item ){
  //add/remove css class to show the answer. 
}

QuestionMgr.prototype.decrementClock = function(){
 this.remainingCount--;
 this.updateClock(this.remainingCount);
}


QuestionMgr.prototype.nextQuestion = function( ){
 var ndx;
 var extra = this.extras.val();
 if(extra && extra >0) {
   ndx = extra;
 }else{
   ndx = remainingCount;
 }
 return this.questionSet[ndx];
}

QuestionMgr.prototype.updateClock = function(count ){
  this.gameClock.value=count;
}

QuestionMgr.prototype.clearTimer30 = function( ){
  this.timer.stop();
}
