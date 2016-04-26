QUnit.module( "module TrackMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<input   id="extras"    type ="text" background-color:pink; >');
    fixture.append('<select id="team" >    <option value="2" >Chile</option> <option value="3" >Mexico</option> </select>');
    fixture.append('<input   id="saveGrade" type="submit" class="button" value="track" formaction="/updateTrack" formmethod="post" formenctype="application/x-www-form-urlencoded" />');
    fixture.append('<table   id="track" border="1px"> <tr id="leftTeamq"><td id="leftTeamName" class= "trackName" >Chile</td></tr> <tr id="rightTeamq"><td id="rightTeamName" class= "trackName" >Mexico</td></tr> </table> ');
    fixture.append('<select id="team" > <option value="2" >Chile</option> <option value="3" >Mexico</option> </select>');
    fixture.append('<select id="mode" name="mode" > <option value="0" >Advance</option> <option value="1" >Possess</option> </select>');
    fixture.append('<select id="rightWrong" name="rightWrong" > <option value="-1" >?</option> <option value="0" >Right</option> <option value="1" >Wrong</option> </select>');
    fixture.append('<input type="text" id="falta" value ="100" width="50px" readonly >');
    fixture.append(' <input type="submit" class = "button" id="adv" tabindex = "16" value="Advance" formaction="/advance" formmethod="post" formenctype="application/x-www-form-url    encoded" />');
    fixture.append(' <input type="submit" class="button" id="dir" tabindex = "15" value="Possession" formaction="/possession" formmethod="post" formenctype="application/x-www-form-urlencoded"/>');
    fixture.append('<input type="text" id="leftScore" tabindex= "-1"  class="scoreInput" readonly="true" value="0">');
    fixture.append('<input type="text" id="rightScore" tabindex= "-1"  class="scoreInput" readonly="true" value="0">');

 var config= {
            teams: [2,3]  //Chile against Mexico.
          , gameSize: 3
          , timerDuration : 30
          , ballDirection : -1
          , ballLocation : 2  //midfield
          , questionSet: null //not important for these tests. 
          , created: new Date().toString().slice(-45).substring(4,24).trim() , 
         }


   this.trackMgr = new TrackMgr( config );
   this.questionMgr = new QuestionMgr(config);
  },
  afterEach: function() {
    this.trackMgr = null;
  }
});

  QUnit.test("TrackMgr.construct", function( assert ) {
     assert.ok(this.trackMgr,                              "TrackMgr  Exists");
     assert.ok(this.trackMgr.extras,                       "Extras Text input is accessible.");
     assert.ok(this.trackMgr.trackButton,                  "Track Button exists and is accessible.");
     assert.ok(this.trackMgr.leftTrackRow,                 "Left Track table row exists and is accessible.");
     assert.ok(this.trackMgr.rightTrackRow,                "Right Track table row exists and is accessible.");
     assert.ok(this.trackMgr.teamSelect,                   "Dropdown team select exists and is accessible.");
     assert.ok(this.trackMgr.modeSelect,                   "Dropdown mode select exists and is accessible.");
     assert.ok(this.trackMgr.rightWrongSelect,             "Dropdown rightWrong select exists and is accessible.");
     assert.equal(this.trackMgr.teams[0], 2,              "The team array contains the correct team for left team.");
     assert.equal(this.trackMgr.teams[1], 3,              "The team array contains the correct team for right team.");
     assert.ok(this.trackMgr.clock,                       "The clock display exists and is accessible.");
});

