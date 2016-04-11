//-----constructor----------------------
 var PossessionMgr = function( config) {
    this.teams            = config.teams;
    this.ballDirection    = config.ballDirection;
    this.arrowLeft        = $('#leftArrow');
    this.arrowRight       = $('#rightArrow');
    this.leftTeamName     = $('#leftTeamName');
    this.rightTeamName    = $('#rightTeamName');
    this.teamSelect       = $('#team');
    this.rightWrongSelect = $('#rightWrong');
    this.created          = 'PossessionMgr' + new Date().toString().slice(-45).substring(3,24);
    this.defineHandlers();
    possMgr               = this;
    return this;
}
var possMgr;

PossessionMgr.prototype.defineHandlers=function(){
    $('#dir').on('click', this.changePossession );
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
     this.teamSelect.val(this.teams[0]);
  }
  else if(ballDirection > 0){ 
     this.teamSelect.val(this.teams[1]);
  }
}

PossessionMgr.prototype.clearRightWrongSelector = function(){
   console.log('Entered clearRightWrongSelector(...)');
   this.rightWrongSelect.val(-1);
}
PossessionMgr.prototype.changePossession = function(){
 this.ballDirection= -1 * this.ballDirection;
 this.displayArrow(this.ballDirection);
 this.highlightPossessor(this.ballDirection);
 this.selectPossessor(this.ballDirection);
 this.clearRightWrongSelector();
}
