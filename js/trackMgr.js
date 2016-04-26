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
   this.goalKickResults    = new Map().set(this.teams[0], []).set(this.teams[1], []);  //key=teamId, val:array of JSON objects.
   this.created            = 'TrackMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   this.defineHandlers();
   return this;
}
var trackMgr;  //global variable so can be accessed as top level class.


TrackMgr.prototype.defineHandlers  = function(){
     this.trackButton.disable(true);
    $('#rightWrong').on('change',   trackMgr.ensureSelected );
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
   if(!questionMgr.isEndGame() ){
      trackMgr.createTd(questionMgr.getClock(), rw, answeringTeam, otherTeam);
   } else {
       var num  = Number(trackMgr.extras.value);    //whether the question is revisited or not, it will always come from the extras text input field. (Future: hidden)
       if( questionMgr.isRevisited(num)) {
          trackMgr.fixTd(num, rw ,answeringTeam); //color existing number green if answer is correct, else leave it pink.
       } else {
          trackMgr.createTd(num, rw, answeringTeam, otherTeam);
       }
   }  
   //if this is not a goaleekick, set the dropdown to the other team for the next question
   if(trackMgr.ball.ballLocation !== 0 && trackMgr.ball.ballLocation !== 4){
     trackMgr.updateTally(trackMgr.teamSelect.val(), rw); 
     trackMgr.selectOtherTeam();
    }
    $('#rightWrong').val(-1);
    trackMgr.trackButton.disable(true);
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

TrackMgr.prototype.fixTd = function(num, rightWrong, row){
   this.updateClock(num);
   var id='#' +num;
   $(id).removeClass(trackMgr.ans[rightWrong^1]).addClass(trackMgr.ans[rightWrong])
   this.extras.value="";
}

   var pt,ct = false;  //when both of these are true, decideBallAction(...) is called

// updateTally adds value of rightWrong (could be zero) to the Tally of the answering team. If both teams have answered, it calls decideBallAction with the diff in tallies. 
// updateTally args: teamId, one of:{0,1,2,3} which answered the question, rightWrong, one of: [0,1], 

TrackMgr.prototype.updateTally = function(teamId, rightWrong){
   if(rightWrong == 0 && questionMgr.isEndGame()){ // kick went wide, register bad kick and resetTallies
       ct = pt= false; 
       trackMgr.registerKick('missed');
       trackMgr.resetTallies();
   }
   if(teamId == possessionMgr.getPossessor()) {   //possessor is set to the teamId of the possessing team during game init, or at change of possession.
      pt = true;
      this.tallyPossessor += rightWrong;
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

TrackMgr.prototype.registerKick = function(result){
    var possessor = possessionMgr.getPossessor();
    var array = goalKickResults.get(possessor);
    array.push({team:possessor, result: result});
    if(array.length >2){      //set up for opposite team to do their penalty kicks. 
       possessionMgr.changePossession().showPossession();
       // alert other team they are doing their penalty kicks, display new direction arrow, and new ball location.
       alert('Three Penalty kicks for: ' + countries[possessionMgr.getPossessor()]);
       ball.ballLocation = (possessionMgr.ballDirection < 0 ) ? 1 : 3;
       ball.displayBallLocation();
    } else {  // set ball up for another kick by same team.
       ball.ballLocation = (possessionMgr.ballDirection < 0 ) ? 1 : 3;
       ball.displayBallLocation();
    }
}
// decideBallAction  function manages movement and possession of the ball. The  difference, diff,  is used to determine action.
// in the ENDGAME, this function can only get a block (diff=1) or a goal (diff=2).

TrackMgr.prototype.decideBallAction= function(diff){
   if(diff === -1) {
      console.log('Tally difference says to change possession of the ball');
      $('#dir').click();
      trackMgr.resetTallies();
      $('#mode').val(0).css('background-color', "white");

   } else if(diff === 0){
      if(questionMgr.gameState == CLOCK){ console.log('Tally difference says that possession of ball is in contentention.');}
      $('#mode').val(1).css('background-color', "yellow");

   } else if (diff === 1){
      console.log('Tally difference says that nothing changes.');
       if(questionMgr.isEndGame()){ trackMgr.registerKick('blocked');}

   } else if(diff === 2){
      console.log('Tally difference says the ball must advance.');
      $('#adv').click(); 
      trackMgr.resetTallies();
       if(questionMgr.isEndGame()){ trackMgr.registerKick('goal');}
   }
}

TrackMgr.prototype.resetTallies= function(){
      trackMgr.tallyPossessor =1;
      trackMgr.tallyContender =0;
}

TrackMgr.prototype.setBallLocation = function(loc){
  trackMgr.ball.ballLocation=loc;
}

