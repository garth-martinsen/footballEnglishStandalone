QUnit.module( "module PossessionMgr", {
  beforeEach: function() {
    var fixture = $("#qunit-fixture");
    fixture.append( '<div id="leftArrowDiv"><img  id="leftArrow"  src="../public/images/ArrowLeftA.png"  style="position:relative"> </div>');
    fixture.append( '<div id="rightArrowDiv"><img id="rightArrow" src="../public/images/ArrowRightB.png" style="position:relative" > </div>');
    fixture.append( '<table id="track" border="1px"> <tr id="leftTeamq"><td id="leftTeamName"  class= "trackName" >Chile</td> </tr> <tr id="rightTeamq"> <td id="rightTeamName" class= "trackName" >Mexico</td></tr> </table> ');
    fixture.append( '<select id="team" > <option value="0" >Chile</option> <option value="1" >Mexico</option> </select>');
    fixture.append( '<img id="leftArrow" src="../public/images/ArrowLeftA.png" style="position:relative">' );
    fixture.append( '<img id="rightArrow" src="../public/images/ArrowRightB.png" style="position:relative" >');
    var al=$('#leftArrow');
    var ar=$('#rightArrow');
    var ltn = $('#leftTeamName'); 
    var rtn = $('#rightTeamName');
    var tms = $('#team'); 
    var tmArray = [2,3];
    this.possessionMgr = new PossessionMgr( al, ar, ltn, rtn, tms, tmArray);
  },
  afterEach: function() {
    this.possessionMgr = null;
  },
    setUp: function () {
        sinon.spy(PossessionMgr, "displayArrow");
    },

    tearDown: function () {
        PossessionMgr.displayArrow.restore(); // Unwraps the spy
    }

});
  
QUnit.test("possessionMgr.construct", function( assert ) {
     assert.ok( this.possessionMgr.arrowLeft, "Left Arrow is defined.");
     assert.ok( this.possessionMgr.arrowRight, "Right Arrow is defined.");
     assert.ok(this.possessionMgr.teamSelect, "Team DropDown is available for getting/setting  the selected team.");
     assert.ok(this.possessionMgr.leftTeamName, "TD for left TeamName  exists.");
     assert.ok(this.possessionMgr.rightTeamName, "TD for right TeamName exists.");
     assert.ok(this.possessionMgr.teams, "Team array exists.");
});

  QUnit.test("possessionMgr.displayArrow left", function( assert ) {
    console.log("test: possessionMgr.displayArrow left");
    var z1=z2   = 0; 

    this.possessionMgr.displayArrow(-1);              

    z1 = this.possessionMgr.arrowLeft.css('z-index');
    z2 = this.possessionMgr.arrowRight.css('z-index');
    //console.log('z1 : ' + z1 + ' z2 : ' + z2);
    assert.ok( z1 > z2 , 'z-index of left arrow should be larger than that of the  right arrow');
  });

  QUnit.test("possessionMgr.displayArrow right", function( assert ) {
    console.log("test: possessionMgr.displayArrow right");
    var z1=z2   = 0; 

    this.possessionMgr.displayArrow(1);              

    z1 = this.possessionMgr.arrowLeft.css('z-index');
    z2 = this.possessionMgr.arrowRight.css('z-index');
    //console.log('z1 : ' + z1 + ' z2 : ' + z2);
    assert.ok( z2 > z1 , 'z-index of right arrow should be larger than that of the left arrow');
  });

  QUnit.test("possessionMgr.highLightPossessor left", function( assert ) {
    console.log("test: possessionMgr.highLightPossessor left");
    this.possessionMgr.highlightPossessor(-1);              

    assert.ok(  this.possessionMgr.leftTeamName.hasClass('possessing'), "Left Team Name TD should have class possessing." ); 
    assert.ok(! this.possessionMgr.rightTeamName.hasClass('possessing'), "Right Team Name TD should NOT have class possessing." ); 
  });

  QUnit.test("possessionMgr.highLightPossessor right", function( assert ) {
    console.log("test: possessionMgr.highLightPossessor right");
    this.possessionMgr.highlightPossessor(1);              

    assert.ok(! this.possessionMgr.leftTeamName.hasClass('possessing'), "Left Team Name TD should NOT have class possessing." ); 
    assert.ok(  this.possessionMgr.rightTeamName.hasClass('possessing'), "Right Team Name TD should have class possessing." ); 
  });
   QUnit.test("possessionMgr.selectPossessor left", function( assert ) {
      console.log("test: possessionMgr.selectPossessor left");
      this.possessionMgr.selectPossessor(-1);            
      assert.equal(this.possessionMgr.teamSelect.val(), 0,  "Left Team should be selected in teams dropdown." );
    });

   QUnit.test("possessionMgr.selectPossessor right", function( assert ) {
      console.log("test: possessionMgr.selectPossessor right");
      this.possessionMgr.selectPossessor(1);            
      assert.equal(this.possessionMgr.teamSelect.val(), 1,  "Right Team should be selected in teams dropdown." );
   });
     
  QUnit.test("possessionMgr.changePossession", function( assert ) {
      console.log("test: possessionMgr.changePossession");
    var fixture = $("#qunit-fixture");
    fixture.append('<img  id="ball" src="../public/images/ball.png">');
    var ballImg = $('#ball');
    var ball = new Ball(2,1,ballImg,null, null, null); //ballDirection is to right.(1).
    this.possessionMgr.displayArrow = sinon.spy();
/*  ------ Need to understand how to use sinon.spy ----
    this.possessionMgr.hightlightPossessor = sinon.spy();
     var spy1 = sinon.spy(this.possessionMgr.displayArrow ); // PossessionMgr.displayArrow
     var spy2 = sinon.spy(this.possessionMgr.highlightPossessor ); 
     var spy3 = sinon.spy(this.possessionMgr.selectPossessor ); 
//    console.log('Ball direction at creation : ' + ball.ballDirection);
-------  */
    ball = this.possessionMgr.changePossession(ball); //method under test.   

 //   console.log('Ball direction after changePossession: ' + ball.ballDirection);
    assert.equal(ball.ballDirection, -1,  "Ball direction should change to -1.");          
    assert.ok(this.possessionMgr.displayArrow.calledOnce , "displayArrow must be called once from changePossession");
/*  ------ Need to understand how to use sinon.spy ----
    assert.ok(this.possessionMgr.highlightPossessor.calledOnce , "highlightPossessor must be called once from changePossession");
    assert.ok(spy1.calledOnce , "displayArrow must be called once from changePossession");
    assert.ok(spy2.calledOnce , "hightlightPossessor must be called once from changePossession");
    assert.ok(spy3.calledOnce , "selectPossessor must be called once from changePossession");
--- */
 });
/* ----tests by grep -----
test PossessionMgr.displayArrow(ballDirection){
test PossessionMgr.highlightPossessor(ballDirection){
test PossessionMgr.selectPossessor(ballDirection){
test PossessionMgr.changePossession(ballDirection){
----- */




