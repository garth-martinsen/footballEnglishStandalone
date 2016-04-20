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
 this.defineHandlers();
 return this;
}
var ball;

Ball.prototype.defineHandlers = function() {
   $('#adv').on('click', ball.advance);
}

Ball.prototype.setDirection = function(bd) {  // bd is one of: {-1,1}
  this.possessionMgr.ballDirection =bd;
}

Ball.prototype.setLocation = function(loc) {  // loc is one of: {0,1,2,3,4}
  this.ballLocation=loc;
  $('#ball').css("left",loc); 
}

Ball.prototype.advance=function(evt){
if(evt && evt.timeStamp){
  if(evt.timeStamp == ball.formerTimeStamp) {return}
    ball.formerTimeStamp = evt.timeStamp;
}
 ball.ballLocation += ball.possessionMgr.ballDirection;
 $('#ball').css("left", ball.ballPositions[ball.ballLocation]); 
 if(ball.ballLocation === ball.leftGoalPosition && ball.possessionMgr.ballDirection === -1){
      console.log('Gooool' );
//      ball.announcer[0].play();
      ball.leftScore +=1;
      ball.leftScoreDisplay.value = ball.leftScore;  
      ball.possessionMgr.changePossession();
 }
 if(ball.ballLocation === ball.rightGoalPosition && ball.possessionMgr.ballDirection === 1){
      console.log('Gooool' );
 //     ball.announcer.play();
      ball.rightScore +=1;
      ball.rightScoreDisplay.value = ball.rightScore;  
      ball.possessionMgr.changePossession();
 }
}

Ball.prototype.changePossession =function(){
   ball.possessionMgr.changePossession(ball);
}
