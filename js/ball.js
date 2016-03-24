//-----constructor----------------------
var Ball = function(loc, dir, ballImg, ancr, lsd, rsd ) {
 this.ballImage        = $(ballImg); // $('#ball'); 
 this.announcer        = $(ancr);  //$('#goal');
 this.leftScoreDisplay = $(lsd);  // $('#leftScore'); //readOnly text input to display the number of goals for this team.
 this.rightScoreDisplay= $(rsd);  //$('#rightScore'); //readOnly text input to display the number of goals for this team.
 this.ballLocation     = loc;  //starting location is at midfield.
 this.ballDirection    = dir;  //until coinflip, then one of: {-1,1}.
 this.leftGoalPosition = 0;
 this.rightGoalPosition= 4;
 this.leftScore        = 0;
 this.rightScore       = 0;
//ballPositions are sensitive to layout. If it shifts, adjust the values in thes array.
 this.ballPositions = ['-30px', '200px', '515px', '830px', '1080px']; 
 return this;
}

Ball.prototype.coinflip = function () {
 var result=0;
 while (result == 0){ 
   result = Math.floor((Math.random() * 3)-1 ); //will be one of:{-1,0,1} if zero, tries again.Hence, one of: { -1 or +1} emerges for starting direction
 }
 this.ballDirection = result;
}

Ball.prototype.setDirection = function(bd) {  // bd is one of: {-1,1}
  this.ballDirection = bd; 
}

Ball.prototype.setLocation = function(loc) {  // loc is one of: {0,1,2,3,4}
  this.ballLocation=loc;
  this.ballImage.css("left",loc); 
}

Ball.prototype.advance=function(){
 this.ballLocation += this.ballDirection;
 this.ballImage.css("left", this.ballPositions[this.ballLocation]); 
 if(this.ballLocation === this.leftGoalPosition && this.ballDirection === -1){
      console.log('Gooool' );
      this.announcer[0].play();
      this.leftScore +=1;
      this.leftScoreDisplay.val(this.leftScore);  
 }
 if(this.ballLocation === this.rightGoalPosition && this.ballDirection === 1){
      console.log('Gooool' );
      this.announcer[0].play();
      this.rightScore +=1;
      this.rightScoreDisplay.val(this.rightScore);  
 }
}
/* ---------
Ball.prototype.scoreLeft=function(){
 this.ballImage.css("left", this.ballPositions[this.ballLocation]);
 if(this.ballLocation === this.leftGoalPosition && this.ballDirection === -1){
      console.log('Gooool' );
      this.announcer.play();
      this.leftScore +=1;
      this.leftScoreDisplay.html(this.leftScore);
 }
 if(this.ballLocation === this.rightGoalPosition && this.ballDirection === 1){
      console.log('Gooool' );
      this.announcer.play();
      this.rightScore +=1;
      this.rightScoreDisplay.html(this.rightScore);
 }
}
----------- */
