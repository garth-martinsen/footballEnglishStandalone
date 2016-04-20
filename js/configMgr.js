/* ---Requirements---------------

This class is responsible for: 
1. Defining all handlers for the app:
	 Handling the click of the Config Link to open the config dialog
 	 Handling the click of the Choose File Button in the config dialog.
 	 Handling the click of the Accept Button to close the config dialog.
3. Reading the values received from the Configuration popup: TeamLeft, TeamRight, GameSize, File for questions.
4. Reading in the file with the QuestionSet.
5. Randomizing the order of the questions in the questionSet.
6. Setting the starting value of the game clock.
7. Using the values from the config popup to select and set images for: ScoreBars, GoalBars, Arrows, Track Labels.
8. Instantiating the following Objects with values from Config popup: Ball( with possessionMgr), QuestionMgr(with QTimer), TrackMgr .  
--------Requirements-----------  */

//----- constructor ---------------
 var ConfigMgr = function() {
   configMgr = this;  //set the object in global scope so I can assess it inside of event handlers where "this" points to a different object.
   this.configLink         = $('#doConfig');      // raises the popup which has ways to select teams and questionSet, enter gameSize.
   this.dialog             = '';                  //set to open when open and closed when closed.
// elements which will be modified when config data is known.
   this.rawQuestions       = null;                // Raw questions, read from file. Goes to empty when loading randomized questionSet map. 
   this.questionSet        = new Map;             // Randomized questions stored in map( key=count, value= item.)
   // following values are set with the popup results. 
   this.count              = -1;                  // integer 1 < count < 100   determined from popup.gameSizeInput     results;
   this.clock              = $('#falta');         // readOnly text input to show how many questions are left,  integer 0 < falta  < gameSize 
   // Then folloing objects will be instantiated with the config data, data computed in configure(...), and modified elements above. 
   this.ball               = null;                //instantiated in the configure method .
   this.questionMgr        = null;                //instantiated in the configure method .
   this.trackMgr           = null;                //instantiated in the configure method .
   // Object name plus last 4 chars give milliseconds, enough for id.This helps if threads are confusing which objects are acting and in which order.
   this.created            = 'ConfigMgr' + new Date().getTime().toString().slice(-4); 
   this.initialize();
   return this;
}

//Add function for animation of popup to JQuery functions
$(function() {
 $.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
    };
  deselect = function(e){
   $('.pop').slideFadeToggle(function() {
     e.removeClass('selected');
   });
 }
});

 var dialog =""; //global var to see if the dialog is open or closed.
 var configMgr; //creates a global variable for the configMgr to be used inside of handler functions where this means something else.

ConfigMgr.prototype.initialize = function(){
   // event handlers so that config dialog can be opened and shut.
   this.teamsReady         = false;
   this.fileReady          = false;
   $('.close').disable (true);  // diabled until the file and the teams are ready.One cannot close the popup dialog without putting in the values needed. 
   $('#teamLeft').on( 'change', this.checkTeams);
   $('#teamRight').on('change', this.checkTeams);
   $('#fileInput').on('change', this.checkFile);
   $('#doConfig').on( 'click',    this.openDialog);
   $('.close').on(    'click',    this.closeDialog);
}
//Handlers to open and close  popup dialog to get configuration: leftTeam, rightTeam, gameSize, question set. 
ConfigMgr.prototype.defineHandlers = function(){
//  console.log('Entered function defineHandlers...');
    $('#quest').on(       'click',    this.displayNextItem );
    $('#stopTimer').on(   'click',    this.clearQuestionTimer);
    $('#showResponse').on('click',    this.questionMgr.revealAnswer);
    $('#saveGrade').on(   'click',    this.trackMgr.saveGrade);

}

ConfigMgr.prototype.checkTeams = function(){
   var leftTeam = Number( $('#teamLeft').val());
   var rightTeam= Number( $('#teamRight').val());
   if( leftTeam != rightTeam) {
      configMgr.teamsReady = true;
   } else {
        configMgr.teamsReady= false; 
   }
   if(configMgr.fileReady && configMgr.teamsReady) {
      $('.close').disable(false); // enable the Accept button on the popup dialog. 
   }
}

