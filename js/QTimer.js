//-----constructor----------------------
 var QTimer = function( duration ) {
   this.duration           = duration;             // this is a configuration parameter.
   this.beep               = $('#beep')[0];
   this.homer              = $('#homer')[0];
   this.secondsDisplay     = $('#seconds')[0];
   this.stopButton         = $('#stopTimer')[0];
   this.stop               = false;                //this gets set to true when stopTimer button is clicked.
   this.created            = new Date().getTime().toString().slice(-4) ,       

   qTimer = this;
   qTimer.defineHandlers();
   return this;
}
var qTimer;

QTimer.prototype.defineHandlers = function(){
   $('#stopTimer').on('click', qTimer.stopTimer());
}

QTimer.prototype.startTimer = function(){
   $('#seconds')[0].value = qTimer.duration;
   qTimer.stop=false;
   var etms = new Date().getTime() + qTimer.duration *1000;

   var timeinterval = setInterval(function(){
      var t = (qTimer.stop) ? 0 :  qTimer.clockTick(etms);
//      console.log( qTimer.created + " In setInterval, stopped:  " + qTimer.stop +  " Seconds to display: " + t);
      qTimer.secondsDisplay.value = t;
      if(qTimer.stop ) {
        console.log(qTimer.created + ":  timer is being stopped.");
        clearInterval(timeinterval);
      }
      else if(t<=0){
      console.log(qTimer.created + " : Timer is expired!");
       clearInterval(timeinterval);
       qTimer.beep.play()
       setTimeout(function(){ qTimer.homer.play();}, 700);
       $('#seconds').val(0);
      }
    },1000);
}
QTimer.prototype.clockTick =function(endTimeMS){
  var timeMS = endTimeMS - new Date().getTime()
  var seconds = Math.floor(timeMS/1000);
  return seconds;
}

QTimer.prototype.stopTimer = function(){
      qTimer.stop=true;
     }
