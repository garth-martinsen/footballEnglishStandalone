//-----constructor----------------------
var Ball = function(config) {
 this.ballLocation     = config.ballLocation;                //game begins with location at midfield, ball advances after that to change location..
 this.possessionMgr    = new PossessionMgr(config);          //possessionMgr changes ballDirection and displays ballDirection indicators.
 this.ballImage        = $('#ball');       // this will move up and down the field upon advances.
 this.announcer        = $('#goal');       // announcer saying goooool!
 this.leftScoreDisplay = $('#leftScore');  //readOnly text input to display the number of goals for left team.
 this.rightScoreDisplay= $('#rightScore'); //readOnly text input to display the number of goals for right team.
 this.leftGoalPosition = 0;
 this.rightGoalPosition= 4;
 this.leftScore        = 0;                //Integer, scoreBox can be incremented when ball goes into left goal.
 this.rightScore       = 0;                //Integer, scoreBox can be incremented when ball goes into right goal.
 this.formerTimeStamp  = 0;
//ballPositions are sensitive to field layout. If it shifts, adjust the values in this array.
 this.ballPositions = ['-30px', '200px', '515px', '830px', '1080px']; 
   this.created            = 'Ball' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 ball = this;
 return this;
}
var ball;

Ball.prototype.inGoal = function() {  
  return (ball.ballLocation == 0 || ball.ballLocation == 4 ); 
}
Ball.prototype.scoredLeftGoal = function() {  
  return (ball.ballLocation == 0 && possessionMgr.ballDirection == -1); 
}

Ball.prototype.scoredRightGoal = function() {
  return (ball.ballLocation == 4 && possessionMgr.ballDirection == 1); 
}
Ball.prototype.setLocation = function(loc) {  // loc is one of: {0,1,2,3,4}
  this.ballLocation=loc;
  this.displayBallLocation();
}

Ball.prototype.displayBallLocation =function(){
   $('#ball').css("left", this.ballPositions[this.ballLocation]);
}

Ball.prototype.advance=function(evt){
   if(evt && evt.timeStamp){
       console.log('advance evt.timeStamp: ' + evt.timeStamp );
       if(evt.timeStamp == ball.formerTimeStamp) {return;}
       ball.formerTimeStamp = evt.timeStamp;
   }
   ball.ballLocation += ball.possessionMgr.ballDirection;
   ball.displayBallLocation();
   if(ball.scoredLeftGoal()){ 
      ball.goalScoredLeft();  
   } else if(ball.scoredRightGoal()){
      ball.goalScoredRight(); 
   } 
}

Ball.prototype.goalScoredLeft =function(){
      console.log('Gooool on Left' );
 //     ball.announcer[0].play();
      ball.leftScore +=1;
      ball.leftScoreDisplay.val( ball.leftScore);  
      $('#game').trigger("goal:scored");
}


Ball.prototype.goalScoredRight =function(){
      console.log('Gooool on Right' );
//      ball.announcer.play();
      ball.rightScore +=1;
      ball.rightScoreDisplay.val( ball.rightScore);  
      $('#game').trigger("goal:scored");
}

Ball.prototype.setKickLocation =function(){
  possessionMgr.ballDirection= popupMgr.coinflip();
  possessionMgr.showPossession();
  ball.ballLocation = (possessionMgr.ballDirection < 0 ) ? 1 : 3;
  ball.displayBallLocation();
}
