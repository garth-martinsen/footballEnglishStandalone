QUnit.module( "module ConfigMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<table   id="track" border="1px"> <tr id="leftTeamq"></tr> <tr id="rightTeamq"></tr> </table> ');
    fixture.append('<select id="team" > </select>');
    fixture.append('<input type="text" id="falta" value ="100" width="50px" readonly >');
    fixture.append('<input type="file" id="fileInput" name="file">questionMgr.js</input>');
    fixture.append('<div id="leftArrowDiv""> </div>');
    fixture.append('<div id="rightArrowDiv"> </div>');
    fixture.append('<div id="scoreBarLeftDiv"> </div>');
    fixture.append('<div id="scoreBarRightDiv"> </div>');
    fixture.append('<div id="leftGoalBarDiv"> </div>');
    fixture.append('<div id="rightGoalBarDiv"> </div>');
    fixture.append('<div id="panel" class="messagepop pop">');
    fixture.append('Left: <select id="teamLeft" focus> <option value=0>Argentina</option> <option value=1>Brasil</option> <option value=2>Chile</option> <option value=3>Mexico</option> </select>');
    fixture.append('Right:<select id="teamRight"> <option value=0>Argentina</option> <option value=1>Brasil</option> <option value=2>Chile</option> <option value=3>Mexico</option> </select>');
    fixture.append('GameSize:<input type="text" id="gameSize" value=100 ></input>');
    fixture.append('<input type="text" id="errors" tabindex = "-1" readonly ></input>');

//  elements that have handlers attached: 
    fixture.append('<a href="/doConfig" id="doConfig">Configure</a>');
    fixture.append('<input type="submit" id="closeDialog" class="close" value="Accept"></input>');
   this.configMgr = new ConfigMgr( );
  },
  afterEach: function() {
    this.configMgr = null;
  }
});

  QUnit.test("ConfigMgr.construct", function( assert ) {
     assert.ok(this.configMgr,                             "ConfigMgr  Exists");
     assert.ok($('#leftTeamq'),                            "Left Track table row exists and is accessible.");
     assert.ok($('#rightTeamq'),                           "Right Track table row exists and is accessible.");
     assert.ok($('#team'),                                 "Dropdown team select exists and is accessible.");
     assert.ok(this.configMgr.clock,                       "The clock display exists and is accessible.");
     assert.ok($('#teamLeft'),                             "The popup.leftTeamDropDown, exists and can be accessed.");
     assert.ok($('#teamRight'),                            "The  popup.rightTeamDropDown, exists and can be accessed.");
     assert.ok($('#gameSize'),                             "The popup.gameSize input exists and can be accessed.");
});

  QUnit.test("ConfigMgr.configure() ", function( assert ) {
    var determineArrowsStub       = sinon.stub(this.configMgr,   "determineArrows"   );
    var addTrackLabelsStub        = sinon.stub(this.configMgr,   "addTrackLabels"    );
    var insertGoalBarsStub        = sinon.stub(this.configMgr,   "insertGoalBars"    );
    var insertScoreBarsStub       = sinon.stub(this.configMgr,   "insertScoreBars"   );
    var buildTeamDropdownStub     = sinon.stub(this.configMgr,   "buildTeamDropdown" );
    var updateClockStub           = sinon.stub(this.configMgr,   "updateClock"       );
    var config = {teams: [2,3], gameSize: 98 }

     this.configMgr.configure(config);    //should call the configure function and all of its sub calls as Stubs. 


     assert.ok(determineArrowsStub.withArgs(2,3).calledOnce,      "Calling configure(...) should call function determineArrows."  );
     assert.ok(addTrackLabelsStub.withArgs(2,3).calledOnce,       "Calling configure(...) should call function addTrackLabels."   );
     assert.ok(insertGoalBarsStub.withArgs(2,3).calledOnce,       "Calling configure(...) should call function insertGoalBars."   );
     assert.ok(insertScoreBarsStub.withArgs(2,3).calledOnce,      "Calling configure(...) should call function insertScoreBars."  );
     assert.ok(buildTeamDropdownStub.withArgs(2,3).calledOnce,    "Calling configure(...) should call function buildTeamDropdown.");
     assert.ok(updateClockStub.withArgs(98).calledOnce,           "Calling configure(...) should call function updateClock."      );
});



  QUnit.test("ConfigMgr.buildObjects() ", function( assert ) {

    var config = {teams:[2,3], gameSize: 98};   

    this.configMgr.buildObjects(config);
    
    assert.ok(this.configMgr.trackMgr,                             "TrackMgr exists and is accessible by configMgr.");
    assert.ok(this.configMgr.questionMgr,                          "QuestionMgr exists and is accessible by configMgr.");
    assert.ok(this.configMgr.trackMgr.ball,                        "Ball object exists and is accessible by trackMgr.");
    assert.ok(this.configMgr.trackMgr.ball.possessionMgr,          "PossessionMgr exists and is accessible by ball");
    assert.ok(this.configMgr.questionMgr.timer,                    "QuestionTimer exists within QuestionMgr and is accessible by QuestionMgr.");
  });

  QUnit.test("ConfigMgr.determineArrows ", function( assert ) {
    
    this.configMgr.determineArrows(2,3);

    assert.ok($('#leftArrow'),                                'The left arrow should not be Null.');
    assert.ok($('#rightArrow'),                               'The right arrow should not be Null.');
    assert.ok(sameSrc( $('#leftArrowDiv').html(),  leftArrows[2]),   'The left arrow should be for Chile: '  + leftArrows[2]);
    assert.ok(sameSrc( $('#rightArrowDiv').html(), rightArrows[3]),  'The right  arrow should be for Mexico: ' + rightArrows[3]);
  });

