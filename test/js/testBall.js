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
            teams: [0,1]  //Brasil against Chile.
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
      assert.equal(this.ball.leftScoreDisplay.val(), 1 , "Left Score display should have incremented by 1.");
  });


  QUnit.test("ball.advance right", function( assert ) {
      this.ball.setLocation(3);
      this.ball.setDirection(1);

      this.ball.advance();

      assert.equal(this.ball.ballLocation, 4, "BallLocation should be 4: goal.");
      assert.equal(this.ball.ballImage.css("left"), this.ball.ballPositions[4], "BallImage should be at: right goal.");
      assert.equal(this.ball.rightScore, 1 , "Right Score should have incremented by 1.");
      assert.equal(this.ball.rightScoreDisplay.val(), 1 , "Right Score display should have incremented by 1.");
  });

/* ----tests by function and object under test -----
Ball.prototype.defineHandlers = function() {
Ball.prototype.setDirection = function(bd) {  // bd is one of: {-1,1}
Ball.prototype.setLocation = function(loc) {  // loc is one of: {0,1,2,3,4}
Ball.prototype.advance=function(){
Ball.prototype.changePossession =function(){

//-----constructor----------------------
  2 var Ball = function(config) {
  3  this.ballLocation     = config.ballLocation;             //starting location is at midfield.
  4  this.ballDirection    = config.ballDirection;             //until coinflip, then one of: {-1,1}.
  5  this.possessionMgr    = new PossessionMgr(config);          //possessionMgr can be told to change the ballDirection.
  6  this.ballImage        = $('#ball');      // this will move up and down the field upon advance.
  7  this.announcer        = $('#goal');      // announcer saying goooool!
  8  this.leftScoreDisplay = $('#leftScore'); //readOnly text input to display the number of goals for this team.
  9  this.rightScoreDisplay= $('#rightScore'); //readOnly text input to display the number of goals for this team.
 10  this.leftGoalPosition = 0;
 11  this.rightGoalPosition= 4;
 12  this.leftScore        = 0;                //scoreBox can be incremented when ball goes into left goal.
 13  this.rightScore       = 0;               //scoreBox can be incremented when ball goes into right goal.
 14 //ballPositions are sensitive to layout. If it shifts, adjust the values in thes array.
 15  this.ballPositions = ['-30px', '200px', '515px', '830px', '1080px'];
 16    this.created            = 'Ball' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 17  ball = this;
 18  this.defineHandlers();
 19  return this;
 20 }

---- */
