QUnit.module( "module QuestionMgr", {
  beforeEach: function() {
    var qset       =[{
	"a": "Monday",
	"count": 20,
	"q": "¿Como se dice _____ lunes_____ en Inglés?",
        "qs": "¿Como se dice _____ lunes_____ en Inglés?",
        "qp": " como você dizer _____ Segunda-feira_____ em inglês?",
	"type": "Days of the Week"
},
{
	"a": "Wednesday",
	"count": 20,
	"q": "¿Como se dice ___ miércoles ___ en Inglés?",
        "qs": "¿Como se dice ____ miércoles ______ en Inglés?",
        "qp": " como você dizer ____Quarta-feira ______ em inglês?",
	"type": "Days of the Week"
},
{
	"a": "Tuesday",
	"count": 20,
	"q": "¿Como se dice _____martes ___  en Inglés?",
        "qs": "¿Como se dice ___ martes __ en Inglés?",
        "qp": " como você dizer _____ terça-feira Inglês?",
	"type": "Days of the Week"
},
]; 
    var fixture = $("#qunit-fixture");
    fixture.append('<input type="text" id="falta" width= "50px" readonly >900</input>');
    fixture.append('<input type ="text" id="extras"; background-color:pink; >');
    fixture.append('<input type="button" id="quest" value="Question"></input>');
    fixture.append('<input type="button" id="stopTimer" value="Clear"></input>');
    fixture.append('<button id="showResponse" class="button" >Show Answer</button>');
    fixture.append('<textArea id="question_A" name="questionA" class= "q_a" font-size="x-large" rows="10" cols="15" readonly ><%=questionA %> </textArea>');
    fixture.append('<textArea id="answer_A" name="answerA" class= "q_a" rows="10" cols="15" readonly><%=answerA %> </textArea>');
    fixture.append( '<select id="team" > <option value="0" >Brasil</option> <option value="1" >Chile</option> </select>');
//-------Timer fixtures ----
    fixture.append('<input type="text" id="seconds" value=""+30 readonly>');
    fixture.append('<input type="button" id="stopTimer" value="Clear"></input>');
    fixture.append('<audio id= "beep" > <source src="../public/sounds/beep-07.wav" type="audio/wav"> </audio>');
    fixture.append('<audio id= "homer" > <source id="homer" src="../public/sounds/homer.wav" type="audio/wav"> </audio>');

   var bp = $('#beep');
   var hmr = $('#homer');
   var secDisplay = $('#seconds');
   var stopTmr = $('#stopTimer');
   dur =3; //3 seconds for testing. 30 secs for prod.

    var qTimer = new QTimer( bp, hmr, secDisplay, stopTmr,dur ); 
    var gc       = $('#falta')[0]; 
    var xtras    = $('#extras')[0]; 
    var qb       = $('#quest')[0]; 
    var ab       = $('#showResponse')[0]; 
    var cb       = $('#stopTimer')[0]; 
    var qd       = $('#question_A')[0]; 
    var ad       = $('#answer_A')[0]; 
    var tms      = $('#team')[0]; 
    var lt       = 1; //Brasil
    var rt       = 2; //Chile
    var gs       = 3; //game size

    this.questionMgr = new QuestionMgr(qset, gc, gs, xtras, qTimer, qb, ab, cb, qd, ad, tms, lt, rt );
  },
  afterEach: function() {
    this.questionMgr = null;
  }
});

  QUnit.test("questionMgr.construct", function( assert ) {
     assert.ok(this.questionMgr,                         "QuestionMgr Exists");
     assert.equal(3, this.questionMgr.gameSize,          "Game size should be 3.");
     assert.equal(3, this.questionMgr.remainingCount,    "RemainingCount should be 3.");
     assert.ok(this.questionMgr.gameClock,               "ReadOnly clock display exists.");
     assert.ok(this.questionMgr.extras,                  "Extra questions input exists.");
     assert.ok(this.questionMgr.questionButton,          "Next Question button exists.");
     assert.ok(this.questionMgr.answerButton,            "Show Answer  button exists.");
     assert.ok(this.questionMgr.clearButton,             "Clear timer button exists.");
     assert.ok(this.questionMgr.teamSelect,              "Team Select exists");
     assert.equal(this.questionMgr.teams[0], 1,         "Team array[0] is correct." );
     assert.equal(this.questionMgr.teams[1], 2,         "Team array[1] is correct." );
     assert.ok(this.questionMgr.timer,                  "30 second Question Timer exists.");
});

  QUnit.test("questionMgr.initialize", function( assert ) {
     this.questionMgr.initialize();

     assert.equal(3, this.questionMgr.gameClock.value,               "ReadOnly clock shows 3 more questions.");
     assert.equal('', this.questionMgr.extras.value,               "Extra questions input shows empty.");
});

  QUnit.test("questionMgr.decrementClock", function( assert ) {
     // initial clock value is 3.
     this.questionMgr.decrementClock();

     assert.equal(2, this.questionMgr.remainingCount, "Remaining questions should be 2");              

});

  QUnit.test("questionMgr.updateClock", function( assert ) {
     this.questionMgr.updateClock(2);
     assert.equal(2, this.questionMgr.gameClock.value, "The game clock should display  2");              

});

  QUnit.test("questionMgr.nextQuestion", function( assert ) {
     this.questionMgr.remainingCount=2;
     // next question will be item[2];
     var nq = this.questionMgr.nextQuestion();
     assert.equal( nq,this.questionMgr.questionSet[2], "Returned item should equal questionSet[2].");              
});

  QUnit.test("questionMgr.displayItem", function( assert ) {
     var item = this.questionMgr.questionSet[2];
     this.questionMgr.teams=[1,2];
     var selected = this.questionMgr.teamSelect.value=0;

     this.questionMgr.displayItem(item);

     assert.equal(this.questionMgr.questionDisplay.text() ,this.questionMgr.questionSet[2].qp, "Displayed question should be in Portuguese.");              
     assert.equal( this.questionMgr.answerDisplay.css('color'), "rgb(255, 255, 255)", "The Answer text color should be white so it is invisible");
});

  QUnit.test("questionMgr.revealAnswer", function( assert ) {
     var item = this.questionMgr.questionSet[2];
     
     this.questionMgr.revealAnswer(item);

     assert.equal(this.questionMgr.answerDisplay.css('color'), "rgb(0, 0, 0)" , "The Answer text color should be black, so it is visible.");
});

  QUnit.test("questionMgr.clearTimer30", function( assert ) {
     
     this.questionMgr.clearTimer30();

     assert.ok(this.questionMgr.timer.stop,  "The embeded timer must be set to stop=true.");
});