// This test is not working. I am having trouble triggering a click on the saveGrade Button.

  QUnit.test("TrackMgr.saveGrade ", function( assert ) {
     this.trackMgr.teamSelect.val(2);
     this.trackMgr.rightWrongSelect.val(1); //correct = green.
     $('#falta').val(50);  // clock shows 50 questions remaining.
     var id ='#'+ 50; 

     this.trackMgr.saveGrade();
     
     assert.ok($(id) ,                                     "The new Td exists: " + id);
     assert.ok(this.trackMgr.teamSelect.val(3),        "The team dropdown has selected the other team: 3.");
     assert.ok($('#50').hasClass("right"),                 "The Td shows that the answer was correct");
});

  QUnit.test("TrackMgr.saveGrade for bad goalee kick ", function( assert ) {  //goalee kick after opposing team has scored. Team has answered incorrectly.
     this.trackMgr.teamSelect.val(2);   //Chile goalee is kicking.
     this.trackMgr.rightWrongSelect.val(0);  //wrong=pink
     this.trackMgr.ball.ballLocation=4;  // ball is being kicked by goalee at the right goal.
     $('#falta').val(50);  // clock shows 50 questions remaining.
     var id ='#'+ 50; 
     var xid ='#X'+ 50; 

     this.trackMgr.saveGrade();
     
     assert.ok($(id) ,                                     "The new Td exists: " + id );
     assert.ok($(xid) ,                                    "The new X Td exists for goalee kick: " + xid);
     assert.ok(this.trackMgr.teamSelect.val() == 2,        "The team dropdown should have kept selection as 2.");
     assert.ok($(id).hasClass('wrong') ,                   "The new Td shows that answer was wrong.");

});

  QUnit.test("TrackMgr.setBallLocation ", function( assert ) {  // used to prepare for penalty kicks etc at end of game.
     var loc = 3;

     this.trackMgr.setBallLocation(loc) ;  // ball is being placed in front of right goal.
    
     assert.equal(this.trackMgr.ball.ballLocation, loc,     "Ball location is correct at: " + loc );
  });
  QUnit.test("TrackMgr.createTd", function( assert ) {
     $('#falta').val(50);  // clock shows 50 questions remaining.
     var cnt = 50;
     var rightWrong = 1;  // right
     var thisTeam = this.trackMgr.leftTrackRow;
     var otherTeam= this.trackMgr.rightTrackRow;
     var id = '#50';

     this.trackMgr.createTd( cnt, rightWrong, thisTeam, otherTeam) 

     assert.ok($(id) ,                    "The new Td exists. ");
     assert.ok($(id).hasClass('right'),   "The new Td has class: right. ");
});

  QUnit.test("TrackMgr.fixTd ", function( assert ) {
    $('#leftTeamq').append('<td id="55" class= "wrong" >55</td>'); // question was answered incorrectly in the past.
    var right =1;
    assert.ok( $('#55').hasClass('wrong'),                    "Initialized correctly for test with class= wrong ");

    this.trackMgr.fixTd(55, right, $('#leftTeamq'));

     assert.ok($('#55').hasClass('right'),                    "Replaced class=wrong with the class=right ");
});

  QUnit.test("TrackMgr.updateClock ", function( assert ) {
     
    this.trackMgr.updateClock(2);

     assert.equal($('#falta').val(),  "2" ,                    "the Clock was updated to 2 questions left.");
});

  QUnit.test("TrackMgr.updateTally possessingTeamScoresRight ", function( assert ) {
     this.trackMgr.ball.possessionMgr.ballDirection = 1; //right goal
     trackMgr.possessor = trackMgr.teams[(trackMgr.ball.possessionMgr.ballDirection == 1)? 1 : 0 ];
     var right =1;
     var wrong = 0;
     var possessor = this.trackMgr.possessor;
     var contendor =this.trackMgr.teams[0];

     this.trackMgr.updateTally(possessor, right );
     this.trackMgr.updateTally(contendor, wrong );
     this.trackMgr.updateTally(possessor, right );
     this.trackMgr.updateTally(contendor, wrong );
 
     assert.equal(this.trackMgr.ball.ballLocation, 4, "On score right, the ballLocation should be 4, goal.");
     assert.equal(this.trackMgr.ball.rightScore, 1, "On score right, the right score should be 1.");
     assert.equal(this.trackMgr.ball.rightScoreDisplay.val(), 1, "On score right, the right scoreboard should have been updated to 1. ");  
     assert.equal(this.trackMgr.ball.possessionMgr.ballDirection, -1, "On score right, after a goal, the other team gets possession of the ball.");

});

 QUnit.test("TrackMgr.updateTally possessingTeamScoresLeft ", function( assert ) {
     this.trackMgr.ball.possessionMgr.ballDirection = -1; //left goal
     trackMgr.possessor = trackMgr.teams[(trackMgr.ball.possessionMgr.ballDirection == 1)? 1 : 0 ];
     var right =1;
     var wrong = 0;
     var possessor = this.trackMgr.possessor;
     var contendor =this.trackMgr.teams[1];

     this.trackMgr.updateTally(possessor, right );
     this.trackMgr.updateTally(contendor, wrong );
     this.trackMgr.updateTally(possessor, right );
     this.trackMgr.updateTally(contendor, wrong );

     console.log('ballLocation should be 1 : ' + this.trackMgr.ball.ballLocation);
     console.log('leftScore should be 1 : ' + this.trackMgr.ball.leftScore);
     assert.equal(this.trackMgr.ball.ballLocation, 0, "On score left, the ballLocation should be 0, goal.");
     assert.equal(this.trackMgr.ball.leftScore, 1, "On scoreLeft, the left score should be 1.");
     assert.equal(this.trackMgr.ball.leftScoreDisplay.val(), 1, "On scoreLeft, the left scoreboard should have been updated to 1. ");
     assert.equal(this.trackMgr.ball.possessionMgr.ballDirection, 1, "On scoreLeft, after a goal, the other team gets possession of the ball.");

});


 QUnit.test("TrackMgr.updateTally changePossessionFromLefttoRight ", function( assert ) {
     this.trackMgr.ball.possessionMgr.ballDirection = -1; //toward left goal
     trackMgr.possessor = trackMgr.teams[(trackMgr.ball.possessionMgr.ballDirection == 1)? 1 : 0 ];
     var right =1;
     var wrong = 0;
     var possessor = this.trackMgr.possessor;
     var contendor =this.trackMgr.teams[1];

     this.trackMgr.updateTally(possessor, wrong );
     this.trackMgr.updateTally(contendor, right );
     this.trackMgr.updateTally(possessor, wrong );
     this.trackMgr.updateTally(contendor, right );

     assert.equal(this.trackMgr.ball.ballLocation, 2, "On change of possession, the ballLocation should not change.");
     assert.equal(this.trackMgr.ball.possessionMgr.ballDirection, 1, "On change of possession, the other team gets possession of the ball.");
});