var sameSrc = function(str1,str2){
  var a1 = str1.toString().split("\"");
  var a2 = str2.toString().split("\"");
  console.log('a1:' + a1[3]);
 console.log ('a2:' + a2[3]);
return a1[3] == a2[3]
}
  QUnit.test("ConfigMgr.insertGoalBars ", function( assert ) {

    this.configMgr.insertGoalBars(2,3);

    assert.ok($('#leftGoalBarDiv').html(),      "The left goalBar should not be Null.");
    assert.ok($('#rightGoalBarDiv').html(),     "The right goalBar should not be Null.");
    assert.ok(sameSrc($('#leftGoalBarDiv').html(),    goalBars[2]),     "The left goalBar image should be: "+ goalBars[2]);
    assert.ok(sameSrc($('#rightGoalBarDiv').html(),   goalBars[3]),     "The right goalBar image should be: " + goalBars[3]);
});

  QUnit.test("ConfigMgr.insertScoreBars ", function( assert ) {

    this.configMgr.insertScoreBars(2,3);

    assert.ok($('#scoreBarLeftDiv').html(),      "The left scoreBar should not be Null.");
    assert.ok($('#scoreBarRightDiv').html(),     "The right scoreBar should not be Null.");
    assert.ok($('#leftScore'),                   "The left scoreBox should exist and be accessible.");
    assert.ok($('#rightScore'),                   "The right scoreBox should exist and be accessible.");
});

  QUnit.test("ConfigMgr.buildTeamDropdown ", function( assert ) {

    this.configMgr.buildTeamDropdown(2,3);

    assert.ok($('#team'),                             "The team dropdown should not be null.");
    assert.equal($('#team')[0].options[0].value , 2,     "The left team should be : " + countries[2]);
    assert.equal($('#team')[0].options[1].value , 3,     "The right team should be: " + countries[3]);
});

  QUnit.test("ConfigMgr.addTrackLabels ", function( assert ) {

    this.configMgr.addTrackLabels(2,3);

    assert.ok($('#leftTeamq'),      "The left team tracking row should not be null.");
    assert.ok($('#rightTeamq'),      "The right team tracking row should not be null.");
    assert.equal($('#leftTeamName').first().text() , countries[2],     "The left team track should be labeled : " + countries[2]);
    assert.equal($('#rightTeamName').first().text(), countries[3],     "The right team track should be labeled : " + countries[3]);
});


  QUnit.test("ConfigMgr.updateClock ", function( assert ) {
     
    this.configMgr.updateClock(2);

     assert.equal(this.configMgr.clock.val(),  "2" ,                    "the Clock was updated to 2 questions left.");
});

/* ------------REFERENCE: configMgr functions and constructor  -----
X ConfigMgr.prototype.defineHandlers = function(){
X ConfigMgr.prototype.configure = function(lt,rt,gs){
X ConfigMgr.prototype.buildObjects = function(){
X ConfigMgr.prototype.addTrackLabels = function(lt,rt)
X ConfigMgr.prototype.determineArrows = function(lt,rt)
X ConfigMgr.prototype.insertGoalBars = function(lt,rt)
X ConfigMgr.prototype.insertScoreBars = function(lt,rt)
X ConfigMgr.prototype.buildTeamDropdown = function(lt,rt)
X ConfigMgr.prototype.updateClock = function( cnt)


 //----- constructor ---------------
 var ConfigMgr = function() {

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
   // two event handlers so that config dialog can be opened and shut.
   $('#doConfig').on(    'click',    this.openDialog);
   $('.close').on(       'click',    this.closeDialog);
   configMgr=this;  //set the object in global scope so I can assess it inside of event handlers where "this" points to a different object.
   return this;
}

------ */