/* ---- REFERENCE: tests by grep and object under test -----

QuestionMgr.prototype.initialize      = function()
QuestionMgr.prototype.decrementClock  = function()
QuestionMgr.prototype.updateClock     = function( )
QuestionMgr.prototype.nextQuestion    = function( )
QuestionMgr.prototype.displayItem     = function(item )
QuestionMgr.prototype.revealAnswer    = function(item )
QuestionMgr.prototype.clearTimer30    = function( )

// ===constructor===
var QuestionMgr = function(qset, gc , gmsz, xtras, tmr, qb, ab, cb, qd, ad, tms, tmArray){
 this.questionSet     = qset;   //array of questions used to play the game. Read from file during game.configuration.
 this.gameClock       = gc;     //readOnly text input, Decrementing Counter for each question tracked. Used to get next question.
 this.extras          = xtras;  //text input to revisit questions. Its value trumps gameClock for index of next question/answer.
 this.timer           = tmr;    // 30 second countdown timer for each question.
 this.questionButton  = $(qb);  // button. when clicked, the next question & answer are displayed but answer is hidden.
 this.answerButton    = $(ab);  // button. When clicked, the hidden answer is displayed.
 this.clearButton     = $(cb);  // button. when clicked, the timer is cleared and ceases to count down.
 this.questionDisplay = $(qd);  // textArea where the question is displayed.
 this.answerDisplay   = $(ad);  // textArea where the answer is displayed.
 this.gameSize        = gmsz;   // initial value of the clock
 this.remainingCount  = gmsz;   // gets decremented for each question tracked.
 return this;
}
---- */
