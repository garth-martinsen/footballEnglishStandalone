//----- constructor ---------------
 var TrackMgr = function( cfg ) {

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
   this.ans                = ["right", "wrong"];
   this.possessor          = 0; //set at coin flip and every time ball changes possession. value is one of: {tl,tr}
   this.possessorTally     = 0; //difference in tallies is used to controll ball possession and movement. diff =  possessorTally - contenderTally
   this.contendorTally     = 0;  // diff=-1 change possession; diff=0 => contestforPossession; diff=1 => nothing; diff=2 -> advanceBall
   this.created            = 'TrackMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   trackMgr = this;
   return this;
}
var trackMgr;  //global variable so can be accessed as top level class.
/*  ------------------------------ Cant seem to get initialize to work to set up handlers. ----------
TrackMgr.prototype.initialize  = function(){
  this.trackButton.click(saveGrade);
}
--------------------------  */
TrackMgr.prototype.tabToSaveGrade  = function(){
  this.trackButton.focus();
}


TrackMgr.prototype.saveGrade = function(){

   var ndx  = trackMgr.teams.indexOf(Number(trackMgr.teamSelect.value));
   var rw   = Number(trackMgr.rightWrongSelect.value); 
   var row  = (ndx < 1)? trackMgr.leftTrackRow : trackMgr.rightTrackRow;
   var ot   = (row === trackMgr.leftTrackRow)? trackMgr.rightTrackRow : trackMgr.leftTrackRow; //the table row for the other team .
   //check to see if administrator entered a question number.
   var num  = Number(trackMgr.extras.value); 
   if(num > 0 ){
       trackMgr.fixTd(num, rw ,row); //color existing number green if answer is correct, else leave it pink.
   }else{
       trackMgr.createTd(trackMgr.clock.value, rw, row, ot);
   }  
   //if this is not a goaleekick, set the dropdown to the other team for the next question
   if(trackMgr.ball.ballLocation !== 0 && trackMgr.ball.ballLocation !== 4){
      ndx=(ndx +1)%2;
      trackMgr.teamSelect.value= trackMgr.teams[ndx];
    }
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

TrackMgr.prototype.fixTd = function(num, rightWrong, row){
   this.updateClock(num);
   var id='#' +num;
   $(id).removeClass(trackMgr.ans[rightWrong^1]).addClass(trackMgr.ans[rightWrong])
   this.extras.value="";
}

// updateTally adds value of rightWrong (could be zero) to the Tally of the answering team. If both teams have answered, it calls decideBallAction with the diff in tallies. 
// updateTally args: teamId, one of:{0,1,2,3} which answered the question, rightWrong, one of: [0,1], 
TrackMgr.prototype.updateTally = function(teamId, rightWrong){
   var pt,ct = false;  //when both of these are true, decideBallAction(...) is called
   if(which === this.possessor) {   //possessor is set to the teamId of the possessing team during game init, or at change of possession.
      pt = true;
      this.possessorTally += rightWrong;
   } else {
      ct = true;
      this.contendorTally += rightWrong;
   }
   if(pt && ct){ 
      pt=ct=false; 
      decideBallAction( this.possessorTally - this.contendorTalley );
   }
}

// decideBallAction  function manages movement and possession of the ball. The  difference, diff,  is used to determine action.
TrackMgr.prototype.decideBallAction= function(diff){
   if(diff === -1) {
      possessionMgr.changePossession();
      var ndx = this.teams.indexOf(possessor);
      this.possessor= teams[(ndx ^ ndx)];// possessor is at the other index, either 0 or 1. using exclusive OR.
   } else if(diff === 0){
       //possession of ball is in contention -- show a notice "POSSESSION IN CONTENTION" -- Future implementation..
   } else if (diff === 1){
      // both teams answered correctly, no change in status, show notice : }TIE NO CHANGE" -- Future implementation..
   } else if(diff === 2){
      ball.advance(); 
      // reset tallies.
      possessorTally =1;
      contendorTally =0;
   }
}


TrackMgr.prototype.possessionMgr= function(){
  return trackMgr.ball.possessionMgr;
}

TrackMgr.prototype.setBallLocation = function(loc){
  trackMgr.ball.ballLocation=loc;
}
