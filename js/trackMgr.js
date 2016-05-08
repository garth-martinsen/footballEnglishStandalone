//----- constructor ---------------
 var TrackMgr = function( cfg ) {

   trackMgr = this;
   this.ball               = new Ball(cfg);
   this.teams              = cfg.teams;
   this.extras             = $('#extras')[0]; 
   this.clock              = $('#falta')[0];
   this.trackButton        = $('#saveGrade');
   this.leftTrackRow       = $('#leftTeamq');
   this.rightTrackRow      = $('#rightTeamq');
   this.teamSelect         = $('#team');
   this.modeSelect         = $('#mode');
   this.rightWrongSelect   = $('#rightWrong');
   this.ans                = ["wrong", "right"];
   this.tallyPossessor     = 1;                        //difference in tallies is used to controll ball possession and movement. diff =  tallyPossessor - contenderTally
   this.tallyContender     = 0;                        // diff=-1 change possession; diff=0 => contestForPossession; diff=1 => nothing; diff=2 -> advanceBall
   this.created            = 'TrackMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   this.defineHandlers();
   return this;
}
var trackMgr;  //global variable so can be accessed as top level class.

TrackMgr.prototype.defineHandlers  = function(){
     this.trackButton.disable(true);
    $('#rightWrong').on('change',   trackMgr.ensureSelected );
    $('#saveGrade').on('click', trackMgr.saveGrade );
    $('#game').on('clock:expired', trackMgr.switchToEndGame );
    $('#game').on("goal:scored", trackMgr.goalScored );
}

TrackMgr.prototype.switchToEndGame=function(){
   // remove bindings to call trackMgr functions, instantiate endGameMgr and define its handlers to handle the events instead.
 $('#rightWrong').off('change',   trackMgr.ensureSelected )
    $('#saveGrade').off('click', trackMgr.saveGrade );
    $('#game').off('clock:expired', trackMgr.switchToEndGame );
   endGameMgr = new EndGameMgr(popupMgr.getConfig());
    $('#endGamePopup').css('display', 'block');

}

TrackMgr.prototype.ensureSelected=function(){
   var rw =  $('#rightWrong').val();
   if( rw == 0 || rw == 1){
      trackMgr.trackButton.disable(false); 
   } else {
      trackMgr.trackButton.disable(true);
   }
}

TrackMgr.prototype.getRow = function(){
     var ndx  = trackMgr.teams.indexOf(Number($('#team').val()));
     return  (ndx < 1)? trackMgr.leftTrackRow : trackMgr.rightTrackRow;
}

TrackMgr.prototype.saveGrade = function(){
   var rw   = Number(trackMgr.rightWrongSelect.val()); 
   var answeringTeam  = trackMgr.getRow(); 
   var otherTeam   = (answeringTeam === trackMgr.leftTrackRow)? trackMgr.rightTrackRow : trackMgr.leftTrackRow; //the table row for the otherTeam .
   trackMgr.createTd(questionMgr.remainingCount, rw, answeringTeam, otherTeam);
   trackMgr.updateTally(trackMgr.teamSelect.val(), rw); 
   //if the ball is not in a Goal, set the team dropdown to the other team for the next question
   if( !ball.inGoal() ){
        trackMgr.selectOtherTeam(); 
   }
    $('#rightWrong').val(-1);
    trackMgr.trackButton.disable(true); //may be redundant. handler disables.
}

TrackMgr.prototype.selectOtherTeam = function(){
  var ndx = trackMgr.teams.indexOf(Number($('#team').val()));  //ndx is one of: {0,1}
  ndx=(ndx +1)%2;                                             // now ndx is the other value. 0 -> 1, or 1 -> 0
  $('#team').val(trackMgr.teams[ndx]);                         // now the other team is selected.
}
TrackMgr.prototype.updateClock = function( cnt){
   this.clock.value =cnt;
}

TrackMgr.prototype.createTd = function( cnt, rightWrong, thisTeam, otherTeam){
   this.updateClock(cnt);
   var td ='<td class="' + trackMgr.ans[rightWrong] + '" id="' + cnt  + '" >' + cnt + '</td>';
   thisTeam.append(td);

   //if this question is for a goalee kick, put centered X with white background for the other team.
   if(this.ball.ballLocation === 0 || this.ball.ballLocation === 4){
      var xid= "X" + cnt;
      var xTd = '<td id=' + xid + ' class="goaleekick" >X</td>';
      otherTeam.append(xTd);
   }
}

   var pt,ct = false;  //when both of these are true, decideBallAction(...) is called

// updateTally adds value of rightWrong (could be zero) to the Tally of the answering team. If both teams have answered, it calls decideBallAction with the diff in tallies. 
// updateTally args: teamId, one of:{0,1,2,3} which answered the question, rightWrong, one of: [0,1], 

TrackMgr.prototype.updateTally = function(teamId, rightWrong){
   if(teamId == possessionMgr.getPossessor()) {   //possessor is set to the teamId of the possessing team during game init, or at change of possession.
      pt = true;
      this.tallyPossessor += rightWrong;
      if(ball.inGoal()){
         ct=true;
      }
   } else {
      ct = true;
      this.tallyContender += rightWrong;
   }
   if(pt && ct){ 
      pt=ct=false; 
    console.log('Going for decision with tallyPossessor: ' + trackMgr.tallyPossessor + ' and tallyContender: ' + trackMgr.tallyContender );
      this.decideBallAction( this.tallyPossessor - this.tallyContender );
   }
}

// decideBallAction  function manages movement and possession of the ball. The  difference, diff,  is used to determine action.
// in the ENDGAME, this function can only get a diff=1 (block) or a diff=2 (goal).

TrackMgr.prototype.decideBallAction= function(diff){
   if(diff === -1) {
      console.log('Tally difference says to change possession of the ball');
      possessionMgr.changePossession();
      trackMgr.resetTallies();
      $('#mode').val(0).css('background-color', "white");

   } else if(diff === 0){
      if(questionMgr.gameState == CLOCK){ console.log('Tally difference says that possession of ball is in contentention.');}
      $('#mode').val(1).css('background-color', "yellow");

   } else if (diff === 1){
       console.log('Tally difference says that possession is retained.');
       $('#mode').val(0).css('background-color', "white");

   } else if(diff === 2){
      console.log('Tally difference says the ball must advance.');
      ball.advance();
      trackMgr.resetTallies();
      $('#team').val(possessionMgr.getPossessor());    // after every advance except a goal, the possessing team gets the first question.
   }
}

TrackMgr.prototype.resetTallies= function(){
      trackMgr.tallyPossessor =1;
      trackMgr.tallyContender =0;
}

TrackMgr.prototype.setBallLocation = function(loc){
  trackMgr.ball.ballLocation=loc;
}

TrackMgr.prototype.goalScored = function(){
  console.log('TrackMgr responding to goal:scored event.  Changing possession.');
  possessionMgr.changePossession();
  $('#mode').val(2); 	//goaleeKick.
}
