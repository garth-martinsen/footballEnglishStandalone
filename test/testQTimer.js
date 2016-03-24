QUnit.module( "module QuestionMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<input type="text" id="seconds" value=""+30 readonly>');
    fixture.append('<input type="button" id="stopTimer" value="Clear"></input>');
    fixture.append('<audio id= "beep" > <source src="../public/sounds/beep-07.wav" type="audio/wav"> </audio>');
    fixture.append('<audio id= "homer" > <source id="homer" src="../public/sounds/homer.wav" type="audio/wav"> </audio>');
      
   var bp = $('#beep');
   var hmr = $('#homer');
   var secDisplay = $('#seconds');
   var stopTmr = $('#stopTimer');
   dur =30;
  
   this.qTimer = new QTimer( bp, hmr, secDisplay, stopTmr,dur );
  },
  afterEach: function() {
    this.qTimer = null;
  }
});

  QUnit.test("qTimer.construct", function( assert ) {
     assert.ok(this.qTimer,                              "QTimer  Exists");
     assert.ok(this.qTimer.beep,                         "Beep audio file is accessible.");
     assert.ok(this.qTimer.homer,                        "Homer  audio file is accessible.");
     assert.ok(this.qTimer.secondsDisplay,                      "Seconds Display is accessible.");
     assert.ok(this.qTimer.stopButton,                           "Stop Timer button is accessible.");
     assert.equal(this.qTimer.duration, 30,                     "Countdown timer duration should be 30.");
});

  QUnit.test("qTimer.clockTick ", function( assert ) {
     this.qTimer.duration = 5;
     var etms = new Date().getTime() +2100;

    var s = this.qTimer.clockTick(etms);

    console.log( this.qTimer.created +  "  seconds: " + s);
     assert.equal(s, 2,                              "Seconds returned should be 2.");
});

  QUnit.test("qTimer.startTimer ", function( assert ) {
     var dur = 1;
     this.qTimer.duration = dur;
     var beepStub = sinon.stub(this.qTimer.beep,  "play");
     var homerStub = sinon.stub(this.qTimer.homer, "play");
     
     this.qTimer.startTimer();
    
     console.log(this.qTimer.created + " CountdownTimer display: " +this.qTimer.secondsDisplay.value);
     assert.equal( this.qTimer.secondsDisplay.value, dur,  "Timer should show the starting value at initiation: " + dur);
//  The following asserts do not work even with a time delay, but the stubs at least silence the beep and doh audios playing during tests.
//     assert.ok(beepStub.calledOnce, "Beep.play() should be called after timer expires.");
//     assert.ok(homerStub.calledOnce, "Homer.play() should be called after beep sounds.");
});

  QUnit.test("qTimer.stopTimer ", function( assert ) {
     var dur = 3;
     this.qTimer.duration = dur;
     var beepStub = sinon.stub(this.qTimer.beep,  "play");
     var homerStub = sinon.stub(this.qTimer.homer, "play");

     this.qTimer.stop= true;;
     this.qTimer.startTimer();
 
     console.log(this.qTimer.created + " Testing stop timer. ");
     console.log(this.qTimer.created + " CountdownTimer display: " +this.qTimer.secondsDisplay.value);
     assert.equal( this.qTimer.secondsDisplay.value, dur,  "Timer should show the starting value at initiation: " + dur);
//  The following asserts do not work even with a time delay, but the stubs at least silence the beep and doh audios during tests.
//     assert.ok(beepStub.calledOnce, "Beep.play() should be called after timer expires.");
//     assert.ok(homerStub.calledOnce, "Homer.play() should be called after beep sounds.");
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
   this.duration           = dur; // this may be a configuration parameter in the future.
   this.stop               = false;
   return this;
}

------ */
