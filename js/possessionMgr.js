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
    possMgr               = this;
    this.defineHandlers();
    this.showPossession();
    this.formerTimeStamp  = 0;
    return this;
}
var possMgr;
var cpCount=0;

PossessionMgr.prototype.defineHandlers=function(){
    $('#dir').on('click', this.changePossession );
}

PossessionMgr.prototype.displayArrow=function(){
   //console.log('Entered displayArrow(...)');
   if(this.ballDirection < 0){ 
     this.arrowLeft.css('z-index', 2); 
     this.arrowRight.css('z-index', -2) 
   }   
   else if(this.ballDirection > 0) {
     this.arrowLeft.css('z-index', -2);
     this.arrowRight.css('z-index', 2)
   }   
 }

PossessionMgr.prototype.highlightPossessor=function(){
 ;
   //console.log('Entered highlightPossessor(...)');
//in the Track table at the bottom, the possessing Team TD is highlighted in yellow.
 if(this.ballDirection < 0) {
     this.rightTeamName.removeClass('possessing');
     this.leftTeamName.addClass('possessing');
  } else if(this.ballDirection > 0 ) { 
     this.leftTeamName.removeClass('possessing');
     this.rightTeamName.addClass('possessing');
  }
}


PossessionMgr.prototype.selectPossessor=function(){
   //console.log('Entered selectPossessor(...)');
// The possessing team always gets the first question, followed by the opposing team. TrackMgr needs select value to track questions.
  if(this.ballDirection < 0){ 
     this.teamSelect.val(this.teams[0]);
  }
  else if(this.ballDirection > 0){ 
     this.teamSelect.val(this.teams[1]);
  }
}

PossessionMgr.prototype.clearRightWrongSelector = function(){
   //console.log('Entered clearRightWrongSelector(...)');
   this.rightWrongSelect.val(-1);
}
PossessionMgr.prototype.showPossession = function(){
 this.displayArrow();
 this.highlightPossessor();
 this.selectPossessor();
 this.clearRightWrongSelector();
}
PossessionMgr.prototype.changePossession = function(evt){
if (evt && evt.timeStamp){
    if(evt.timeStamp == possMgr.formerTimeStamp){ return }
    possMgr.formerTimeStamp = evt.timeStamp;
    console.log('event timestamp: ' + evt.timeStamp);
}
 possMgr.ballDirection= -1 * possMgr.ballDirection;
 possMgr.showPossession();
}
