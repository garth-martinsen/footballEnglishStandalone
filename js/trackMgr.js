//----- constructor ---------------
 var TrackMgr = function( tl, tr  ) {

   this.extras             = $('#extras'); 
   this.clock              = $('#falta');
   this.trackButton        = $('#saveGrade');
   this.leftTrackRow       = $('#leftTeamq');
   this.rightTrackRow      = $('#rightTeamq');
   this.teamSelect         = $('#team');
   this.modeSelect         = $('#mode');
   this.rightWrongSelect   = $('#rightWrong');
   this.teams              = [tl,tr];
   this.ans                = ["right", "wrong"];
   this.ballLocation       = 2;  //default is midfield. this will be set dynamically as the ball moves.
   this.created            = new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   return this;
}
/*  ------------------------------ Cant seem to get initialize to work to set up handlers. ----------
TrackMgr.prototype.initialize  = function(){
  this.trackButton.click(saveGrade);
}
--------------------------  */
TrackMgr.prototype.tabToSaveGrade  = function(){
  this.trackButton.focus();
}

TrackMgr.prototype.setBallLocation  = function(loc){
  this.ballLocation = loc;
}

TrackMgr.prototype.saveGrade = function(){
   var ndx  = this.teams.indexOf(Number(this.teamSelect.value));
   var rw   = this.rightWrongSelect.value; 
   var row  = (ndx < 1)? this.leftTrackRow : this.rightTrackRow;
   var ot   = (row === this.leftTrackRow)? this.rightTrackRow : this.leftTrackRow; //the table row for the other team .
   //check to see if administrator entered a question number.
   var num  = Number(this.extras.value); 
   if(num > 0 ){
       this.fixTd(num, rw ,row); //color existing number green if answer is correct, else leave it pink.
   }else{
       this.createTd(this.clock.val(), rw, row, ot);
   }  
   //if this is not a goaleekick, set the dropdown to the other team
   if(this.ballLocation !== 0 && this.ballLocation !== 4){
      ndx=(ndx +1)%2;
      this.teamSelect.value= this.teams[ndx];
    }
}

TrackMgr.prototype.updateClock = function( cnt){
   this.clock.val(cnt);
}
TrackMgr.prototype.createTd = function( cnt, rightWrong, thisTeam, otherTeam){
   this.updateClock(cnt);
   var td ='<td class="' + this.ans[rightWrong] + '" id="' + cnt  + '" >' + cnt + '</td>';
   $('#leftTeamq').append(td);

   //if this question is for a goalee kick, put centered X with white background for the other team.
   if(this.ballLocation === 0 || this.ballLocation === 4){
      var xid= "X" + cnt;
      var xTd = '<td id=' + xid + ' class="goaleekick" >X</td>';
      $('#rightTeamq').append(xTd);
   }
}

TrackMgr.prototype.fixTd = function(num, rightWrong, row){
   this.updateClock(num);
   var id='#' +num;
   $(id).removeClass(this.ans[rightWrong^1]).addClass(this.ans[rightWrong])
   this.extras.value="";
}


