QUnit.module( "module QuestionMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<input type="text" id="seconds" value=""+30 readonly>');
    fixture.append('<input type="button" id="stopTimer" value="Clear"></input>');
    fixture.append('<audio id= "beep" > <source src="../public/sounds/beep-07.wav" type="audio/wav"> </audio>');
    fixture.append('<audio id= "homer" > <source id="homer" src="../public/sounds/homer.wav" type="audio/wav"> </audio>');
      
  var timerDuration = 30; 
   this.qTimer = new QTimer(timerDuration );
  },
  afterEach: function() {
    this.qTimer = null;
  }
});

  QUnit.test("qTimer.construct", function( assert ) {
     console.log(this.qTimer.created + " Testing construct, displays seconds: " + this.qTimer.secondsDisplay.value);
     assert.ok(this.qTimer,                              "QTimer  Exists");
     assert.ok($('#beep' ),                              "Beep audio file is accessible.");
     assert.ok($('#homer'),                              "Homer  audio file is accessible.");
     assert.ok($('#secondsDisplay'),                     "Seconds Display is accessible.");
     assert.ok($('#stopTimer'),                          "Stop Timer button is accessible.");
     assert.equal(this.qTimer.duration, 30,              "Countdown timer duration should be 30.");
});

  QUnit.test("qTimer.clockTick ", function( assert ) {
     this.qTimer.duration = 5;
     var etms = new Date().getTime() +2100;

    var s = this.qTimer.clockTick(etms);

     console.log(this.qTimer.created + " Testing clockTick displays seconds:" + s);
     assert.equal(s, 2,                              "Seconds returned should be 2.");
});

  QUnit.test("qTimer.startTimer ", function( assert ) {
     var dur = 5;
     this.qTimer.duration = dur;
    
     this.qTimer.stop=false; 
     this.qTimer.startTimer();
    
     console.log(this.qTimer.created + " Testing startTimer display: " + this.qTimer.secondsDisplay.value);
     console.log(this.qTimer.created + " Expected startTimer display value:  " + this.qTimer.duration);

     assert.equal( this.qTimer.secondsDisplay.value, dur,  "Timer should show the starting value at initiation: " + dur);
});

  QUnit.test("qTimer.stopTimer ", function( assert ) {
     var dur = 4;
     this.qTimer.duration = dur;

     this.qTimer.stop= true;
     this.qTimer.startTimer();
 
     console.log(this.qTimer.created + " Testing stopTimer display: " + this.qTimer.secondsDisplay.value);
     console.log(this.qTimer.created + " Expected stopTimer display value:  " + this.qTimer.duration);

     assert.equal( this.qTimer.secondsDisplay.value, dur,  "Timer should show the starting value at initiation: " + dur);

});
/* ---- REFERENCE: QTimer functions and constructor -----

QTimer.prototype.startTimer =function()
QTimer.prototype.clockTick =function(endTimeMS)
QTimer.prototype.stopTimer()

//-----constructor----------------------
 var QTimer = function(bp, hmr, display, dur, stopTimer) {
   this.secondsDisplay     =$(display);
   this.beep               = $(bp);//
   this.homer              = $(hmr);
   this.stopButton         = $(stopTimer);
   this.duration           = dur; // this is a configuration parameter.
   this.stop               = false;
   return this;
}

------ */
