//-----constructor----------------------
 var PossessionMgr = function( al, ar, ltn, rtn, tms, teamArray) {
    this.arrowLeft  = al;
    this.arrowRight = ar;
    this.leftTeamName   = $(ltn);
    this.rightTeamName  = $(rtn);
    this.teamSelect = $(tms);
    this.teams = teamArray;
    return this;
}

PossessionMgr.prototype.displayArrow=function(ballDirection){
   console.log('Entered displayArrow(...)');
   if(ballDirection < 0){ 
     this.arrowLeft.css('z-index', 2); 
     this.arrowRight.css('z-index', -2) 
   }   
   else if(ballDirection > 0) {
     this.arrowLeft.css('z-index', -2);
     this.arrowRight.css('z-index', 2)
   }   
 }

PossessionMgr.prototype.highlightPossessor=function(ballDirection){
   console.log('Entered highlightPossessor(...)');
//in the Track table at the bottom, the possessing Team TD is highlighted in yellow.
 if(ballDirection < 0) {
     this.rightTeamName.removeClass('possessing');
     this.leftTeamName.addClass('possessing');
  } else if(ballDirection > 0 ) { 
     this.leftTeamName.removeClass('possessing');
     this.rightTeamName.addClass('possessing');
  }
}

PossessionMgr.prototype.selectPossessor=function(ballDirection){
   console.log('Entered selectPossessor(...)');
// The possessing team always gets the first question, followed by the opposing team. TrackMgr needs select value to track questions.
  if(ballDirection < 0){ 
     this.teamSelect.val(0);
  }
  else if(ballDirection > 0){ 
     this.teamSelect.val(1);
  }
}

PossessionMgr.prototype.changePossession=function(ball){
 var newDirection = -1* ball.ballDirection;
 ball.setDirection(newDirection);
 this.displayArrow(newDirection);
 this.highlightPossessor(newDirection);
 this.selectPossessor(newDirection);
 return ball;
}
