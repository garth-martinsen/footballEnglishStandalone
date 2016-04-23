QUnit.module( "module PopupMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append('<input type="file" id="fileInput" name="file">questionMgr.js</input>');
    fixture.append('<div id="panel" class="messagepop pop">');
    fixture.append('Left: <select id="teamLeft" focus> <option value=0>Argentina</option> <option value=1>Brasil</option> <option value=2>Chile</option> <option value=3>Mexico</option> </select>');
    fixture.append('Right:<select id="teamRight"> <option value=0>Argentina</option> <option value=1>Brasil</option> <option value=2>Chile</option> <option value=3>Mexico</option> </select>');
    fixture.append('GameSize:<input type="text" id="gameSize" value=100 ></input>');
    fixture.append('TimerDuration:<input type="text" id="timerDur" tabindex = "106" value=30 ></input> ');
    fixture.append('<input type="text" id="errors" tabindex = "-1" readonly ></input>');

//  elements that have handlers attached: 
    fixture.append('<a href="/doConfig" id="doConfig">Configure</a>');
    fixture.append('<input type="submit" id="closeDialog" class="close" value="Accept"></input>');

   this.popupMgr = new PopupMgr( );
  },
  afterEach: function() {
    this.popupMgr = null;
  }
});


  QUnit.test("PopupMgr.openConfigDialog() ", function( assert )   {  
 
    $('#doConfig').trigger("click");
    
     assert.equal( this.popupMgr.dialog, 'open',                  "The openDialog function was called. Dialog is open ");

});

  QUnit.test("PopupMgr.closeConfigDialog() ", function( assert ) {
    $('#teamLeft').val(2);
    $('#teamright').val(3);
    $('#gameSize').val(95);

    $('#closeDialog').trigger("click");

   assert.equal(this.popupMgr.dialog, 'closed',                 "The closeDialog function was called the dialog is closed.");

  // need to test the value of the files element but do not know how in a test harness. maybe a console log is the best I can do in the real time execution.
});


  QUnit.test("PopupMgr.coinflip ", function( assert ) {
  
  var dir = this.popupMgr.coinflip();

  assert.ok( (dir == -1 || dir == 1),           "The ballDirection The ballDirection must be one of {-1,1}");
});


/* ------------REFERENCE: popupMgr functions and constructor  X means test exists -----
PopupMgr.prototype.initialize = function(){
X  PopupMgr.prototype.openDialog = function(){
X  PopupMgr.prototype.closeDialog = function(){
PopupMgr.prototype.readyToClose = function(){
PopupMgr.prototype.checkTeams = function(){
PopupMgr.prototype.checkFile = function(){
PopupMgr.prototype.readSizes = function(){
X  PopupMgr.prototype.coinflip = function () {
PopupMgr.prototype.getConfig = function(){
PopupMgr.prototype.readFile  = function(file){
PopupMgr.prototype.randomizeQuestions = function(){

//----- constructor ---------------
 var PopupMgr = function() {
   popupMgr                = this;  //set the object in global scope 
   this.configLink         = $('#doConfig');      // raises the popup which has ways to select teams and questionSet, enter gameSize.
   this.dialog             = '';                  // Indicator for tests, it is set to "open" when open and "closed" when closed.
   this.errors             = $('#errors');        // readonly textinput for popup dialog errors.(teams must differ; set file doesn't support gameSize; Needs file, etc....)
   this.fileName           = null;                // A string, set after selection a file in the popup dialog.
   this.fileSizes          = new Map;             // map of set names and their sizes, key=fileName, value= count of items). Used to validate that questionSet supports gamesize.
   this.questionSet        = new Map              // map of question items in randomized order. Key= count, Value: JSON object.; Where count ~ 130 .
   this.initialize();                             // Initialize validation parms and set up handlers for opening, validation, closing of the dialog.
   return this;
}


------ */
