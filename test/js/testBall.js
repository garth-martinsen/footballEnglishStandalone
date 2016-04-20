QUnit.module( "module Ball", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<table id="track" border="1px"> <tr id="leftTeamq"><td id="leftTeamName"  class= "trackName" >Argentina</td> </tr> <tr id="rightTeamq"> <td id="rightTeamName" class= "trackName" >Brasil</td></tr> </table> ');
    fixture.append('<img  id="ball" src="../public/images/ball.png">');
    fixture.append('<audio id= "goal"> <source  src="../public/sounds/fbsaGoal.wav" type="audio/wav"> </audio>');
    fixture.append('<input type="text" id="leftScore"  name="leftScore"  class="scoreInput" readonly="true" value="0">');
    fixture.append('<input type="text" id="rightScore" name="rightScore" class="scoreInput" readonly="true" value="0">');
    var loc       = 2;
    var dir       = -1;
    var ballImg   = $('#ball')[0]; 
    var ancr      = $('#goal')[0];
    var lsb       = $('#leftScore')[0]; 
    var rsb       = $('#rightScore')[0]; 

   var config= {
            teams: [0,1]  //Argentina against Brasil.
          , gameSize: 3
          , timerDuration : 30
          , ballDirection : -1
          , ballLocation : 2  //midfield
          , questionSet: null // not needed for this test. 
          , created: new Date().toString().slice(-45).substring(4,24).trim() , 
}


    this.ball = new Ball(config);
  },
  afterEach: function() {
    this.ball = null;
  }
});

  QUnit.test("ball.construct", function( assert ) {
     assert.ok(this.ball, "Ball Exists");
     assert.ok(this.ball.ballImage,     "Image of ball exists.");
     assert.ok(this.ball.announcer,     "Goal announcer exists.");
     assert.ok(this.ball.leftScoreDisplay,  "Left scoreDisplay exists.");
     assert.ok(this.ball.rightScoreDisplay, "Right scoreDisplay exists.");
     assert.equal(this.ball.possessionMgr.ballDirection, -1,     "Starting Ball Direction agrees with initial ballDirection: -1.");
     assert.equal(2, this.ball.ballLocation,      "Ball is at midField.");
     assert.equal(0, this.ball.leftGoalPosition,  "Left Goal position is defined correctly.");
     assert.equal(4, this.ball.rightGoalPosition, "Right Goal position is defined correctly.");
});

  QUnit.test("ball.setDirection", function( assert ) {
     this.ball.setDirection(-1);
     assert.equal( this.ball.possessionMgr.ballDirection, -1, "BallDirection should be -1.");
     this.ball.setDirection(1);
     assert.equal(this.ball.possessionMgr.ballDirection, 1,  "BallDirection should be 1.");
});

  QUnit.test("ball.setLocation", function( assert ) {
      this.ball.setLocation(1);
      assert.equal(1, this.ball.ballLocation, "BallLocation should be 1.");
      this.ball.setLocation(3);
      assert.equal(this.ball.ballLocation, 3, "BallLocation should be 3.");
  });

  QUnit.test("ball.advance left", function( assert ) {
      this.ball.setLocation(1);
      this.ball.setDirection(-1);

      this.ball.advance();

      assert.equal(this.ball.ballLocation, 0, "BallLocation should be 0: goal.");
      assert.equal(this.ball.ballImage.css("left"), this.ball.ballPositions[0], "BallImage should be at: left goal.");
      assert.equal(this.ball.leftScore, 1 , "Left Score should have incremented by 1.");
      assert.equal(this.ball.leftScoreDisplay.value, 1 , "Left Score display should have incremented by 1.");
  });


  QUnit.test("ball.advance right", function( assert ) {
      this.ball.setLocation(3);
      this.ball.setDirection(1);

      this.ball.advance();

      assert.equal(this.ball.ballLocation, 4, "BallLocation should be 4: goal.");
      assert.equal(this.ball.ballImage.css("left"), this.ball.ballPositions[4], "BallImage should be at: right goal.");
      assert.equal(this.ball.rightScore, 1 , "Right Score should have incremented by 1.");
      assert.equal(this.ball.rightScoreDisplay.value, 1 , "Right Score display should have incremented by 1.");
  });

/* ----tests by function and object under test ---- This info could be stale, replace it with current or ignore-
Ball.prototype.defineHandlers = function() {
Ball.prototype.setDirection = function(bd) {  // bd is one of: {-1,1}
Ball.prototype.setLocation = function(loc) {  // loc is one of: {0,1,2,3,4}
Ball.prototype.advance=function(){
Ball.prototype.changePossession =function(){

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
//ballPositions are sensitive to field layout. If it shifts, adjust the values in this array.
 this.ballPositions = ['-30px', '200px', '515px', '830px', '1080px']; 
   this.created            = 'Ball' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 ball = this;
 this.defineHandlers();
 return this;
}

   ---- */
