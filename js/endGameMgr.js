//----- constructor ---------------
 var EndGameMgr = function( cfg ) {

   endGameMgr = this;
   this.teams              = cfg.teams;
   this.extras             = $('#extras')[0]; 
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
   this.timeMs             = 3000;                     // 3 second delay so  ball is seen in net before preparing for next kick. For testing set to 0.
   this.pt                 = false;                    // boolean set to true when possessor tally is augmented.When this.pt and this.ct are true, decideBallAction()
   this.ct                 = false;                    // boolean set to true when contender tally is augmented.When both are true, decideBallAction() is called.
   this.created            = 'EndGameMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   this.defineHandlers();
   this.setFirstKickLocation();                             // Initial goal kick. After each attempt, the teams alternate in attempts.
   return this;
}
var endGameMgr;                                                        //global variable so can be accessed as top level class.


EndGameMgr.prototype.defineHandlers  = function(){
    this.trackButton.disable(true);
    $('#rightWrong').on('change',   endGameMgr.ensureSelected );
    $('#saveGrade').on('click', endGameMgr.saveGrade );
}

EndGameMgr.prototype.ensureSelected=function(){
   var rw =  $('#rightWrong').val();
   if( rw == 0 || rw == 1){
      endGameMgr.trackButton.disable(false); 
   } else {
      endGameMgr.trackButton.disable(true);
   }
}

EndGameMgr.prototype.getRow = function(){
     var ndx  = endGameMgr.teams.indexOf(Number($('#team').val()));                // ndx will be one of: {0,1}
     return  (ndx < 1)? endGameMgr.leftTrackRow : endGameMgr.rightTrackRow;        //0 gets left or top row.1 gets right or bottom row.
}

EndGameMgr.prototype.saveGrade = function(){
   var rw   = Number(endGameMgr.rightWrongSelect.val()); 
   var answeringTeam  = endGameMgr.getRow();                                                                           // table row for answering team.
   var num  = Number($('#extras').val());    //In endgame, question # (revisited/not), will always come from the extras text input field. (Future: hidden)
   if( questionMgr.isRevisited(num)) {
      endGameMgr.fixTd(   num, rw, answeringTeam); //color existing number green if answer is correct, else leave it pink.
   } else {
      endGameMgr.createTd(num, rw, answeringTeam);
   }
   endGameMgr.updateTally(endGameMgr.teamSelect.val(), rw); 
   //if the ball is not in a Goal, set the team dropdown to the other team for the next question
   if( !ball.inGoal() ){
        endGameMgr.selectOtherTeam(); 
   }
    $('#rightWrong').val(-1); // handler  disables/enables the track button.
}

EndGameMgr.prototype.selectOtherTeam = function(){
  var ndx = endGameMgr.teams.indexOf(Number($('#team').val()));  //ndx is one of: {0,1}
  ndx=(ndx +1)%2;                                             // now ndx is the other value. 0 -> 1, or 1 -> 0
  $('#team').val(endGameMgr.teams[ndx]);                         // now the other team is selected.
}

EndGameMgr.prototype.createTd = function( cnt, rightWrong, thisTeam){
   var td ='<td class="' + endGameMgr.ans[rightWrong] + '" id="' + cnt  + '" >' + cnt + '</td>';
   thisTeam.append(td);
}

EndGameMgr.prototype.fixTd = function(num, rightWrong, row){
   var id='#' +num;
   $(id).removeClass(endGameMgr.ans[rightWrong^1]).addClass(endGameMgr.ans[rightWrong])
   this.extras.value="";
}

// updateTally adds value of rightWrong (could be 0) to the team's Tally. If both teams have answered, it calls decideBallAction with the diff in tallies. 
// updateTally args: teamId, one of:{0,1,2,3}, which answered the question, rightWrong, one of: [0,1], 

