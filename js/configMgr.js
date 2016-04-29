/* ---Requirements for ConfigMgr ---------------

This class is responsible for: 
1  Creating the PopupMgr object which will gather game configuration and return it when popupMgr.getConfig() is called..
1. Defining all handlers for the app:
2. Reading the values received from the Configuration popup: TeamLeft, TeamRight, GameSize, File for questions.
3. Setting the starting value of the game clock.
4. Using the values from the config popup to select and set images for: ScoreBars, GoalBars, Arrows, Track Labels.
5. Instantiating the following Objects with values from Config popup: Ball( with possessionMgr), QuestionMgr(with QTimer), TrackMgr .  
--------Requirements-----------  */

//----- constructor ---------------
 var ConfigMgr = function() {
   configMgr = this;                              //set in global scope so it can be used inside event handlers where "this" refers to a different object.
   this.popupMgr           = new PopupMgr();      // will handle the doConfig popup and gather the game configuration.
// following values are set with the config popup results. 
   this.count              = -1;                  // integer 1 < count < gameSize   determined from popup.gameSizeInput     results;
   this.clock              = $('#falta');         // readOnly text input to display count ( how many questions are left).
   // Then folloing objects will be instantiated with the config data, gained from config popup. 
   this.questionMgr        = null;                //instantiated in the configure method .
   this.trackMgr           = null;                //instantiated in the configure method .
   // Object name plus last 4 chars give milliseconds, enough for id.This helps if threads are confusing which objects are acting and in which order.
   this.created            = 'ConfigMgr' + new Date().getTime().toString().slice(-4); 
   return this;
}

 var configMgr; //creates a global variable for the configMgr to be used inside of handler functions where "this" means something else.


ConfigMgr.prototype.defineHandlers = function(){
  // no handlers in ConfigMgr. All foreign handlers were moved to the class where the handler lives.
}

//Function configure uses values from config popup to select images ( arrows,scorebars,goalbars), create dropdowns, initialize clock, label Track Rows. 
ConfigMgr.prototype.configure = function(config){
  var lt = config.teams[0];                 // integer, one of: {0,1,2,3}
  var rt = config.teams[1];                 // integer, one of: {0,1,2,3}
  configMgr.insertScoreBars(lt,rt); 
  configMgr.insertGoalBars(lt,rt);
  configMgr.determineArrows(lt,rt);
  configMgr.addTrackLabels(lt,rt);
  configMgr.buildTeamDropdown(lt,rt);
  configMgr.updateClock(config.gameSize);
  configMgr.buildObjects();
  configMgr.defineHandlers();
 }

ConfigMgr.prototype.buildObjects = function(){
  var cfg = popupMgr.getConfig();
  configMgr.questionMgr = new QuestionMgr(cfg);          //Also instantiates the QuestionTimer as a member of QuestionMgr. 
  configMgr.trackMgr    = new TrackMgr(cfg);             // Also instantiates contained objects: trackMgr.ball.possessionMgr
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

ConfigMgr.prototype.updateClock = function( cnt){
   this.clock.val(cnt);
}

//Facade to expose functions from lower objects to the topLevel

ConfigMgr.prototype.nextQuestion = function () {
   return this.questionMgr.nextQuestion();
}


// various global data arrays to be used in configuration
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
