//-----constructor----------------------
var QuestionMgr = function(config){
 this.questionSet     = config.questionSet;             //array of questions for  game. Read from file during game.configuration.
 this.timer           = new QTimer(config.timerDuration); // second countdown timer for each question.
 this.remainingCount  = config.gameSize;                // gets decremented for each question tracked.
 this.teams           = config.teams;                   // integer array with left team and right team. eg: [2,3] would be Chile vs Mexico.
 this.numTimers       = 0;                              // increments for new question displayed. decrements when timer  clears/times out. 
 this.created         = 'QuestionMgr_' + new Date().toString().slice(-45).substring(3,24);
 questionMgr          = this; 

 return this;
}

var questionMgr;

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});


QuestionMgr.prototype.initialize = function(){
  this.updateClock(this.remainingCount);
  $('#extras').val("");
}


QuestionMgr.prototype.decrementClock = function(){
 this.remainingCount--;
 this.updateClock(this.remainingCount);
}

QuestionMgr.prototype.updateClock = function(count ){
  $('#falta').val(count);
}

// the randomized map key values start at zero and ascend. The game starts at gameSize and decrements. The nextQuestion will be at the index of remainingCount or the extras value input.
QuestionMgr.prototype.nextQuestion = function( ){
 questionMgr.timer.duration = configMgr.getConfig().timerDuration;
 var ndx;
 var extra = $('#extras').val();
 if(extra && extra.length > 0) {
   ndx = Number(extra);
 }else{
   this.decrementClock();
   ndx = Number(this.remainingCount) ;
 }
 return this.questionSet.get(ndx)[0];
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
  }
}
