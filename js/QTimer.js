//-----constructor----------------------
 var QTimer = function(bp, hmr, display, stopTimer, dur ) {
   this.beep               = $(bp)[0];//
   this.homer              = $(hmr)[0];
   this.secondsDisplay     = $(display)[0];
   this.stopButton         = $(stopTimer)[0];
   this.duration           = dur; // this may be a configuration parameter in the future.
   this.stop               = false;  //this gets set to true when stopTimer button is clicked.
   this.created            = new Date().getTime().toString().slice(-4);;
   return this;
}

QTimer.prototype.startTimer = function(){
   this.secondsDisplay.value = this.duration;
   var endTimeMS= new Date().getTime() + this.duration *1000;
   var display = this.secondsDisplay;
   var stop = this.stop;
   var beep = this.beep;
   var created = this.created;
   var clockTick = this.clockTick;
   var homer = this.homer;
   var timeinterval = setInterval(function(){
      var t = clockTick(endTimeMS);
      console.log( created + " Seconds to display: " + t);
      console.log( created + " Timer.stop: " + stop );
      display.value=t;
      if(stop) {
        console.log(created + ":  timer is being stopped.");
        clearInterval(timeinterval);
        stop=false;
        display.value=0;
      }
      else if(t<=0){
      console.log(created + " : Timer is expired!");
       clearInterval(timeinterval);
       display.value=0;
       beep.play();
       setTimeout(function(){ homer.play();}, 700);
      }
    },1000);
}
QTimer.prototype.clockTick =function(endTimeMS){
  var timeMS = endTimeMS - new Date().getTime()
  var seconds = Math.floor(timeMS/1000);
  return seconds;
}

QTimer.prototype.stopTimer = function(){
      this.stop=true;
     }