/* ------------REFERENCE: trackMgr functions and constructor  -----
TrackMgr.prototype.initialize  = function(){
X  TrackMgr.prototype.setBallLocation  = function(loc){
X  TrackMgr.prototype.saveGrade = function(){
X  TrackMgr.prototype.createTd = function( cnt, rightWrong, thisTeam, otherTeam){
X  TrackMgr.prototype.fixTd = function(num, rightWrong, row){
X  TrackMgr.prototype.updateClock = function(num){
 //----- constructor ---------------
  2  var TrackMgr = function( tl, tr  ) {
  3    
  4    this.extras             = $('#extras');
  5    this.clock              = $('#falta');
  6    this.trackButton        = $('#saveGrade');
  7    this.leftTrackRow       = $('#leftTeamq');
  8    this.rightTrackRow      = $('#rightTeamq');
  9    this.teamSelect         = $('#team');
 10    this.modeSelect         = $('#mode');
 11    this.rightWrongSelect   = $('#rightWrong');
 12    this.teams              = [tl,tr];
 13    this.ans                = ["right", "wrong"];
 14    this.ballLocation       = 2;  //default is midfield. this will be set dynamically as the ball moves.
 15    this.created            = new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 16    return this;            
 17 }  

-----  */
/* ---- REFERENCE: QTimer functions and constructor -----
TrackMgr.prototype.initialize  = function(){
TrackMgr.prototype.tabToSaveGrade  = function(){
TrackMgr.prototype.saveGrade = function(){
TrackMgr.prototype.updateClock = function( cnt){
TrackMgr.prototype.createTd = function( cnt, rightWrong, thisTeam, otherTeam){
TrackMgr.prototype.fixTd = function(num, rightWrong, row){
TrackMgr.prototype.updateTally = function(teamId, rightWrong){
TrackMgr.prototype.decideBallAction= function(diff){
TrackMgr.prototype.possessionMgr= function(){

//----- constructor ---------------
 var TrackMgr = function( cfg ) {

   this.teams              = cfg.teams;
   this.ball               = new Ball(cfg);
   this.extras             = $('#extras')[0]; 
   this.clock              = $('#falta')[0];
   this.trackButton        = $('#saveGrade');
   this.leftTrackRow       = $('#leftTeamq');
   this.rightTrackRow      = $('#rightTeamq');
   this.teamSelect         = $('#team');
   this.modeSelect         = $('#mode');
   this.rightWrongSelect   = $('#rightWrong');
   this.ans                = ["right", "wrong"];
   this.possessor          = 0; //set at coin flip and every time ball changes possession. value is one of: {tl,tr}
   this.possessorTally     = 0; //difference in tallies is used to controll ball possession and movement. diff =  possessorTally - contenderTally
   this.contendorTally     = 0;  // diff=-1 change possession; diff=0 => contestforPossession; diff=1 => nothing; diff=2 -> advanceBall
   this.created            = 'TrackMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
   trackMgr = this;
   return this;
}



------ */
