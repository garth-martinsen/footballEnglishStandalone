//-----constructor----------------------
var QuestionMgr = function(qset, gc , gmsz, xtras, tmr, qb, ab, cb, qd, ad, tms, lt, rt ){
 this.questionSet     = qset;    //array of questions used to play the game. Read from file during game.configuration.
 this.gameClock       = gc;      //readOnly text input, Decrementing Counter for each question tracked. Used to get next question.
 this.extras          = xtras;   //text input to revisit questions. Its value trumps gameClock for index of next question/answer.          
 this.timer           = tmr;     // 30 second countdown timer for each question.
 this.questionButton  = $(qb);   // button. when clicked, the next question & answer are displayed but answer is hidden.
 this.answerButton    = $(ab);   // button. When clicked, the hidden answer is displayed.
 this.clearButton     = $(cb);   // button. when clicked, the timer is cleared and ceases to count down.
 this.questionDisplay = $(qd);   // textArea where the question is displayed.
 this.answerDisplay   = $(ad);   // textArea where the answer is displayed.
 this.teamSelect      = $(tms);  // Select statement with the two team names displayed. Values are: 0,1 which index teams in  this.teams array..
 this.gameSize        = gmsz;    // initial value of the clock
 this.remainingCount  = gmsz;    // gets decremented for each question tracked.
 this.teams           = [lt,rt]; // integer array with left team and right team. eg: [2,3] would be Chile vs Mexico.
 this.numTimers       = 0;        // increments whenever a new question is displayed. decrements when timer is cleared or times out. 
 return this;
}


QuestionMgr.prototype.initialize = function(){
  this.updateClock(this.remainingCount);
  this.extras.value = "";
  this.clearButton.click(this.clearTimer30());
  this.questionButton.click(this.displayItem(this.nextQueston()));
  this.answerButton.click(this.revealAnswer());
}


QuestionMgr.prototype.decrementClock = function(){
 this.remainingCount--;
 this.updateClock(this.remainingCount);
}

QuestionMgr.prototype.updateClock = function(count ){
  this.gameClock.value=count;
}
QuestionMgr.prototype.getLanquage = function(count ){
  var ndx = this.teamSelect.value;
  return this.teams[ndx]; //returns an integer one of:{0,1,2,3} 1 speaks portuguese. All the others speak spanish.
}

QuestionMgr.prototype.nextQuestion = function( ){
 var ndx;
 var extra = this.extras.value;
 if(extra && extra.length > 0) {
   ndx = extra;
 }else{
   ndx = this.remainingCount;
 }
 return this.questionSet[ndx];
}

QuestionMgr.prototype.displayItem = function(item){
  var tm  = this.teams[Number(this.teamSelect.val())]; 
  var q = (tm === 1)? item.qp : item.qs; // if tm === 1 portuquese, else spanish.
  this.questionDisplay.text(q);
  this.answerDisplay.text(item.a);
  //hide the answer until button is pushed.Done with css classes. 
  this.answerDisplay.css('color', '#FFFFFF');
  this.timer.startTimer();
  this.numTimers++;
}

QuestionMgr.prototype.revealAnswer = function(item ){
 this.answerDisplay.css('color',"rgb(0, 0, 0)");  // black text will make the answer visible.
}

QuestionMgr.prototype.clearTimer30 = function( ){
  this.timer.stop = true;
  this.numTimers--;
  if(numTimers < 1 ){
     this.questionButton..disable(false);
     this.clearTimerButton.disable(true);
  }
}
