
QUnit.module( "module EndGameMgr", {


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
    fixture.append(' <input type="submit" class = "button" id="adv" tabindex = "16" value="Advance"    />');
    fixture.append(' <input type="submit" class = "button" id="dir" tabindex = "15" value="Possession" />');
    fixture.append('<input type="text" id="leftScore" tabindex= "-1"  class="scoreInput" readonly="true" value="0">');
    fixture.append('<input type="text" id="rightScore" tabindex= "-1"  class="scoreInput" readonly="true" value="0">');
/* ----------------------------
var delayedTest = function(test){
     setTimeout(function(){
     test;
    },100 );
}
----------------------------- */

 var config= {
            teams: [2,3]  //Chile against Mexico.
          , gameSize: 3
          , timerDuration : 3
          , ballDirection : -1
          , ballLocation : 2  //midfield
          , questionSet: null 
          , created: new Date().toString().slice(-45).substring(4,24).trim() , 
         }


   this.endGameMgr = new EndGameMgr( config );
   this.endGameMgr.timeMs=0;
   var questionMgr = new QuestionMgr(config);
   questionMgr.goalKicks=[1,2,3,4,5,6,7,8,9,10,11,12];
   questionMgr.gameState=1;
   var ball= new Ball(config);
   var possessionMgr = ball.possessionMgr;
  },
  afterEach: function() {
    this.endGameMgr = null;
  }
});

  QUnit.test("EndGameMgr.construct", function( assert ) {
     assert.ok(this.endGameMgr,                              "EndGameMgr  Exists");
     assert.ok(this.endGameMgr.extras,                       "Extras Text input is accessible.");
     assert.ok(this.endGameMgr.trackButton,                  "Track Button exists and is accessible.");
     assert.ok(this.endGameMgr.leftTrackRow,                 "Left Track table row exists and is accessible.");
     assert.ok(this.endGameMgr.rightTrackRow,                "Right Track table row exists and is accessible.");
     assert.ok(this.endGameMgr.teamSelect,                   "Dropdown team select exists and is accessible.");
     assert.ok(this.endGameMgr.modeSelect,                   "Dropdown mode select exists and is accessible.");
     assert.ok(this.endGameMgr.rightWrongSelect,             "Dropdown rightWrong select exists and is accessible.");
     assert.equal(this.endGameMgr.teams[0], 2,              "The team array contains the correct team for left team.");
     assert.equal(this.endGameMgr.teams[1], 3,              "The team array contains the correct team for right team.");
     assert.ok(this.endGameMgr.clock,                       "The clock display exists and is accessible.");
});


  QUnit.test("EndGameMgr.saveGrade wrong answer on first kick", function( assert ) {
     possessionMgr.ballDirection = -1;                      //teams[0], chile, will be the possessor. 
     this.endGameMgr.teamSelect.val(2);                     // the question is addressed to chile.
     this.endGameMgr.rightWrongSelect.val(0);               //Chile answers wrong = pink.
     $('#extras').val(8);                                   // Goal kick question number 8 is presented.
     var id ='#'+ 8; 

     this.endGameMgr.saveGrade();
     var kickRecord = this.endGameMgr.goalKickResults.get(2)[0];    // first kick record for teamId 2, Chile.     
     assert.ok($(id) ,                                     "The new Td exists: " + id);
     assert.ok(this.endGameMgr.teamSelect.val(2),          "The team dropdown still shows the same team: " + 2);
     assert.ok($('#8').hasClass("wrong"),                 "The Td shows that the answer was wrong.");
     assert.equal(kickRecord.result, 'missed',             "The goalKickResults  shows that the kick was bad.");
});


  QUnit.test("EndGameMgr.saveGrade correct answer on first kick", function( assert ) {
     this.endGameMgr.teamSelect.val(2);
     this.endGameMgr.rightWrongSelect.val(1); //correct = green.
     $('#extras').val(4);  // clock shows 50 questions remaining.
     var id ='#'+ 4; 

     this.endGameMgr.saveGrade();
     
     assert.ok($(id) ,                                     "The new Td exists: " + id);
     assert.ok(this.endGameMgr.teamSelect.val(2),          "The team dropdown still shows the same team: " + 2);
     assert.ok($('#4').hasClass("right"),                 "The Td shows that the answer was correct");
});

  QUnit.test("EndGameMgr.createTd", function( assert ) {
     $('#extras').val(5); // Goal kick question # 5. 
     var rightWrong = 1;  // right
     var thisTeam = this.endGameMgr.leftTrackRow;
     var otherTeam= this.endGameMgr.rightTrackRow;
     var id = '#5';

     this.endGameMgr.createTd( 5, rightWrong, thisTeam) 

     assert.ok($(id) ,                    "The new Td exists. ");
     assert.ok($(id).hasClass('right'),   "The new Td has class: right. ");
});

  QUnit.test("EndGameMgr.fixTd ", function( assert ) {
    $('#leftTeamq').append('<td id="5" class= "wrong" >5</td>'); // question was answered incorrectly in the past.
    var right =1;
    assert.ok( $('#5').hasClass('wrong'),                    "Initialized correctly for test with class= wrong ");

    this.endGameMgr.fixTd(5, right, $('#leftTeamq'));

     assert.ok($('#5').hasClass('right'),                    "Replaced class=wrong with the class=right ");
});

  QUnit.test("EndGameMgr.updateTally possessingTeamScoresRight ", function( assert ) {
     possessionMgr.ballDirection = 1; //right goal
     ball.ballLocation = 3;
     var possessor = this.endGameMgr.teams[(possessionMgr.ballDirection == 1)? 1 : 0 ];
     var right =1;
     var wrong = 0;
     var contendor =this.endGameMgr.teams[0];

     this.endGameMgr.updateTally(possessor, right );
     this.endGameMgr.updateTally(contendor, wrong );
 
     var goalKickRecord = this.endGameMgr.goalKickResults.get(3)[0];    //Mexicos first goal kick.
     assert.equal(goalKickRecord.result, 'goal', "On score right, the goalKickResults record for Mexico  should be goal.");
     assert.equal(ball.rightScore, 1, "On score right, the right score should be 1.");
     assert.equal(ball.rightScoreDisplay.val(), 1, "On score right, the right scoreboard should have been updated to 1. ");  
     assert.equal(possessionMgr.ballDirection, 1, "On goal kicks, same team retains possession unless they have had 3 attempts.this is attempt 1.");
//     assert.equal(ball.ballLocation, 3, "After successful goal kick, the ball should be returned to scoring position for the next kick.");

});

 QUnit.test("EndGameMgr.updateTally possessingTeamScoresLeft ", function( assert ) {
     possessionMgr.ballDirection = -1; //left goal
     ball.ballLocation = 1; 
     var possessor = this.endGameMgr.teams[0];
     var contendor =this.endGameMgr.teams[1];

     var right =1;
     var wrong = 0; 

     this.endGameMgr.updateTally(possessor, right );
     this.endGameMgr.updateTally(contendor, wrong );

     var goalKickRecord = this.endGameMgr.goalKickResults.get(possessor)[0];    //Mexicos first goal kick. 
     assert.equal(goalKickRecord.result, 'goal', "The goalKickResults map entry for Mexico should have goal in the first record of its array.");
  //   assert.equal(ball.ballLocation, 1, "After successful goal kick on first attempt, ball should be reset to the scoring position: 1 " );
     assert.equal(ball.leftScore, 1, "On scoreLeft, the left score should be 1.");
     assert.equal(ball.leftScoreDisplay.val(), 1, "On scoreLeft, the left scoreboard display should have been updated to 1. ");
     assert.equal(possessionMgr.ballDirection, -1, "Until this team has 3 attempts, they retain possession for the next attempt.");

});


 QUnit.test("EndGameMgr.updateTally blocked kickj", function( assert ) {
     possessionMgr.ballDirection = -1; //toward left goal
     ball.ballLocation = 1; 
     var possessor = possessionMgr.getPossessor();;
     var right =1;
     var wrong = 0;
     var contendor =this.endGameMgr.teams[1];   //since ballDirection is to the left (-1)

     this.endGameMgr.updateTally(possessor, right );
     this.endGameMgr.updateTally(contendor, right );

     var goalKickRecord = this.endGameMgr.goalKickResults.get(possessor)[0];    //Mexicos first goal kick.
     assert.equal(goalKickRecord.result, 'blocked' , "On  a blocked goal kick, the first record in Mexican array should say: 'blocked'.");
//     assert.equal(ball.ballLocation, 1, "On  a blocked goal kick, the ball stays where it started.");
     assert.equal(possessionMgr.ballDirection, -1, "On a blocked goal kick, the possession will not change unless it is the third attempt. This is the first.");
     assert.equal(possessionMgr.getPossessor(), possessor, "On a blocked goal kick, the possession will not change unless it is the third attempt.");
});

 QUnit.test("EndGameMgr.switchGoals", function( assert ) {
      possessionMgr.ballDirection = -1; //toward left goal
      ball.ballLocation = 1;
      var possessor = possessionMgr.getPossessor();;
      var right =1;
      var wrong = 0;
      var contendor =this.endGameMgr.teams[1];   //since ballDirection is to the left (-1)

      // Miss 
      this.endGameMgr.updateTally(possessor, wrong );
      
      // Block 
      this.endGameMgr.updateTally(possessor, right );
      this.endGameMgr.updateTally(contendor, right );
 
      // Goal 
      this.endGameMgr.updateTally(possessor, right );
      this.endGameMgr.updateTally(contendor, wrong );
  

      var goalKickRecord = this.endGameMgr.goalKickResults.get(possessor);    // Should contain 3 records
      assert.equal(goalKickRecord[0].result, 'missed' , "On  a bad  goal kick, the first record in Mexican array should say: 'missed'.");
      assert.equal(goalKickRecord[1].result, 'blocked' , "On  a blocked goal kick, the second record in Mexican array should say: 'blocked'.");
      assert.equal(goalKickRecord[2].result, 'goal' , "On  a blocked goal kick, the third record in Mexican array should say: 'goal'.");
//      assert.equal(ball.ballLocation, 3, "After three attemps, ball should be in scoring position on the other goal..");
      assert.equal(possessionMgr.ballDirection, 1, "After 3 attempts, the ballDirection should change.");
      assert.equal(possessionMgr.getPossessor(), 3, "After 3 attempts possession should change.");
 });


