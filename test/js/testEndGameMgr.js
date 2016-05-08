
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


   var questionMgr = new QuestionMgr(config);
   questionMgr.goalKicks=[1,2,3,4,5,6,7,8,9,10,11,12];
   questionMgr.gameState=1;  //endGame
   var ball= new Ball(config);
   var possessionMgr = ball.possessionMgr;
   var popupMgr = new PopupMgr();
   this.endGameMgr = new EndGameMgr( config );
   this.endGameMgr.timeMs=0;
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
     assert.equal(possessionMgr.ballDirection, -1, "On goal kicks, other team gains possession.");
//     assert.equal(ball.ballLocation, 1, "After goal kick attempt, the ball should be placed in scoring position for the other team.");

});

 QUnit.test("EndGameMgr.updateTally possessingTeamScoresLeft ", function( assert ) {
     possessionMgr.ballDirection = -1; //left goal
     ball.ballLocation = 1; 
     var possessor = possessionMgr.getPossessor();
     var contendor = possessionMgr.getContendor();

     var right =1;
     var wrong = 0; 

     this.endGameMgr.updateTally(possessor, right );
     this.endGameMgr.updateTally(contendor, wrong );

     var goalKickRecord = this.endGameMgr.goalKickResults.get(possessor)[0];    //Mexicos first goal kick. 
     assert.equal(goalKickRecord.result, 'goal', "The goalKickResults map entry for Mexico should have goal in the first record of its array.");
     assert.equal(ball.leftScore, 1, "On scoreLeft, the left score should be 1.");
     assert.equal(ball.leftScoreDisplay.val(), 1, "On scoreLeft, the left scoreboard display should have been updated to 1. ");
     assert.equal(possessionMgr.ballDirection, 1, "After a goal kick attempt, the other team gains possession for the next attempt.");
  //   assert.equal(ball.ballLocation, 1, "After successful goal kick on first attempt, ball should be reset to the scoring position: 1 " );

});


 QUnit.test("EndGameMgr.updateTally blocked kick", function( assert ) {
     possessionMgr.ballDirection = -1; //toward left goal
     ball.ballLocation = 1; 
     var possessor = possessionMgr.getPossessor();
     var contendor = possessionMgr.getContendor();
     var right =1;
     var wrong = 0;

     this.endGameMgr.updateTally(possessor, right );
     this.endGameMgr.updateTally(contendor, right );

     var goalKickRecord = this.endGameMgr.goalKickResults.get(possessor)[0];    //Mexicos first goal kick.
     assert.equal(goalKickRecord.result, 'blocked' , "On  a blocked goal kick, the first record in Mexican array should say: 'blocked'.");
     assert.equal(possessionMgr.ballDirection, 1, "On a blocked goal kick, the possession will change.");
//     assert.equal(ball.ballLocation, 3, "After an attempt, the ball will be placed in scoring position for the other team.");  //3 second delay causes error

});

 QUnit.test("EndGameMgr.switchGoals", function( assert ) {
      possessionMgr.setBallDirection( -1 ); //toward left goal
      ball.setLocation( 1 );
      var possessor = possessionMgr.getPossessor();;
      var contendor = possessionMgr.getContendor();
      var right =1;
      var wrong = 0;

      // Miss 
      this.endGameMgr.updateTally(possessor, wrong );
      
      // Block 
      this.endGameMgr.updateTally(contendor, right );     //switched goals so teams are switched.
      this.endGameMgr.updateTally(possessor, right );
 
      // Goal 
      this.endGameMgr.updateTally(possessor, right );
      this.endGameMgr.updateTally(contendor, wrong );
  

      var registry = this.endGameMgr.goalKickResults;    // Should contain 3 records
      assert.equal(registry.get(possessor)[0].result, 'missed' , "On  a bad  goal kick, the first record in Mexican array should say: 'missed'.");
      assert.equal(registry.get(contendor)[0].result, 'blocked' , "On  a blocked goal kick, the contendor record should say: 'blocked'.");
      assert.equal(registry.get(possessor)[1].result, 'goal' , "On  a successful goal kick, the second record should say: 'goal'.");
      assert.equal(possessionMgr.ballDirection, 1, "After 3 attempts, the ballDirection should change.");
      assert.equal(possessionMgr.getPossessor(), 3, "After 3 attempts, ballDirection should be: .");
 });


/* ---- REFERENCE: EndGameMgr functions and constructor -----
EndGameMgr.prototype.defineHandlers  = function(){
EndGameMgr.prototype.ensureSelected=function(){
EndGameMgr.prototype.getRow = function(){
EndGameMgr.prototype.saveGrade = function(){
EndGameMgr.prototype.selectOtherTeam = function(){
EndGameMgr.prototype.createTd = function( cnt, rightWrong, thisTeam){
EndGameMgr.prototype.fixTd = function(num, rightWrong, row){
EndGameMgr.prototype.updateTally = function(teamId, rightWrong){
EndGameMgr.prototype.decideBallAction= function(diff){
EndGameMgr.prototype.displayResult = function(rslt, teamId, attempt){
EndGameMgr.prototype.registerKick = function(result){
EndGameMgr.prototype.phasedBallPlacement = function(aBall){
EndGameMgr.prototype.resetTallies= function(){
EndGameMgr.prototype.totalGoalKicks= function(){
EndGameMgr.prototype.gameIsOver= function(){
EndGameMgr.prototype.disableButtons= function(){
EndGameMgr.prototype.setFirstKickLocation =function(){

//----- constructor ---------------
 var EndGameMgr = function( cfg ) {

   endGameMgr = this;
   this.teams              = cfg.teams;
   this.extras             = $('#extras')[0]; 
   this.trackButton        = $('#saveGrade');
   this.leftTrackRow       = $('#leftTeamq');
   this.rightTrackRow      = $('#rightTeamq');
   this.teamSelect         = $('#team');
   this.modeSelect         = $('#mode');
   this.rightWrongSelect   = $('#rightWrong');
   this.ans                = ["wrong", "right"];
   this.tallyPossessor     = 1;                        //difference in tallies is used to controll ball possession and movement. diff =  tallyPossessor - contenderTally
   this.tallyContender     = 0;                        // diff=-1 change possession; diff=0 => contestForPossession; diff=1 => nothing; diff=2 -> advanceBall
   this.goalKickResults    = new Map().set(this.teams[0], []).set(this.teams[1], []);  //key=teamId, val:array of JSON objects.
   this.timeMs             = 3000;                     // 3 second delay so  ball is seen in net before preparing for next kick. For testing set to 0.
   this.pt                 = false;                    // boolean set to true when possessor tally is augmented.When this.pt and this.ct are true, decideBallAction()
   this.ct                 = false;                    // boolean set to true when contender tally is augmented.When both are true, decideBallAction() is called.
   this.created            = 'EndGameMgr' + new Date().getTime().toString().slice(-4); // last 4 chars give milliseconds, enough for id.
 djssadflkj
qf
  this.defineHandlers();
   this.setFirstKickLocation();                             // Initial goal kick. After each attempt, the teams alternate in attempts.
   return this;
}

-- */