EndGameMgr.prototype.updateTally = function(teamId, rightWrong){
   if(teamId == possessionMgr.getPossessor()) {                            // possessor = ( ballDirection < 0)? teams[0] : teams[1].
      if(rightWrong == 0) {                                                // 0 ==>WRONG; kick went wide, register bad kick, resetTallies and return;
         endGameMgr.registerKick('missed');                                // wasted one of the three goal kicks
         endGameMgr.resetTallies();
         this.ct = this.pt = false;
         return;
      } else {                                                              // otherwise, give possessor credit for correct answer
         this.pt = true;
         this.tallyPossessor += rightWrong;
      }
   } else {                                                                  //function was called for the contending team;
      this.ct = true;
      this.tallyContender += rightWrong;
   }
   if(this.pt && this.ct){                                                             //if true, both teams have answered a question. 
      this.pt=this.ct=false; 
      console.log('Going for decision with Possessor: ' + endGameMgr.tallyPossessor + ' and Contender: ' + endGameMgr.tallyContender );
      this.decideBallAction( this.tallyPossessor - this.tallyContender );
   }
}

// decideBallAction function, in the endGame, manages success or failure of a goal kick. The  difference, diff, determines whether the ball scores or is blocked.

EndGameMgr.prototype.decideBallAction= function(diff){

   if (diff === 1){
       console.log('The kick was blocked.');
       endGameMgr.registerKick('blocked');
   } else if(diff === 2){
      console.log('Goal kick was successful. Gooool!');
      ball.advance();
      endGameMgr.resetTallies();
      endGameMgr.registerKick('goal');
   }
}

EndGameMgr.prototype.displayResult = function(rslt, teamId, attempt){
   var name = countries[teamId];
   var point = (rslt === 'goal')? 1 : 0;
   var row = '<td>' + name + '</td><td>' + attempt + '</td><td>' + rslt +'</td><td>' + point + '</td>';
   var rowNum = endGameMgr.totalGoalKicks()+1;
  $('#k'+ rowNum).html(row);
}
//function registerKick adds a JSON object to the array under the possessor in the goalKickResults map and checks to see if they have had 3 attempts.` 
//If the possessor has three attampts in his array, possession changes to the other team for their goal kicks.

EndGameMgr.prototype.registerKick = function(result){
    var possessor = possessionMgr.getPossessor();
    var array = endGameMgr.goalKickResults.get(possessor);
    endGameMgr.displayResult(result, possessor,array.length + 1); 
    array.push({team:possessor, attempt: array.length +1,  result: result});
    if( endGameMgr.gameIsOver()) {
        return;
    } else {    //set up for opposite team to do a goal kick.
        possessionMgr.changePossession();
        endGameMgr.phasedBallPlacement(ball);
    }     
}

EndGameMgr.prototype.phasedBallPlacement = function(aBall){
     setTimeout(function(){
         aBall.setLocation ( (possessionMgr.ballDirection < 0 ) ? 1 : 3);
         $('#team').val(possessionMgr.getPossessor());
    },endGameMgr.timeMs );
}

EndGameMgr.prototype.resetTallies= function(){
      endGameMgr.tallyPossessor =1;
      endGameMgr.tallyContender =0;
}

EndGameMgr.prototype.totalGoalKicks= function(){
   var results = endGameMgr.goalKickResults;
   return ( results.get(endGameMgr.teams[0]).length + results.get(endGameMgr.teams[1]).length);
  
}
EndGameMgr.prototype.gameIsOver= function(){
   var numKicks = endGameMgr.totalGoalKicks();
   console.log('Goal kick attempts : ' + numKicks);
   if(numKicks > 5) {
     ball.setLocation(2);
     endGameMgr.disableButtons();
     console.log('Game is over. Well done!');
     alert('Game is over. Well done!' );
   }
   return (numKicks > 5);
}

EndGameMgr.prototype.disableButtons= function(){
  $('#quest').disable(true);
  $('#stopTimer').disable(true);
  $('#showResponse').disable(true);
  $('#saveGrade').disable(true);
}
 
EndGameMgr.prototype.setFirstKickLocation =function(){
   possessionMgr.setBallDirection( popupMgr.coinflip());
   ball.setLocation( (possessionMgr.ballDirection < 0 ) ? 1 : 3 ) ;
}