ConfigMgr.prototype.checkFile = function(){
   var aFile = $('#fileInput').first()[0].files[0];
   if( aFile) {
      configMgr.fileReady = true;
      configMgr.checkTeams();
   }  
   if(configMgr.fileReady && configMgr.teamsReady) {
    $('.close').disable(false); // enable the Accept button on the popup dialog. 
   } 
}
//function to select or deselect the link. When it is selected, the popup dialog is raised to visibility.
ConfigMgr.prototype.openDialog = function(){
   console.log('Config Link was clicked, opening popup dialog.');
   $('#panel').focus();
    if($(this).hasClass('selected')) {
      deselect($(this));
    } else {
      $(this).addClass('selected');
      $('.pop').slideFadeToggle();
      $('.pop').focus();
      dialog='open';
    }
    return false;
  }
ConfigMgr.prototype.closeDialog = function(){
   console.log('Accept button pressed. Closing the popup dialog.');
       dialog='closed';
       deselect($('#doConfig'));
       configMgr.configure( 
                    Number( $('#teamLeft').val())  
                 ,  Number( $('#teamRight').val()) 
                 , Number( $('#gameSize').val()  ) 
                 , Number( $('#timerDur').val()  ) 
                 , $('#fileInput').first()[0].files[0]
                 );
        return false;
  }

//Function configure uses values from config popup to select images, create dropdowns, initialize clock, label Track Rows. prepare & randomize questions.

ConfigMgr.prototype.configure = function(lt, rt, gs, qd, file){
  console.log('Configuring Game with: ' + lt + ', ' + rt + ', ' + gs + ', ' + qd + ', ' + file);
  configMgr.insertScoreBars(lt,rt); 
  configMgr.insertGoalBars(lt,rt);
  configMgr.determineArrows(lt,rt);
  configMgr.addTrackLabels(lt,rt);
  configMgr.buildTeamDropdown(lt,rt);
  configMgr.updateClock(gs);
  configMgr.readFile(file)
 }

ConfigMgr.prototype.buildObjects = function(){
  var cfg = configMgr.getConfig();
  configMgr.ball        = new Ball(cfg);                 //Also instantiates the possessionMgr as a member of Ball.
  configMgr.questionMgr = new QuestionMgr(cfg);          //Also instantiates the QuestionTimer as a member of QuestionMgr. 
  configMgr.trackMgr    = new TrackMgr(cfg, configMgr.ball);
}

ConfigMgr.prototype.addTrackLabels = function(lt,rt){
  var leftTd ='<td id="leftTeamName"  class= "trackName" >' + countries[lt] + '</td>';
  var rightTd='<td id="rightTeamName" class= "trackName" >' + countries[rt] +'</td>';
  $('#leftTeamq').html(leftTd);
  $('#rightTeamq').html(rightTd);
}
 
ConfigMgr.prototype.determineArrows = function(lt,rt){
  $('#leftArrowDiv').html(leftArrows[lt]);
  $('#rightArrowDiv').html(rightArrows[rt]);
}

ConfigMgr.prototype.insertGoalBars = function(lt,rt){
  $('#leftGoalBarDiv').html(goalBars[lt]);
  $('#rightGoalBarDiv').html(goalBars[rt]);
}

ConfigMgr.prototype.insertScoreBars = function(lt,rt){
 var leftHtml  = scoreBars[lt] + '<input type="text" id="leftScore" tabindex= "-1"  class="scoreInput" readonly="true" value="0">';
 var rightHtml = scoreBars[rt] + '<input type="text" id="rightScore"  tabindex= "-1"  class="scoreInput" readonly="true" value="0">';
 $('#scoreBarLeftDiv').html(leftHtml);
 $('#scoreBarRightDiv').html(rightHtml);
}

ConfigMgr.prototype.buildTeamDropdown = function(lt,rt){
  //select element to select teams for questionMgr and trackMgr.
  var leftOption  = '<option value=' + lt + '>' + countries[lt] + '</option>';
  var rightOption = '<option value=' + rt + '>' + countries[rt] + '</option>';
  $('#team').html(leftOption + rightOption);
}

