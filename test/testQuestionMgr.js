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
      

    var gc       = $('#falta')[0]; 
    var xtras    = $('#extras')[0]; 
    var qb       = $('#quest')[0]; 
    var ab       = $('#showResponse')[0]; 
    var cb       = $('#stopTimer')[0]; 
    var qd       = $('#question_A')[0]; 
    var ad       = $('answer_A')[0]; 
    var gs       = 3; 
    var tmr      = null; // Future object, not ready yet.

//                                     qset, gc , gmsz, xtras, tmr, qb, ab, cb, qd, ad)
    this.questionMgr = new QuestionMgr(qset, gc, gs, xtras, tmr, qb, ab, cb, qd, ad );
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
     assert.equal(this.questionMgr.timer,null,           "30 second Question Timer DOES NOT  exist yet.");
});

  QUnit.test("questionMgr.initialize", function( assert ) {
     this.questionMgr.initialize();

     assert.equal(3, this.questionMgr.gameClock.value,               "ReadOnly clock shows 3 more questions.");
     assert.equal('', this.questionMgr.extras.value,               "Extra questions input shows empty.");
});

/* ---- REFERENCE: tests by grep and object under test -----

QuestionMgr.prototype.initialize      = function()
QuestionMgr.prototype.displayNextItem = function(item )
QuestionMgr.prototype.revealAnswer    = function(item )
QuestionMgr.prototype.decrementClock  = function()
QuestionMgr.prototype.nextQuestion    = function( )
QuestionMgr.prototype.updateClock     = function( )
QuestionMgr.prototype.clearTimer30    = function( )

// ===constructor===
var QuestionMgr = function(qset, gc , gmsz, xtras, tmr, qb, ab, cb, qd, ad){
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