/* ---- REFERENCE: EndGameMgr functions and constructor -----
EndGameMgr.prototype.defineHandlers  = function(){
EndGameMgr.prototype.ensureSelected=function(){
EndGameMgr.prototype.getRow = function(){
EndGameMgr.prototype.saveGrade = function(){
EndGameMgr.prototype.selectOtherTeam = function(){
EndGameMgr.prototype.createTd = function( cnt, rightWrong, thisTeam, otherTeam){
EndGameMgr.prototype.fixTd = function(num, rightWrong, row){
EndGameMgr.prototype.updateTally = function(teamId, rightWrong){
EndGameMgr.prototype.decideBallAction= function(diff){
EndGameMgr.prototype.registerKick = function(result){
EndGameMgr.prototype.nextGoalKick =function(){
EndGameMgr.prototype.resetTallies= function(){


// constructor---------------------

var endGameMgr = function( cfg ) {
  4 
  5    endGameMgr = this;
  6    this.teams              = cfg.teams;
  7    this.extras             = $('#extras')[0];
  8    this.clock              = $('#falta')[0];
  9    this.trackButton        = $('#saveGrade');
 10    this.leftTrackRow       = $('#leftTeamq');
 11    this.rightTrackRow      = $('#rightTeamq');
 12    this.teamSelect         = $('#team');
 13    this.modeSelect         = $('#mode');
 14    this.rightWrongSelect   = $('#rightWrong');
 15    this.ans                = ["wrong", "right"];
 16    this.tallyPossessor     = 1;                        //difference in tallies is used to controll ball possession and movement. diff =  tallyPossessor - contenderTally
 17    this.tallyContender     = 0;                        // diff=-1 change possession; diff=0 => contestForPossession; diff=1 => nothing; diff=2 -> advanceBall
 18    this.goalKickResults    = new Map().set(this.teams[0], []).set(this.teams[1], []);  //key=teamId, val:array of JSON objects.
 19    this.created            = 'EndGameMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 20    this.defineHandlers();
 21    return this;
 22 }
-- */