ConfigMgr.prototype.readFile  = function(file){
   // Test to see if file is legitimate
   if(!file ||  file.size < 1){
      console.log('Entered readFile() but fileName was undefined or was empty.');
      return;
    }

   console.log('Function readFile is reading file: '+ JSON.stringify(file) );
    var reader = new FileReader();
    var rawQuestions;

    // Handler for when the loading ends, which parses the input into JSON and randomizes the questionSet. Using onloadend, requires checking the readyState.
    reader.onloadend = function(evt) {
         if(evt.target.readyState == FileReader.DONE) {
              configMgr.rawQuestions = JSON.parse(event.target.result); 
              configMgr.randomizeQuestions();
      }
 }
      reader.readAsText(file, 'UTF-8');
}

// The function randomizeQuestions will reorder the questions and load them into the questionSet map, key=item.count, value= item (JSON object containing fields).       

ConfigMgr.prototype.randomizeQuestions = function(){
console.log('Entered randomizeQuestions with rawQuestionSet of size: ' + configMgr.rawQuestions.length);
var counter = 0;
while(configMgr.rawQuestions.length > 0){  
   randomIndex = Math.floor((Math.random() * configMgr.rawQuestions.length) ); //will be in range:  0 < randomIndex < rawQuestionSet.length  , which is diminishing in length.
   var item= configMgr.rawQuestions.splice(randomIndex,1); //removes and returns the element at index.
   item.count=counter++;
   configMgr.questionSet.set( item.count, item );
   }
   configMgr.buildObjects();
// Now that all of the objects exists, prepare to handle events in the app.
   configMgr.defineHandlers();
}


ConfigMgr.prototype.updateClock = function( cnt){
   this.clock.val(cnt);
}

ConfigMgr.prototype.getConfig = function( ){
  return {
                teams: [Number($('#teamLeft').val()), Number($('#teamRight').val())]
              , gameSize: Number( $('#gameSize').val() )
              , timerDuration : Number($("#timerDur").val())
              , ballDirection : this.coinflip()
              , ballLocation : 2  //midfield
              , questionSet: this.questionSet 
              , created: new Date().toString().slice(-45).substring(3,24) , 
         }
}

ConfigMgr.prototype.coinflip = function () {
 var result=0;
 while (result == 0){ 
   result = Math.floor((Math.random() * 3)-1 ); //will be one of:{-1,0,1} if zero, tries again.Hence, one of: { -1 or +1} emerges for starting direction
 }
 return result;
}
//Facade to expose functions from lower objects to the topLevel

ConfigMgr.prototype.nextQuestion = function () {
   return this.questionMgr.nextQuestion();
}

ConfigMgr.prototype.displayNextItem = function () {
   configMgr.questionMgr.displayItem(questionMgr.nextQuestion());
}

ConfigMgr.prototype.clearQuestionTimer = function () {
   configMgr.questionMgr.timer.stop = true;
}
/*  -----
    $('#quest').on(       'click',    this.questionMgr.displayItem(this.questionMgr.nextQuestion()) );
 72     $('#stopTimer').on(   'click',    this.questionMgr.clearTimer30);
 73     $('#showResponse').on('click',    this.questionMgr.revealAnswer);
 74     $('#saveGrade').on(   'click',    this.trackMgr.saveGrade);
------ */

// various data arrays to be used in configuration
  var leftArrows= [
                   '<img id="leftArrow" src="../public/images/ArrowLeftA.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftB.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftC.png">'
                 , '<img id="leftArrow" src="../public/images/ArrowLeftM.png">'
                  ];
  var rightArrows= [
                    '<img id="rightArrow" src="../public/images/ArrowRightA.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightB.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightC.png">'
                  , '<img id="rightArrow" src="../public/images/ArrowRightM.png">'
                   ];
  var countries = ["Argentina", "Brasil", "Chile", "Mexico"];
  var scoreBars =[
                  '<img class="scoreBar" src="../public/images/ArgentinaScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/BrasilScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/ChileScoreBar.png">'
                 , '<img class="scoreBar" src="../public/images/MexicoScoreBar.png">'
                 ];
 var goalBars =[
                 '<img class="goalBar" src="../public/images/ArgentinaScoreBar.png">'
               , '<img class="goalBar" src="../public/images/BrasilScoreBar.png">'
               , '<img class="goalBar" src="../public/images/ChileScoreBar.png">'
               , '<img class="goalBar" src="../public/images/MexicoScoreBar.png">'
               ];

