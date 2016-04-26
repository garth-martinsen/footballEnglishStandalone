/* ---Requirements---------------
This class is responsible for:
1. Defining handlers for the config popup:
         Handling the click of the Config Link to open the config popup dialog
         Handling the click of the Choose File Button for FileSizes file in the config popup dialog.
         Handling the click of the Choose File Button for the questionSet file in the chnfig popup dialog.
         Handling the click of the Accept Button to close the config popup dialog.
2. Validating the configuration values before allowing the dialog to close.
3. Reading in the file with file sizes for questionSets.
4. Reading in the file with a QuestionSet.
5. Randomizing the order of the questions in the questionSet.
6. Returning a config object in response to getConfig() which returns : {teams:IntArray[2], gameSize:Int, timerDuration:Int, ballDirection:Int, questionSet:Map }
7. Instantiating the following Objects with values from Config popup: Ball( with possessionMgr), QuestionMgr(with QTimer), TrackMgr .

--------End Requirements---- */


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

 var popupMgr; //creates a global variable for the popupMgr to be used inside of handler functions where "this" means something else.
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

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});


// Initialize validation parms and set up handlers for opening, validation, closing of the dialog.
PopupMgr.prototype.initialize = function(){
   // event handlers so that popup dialog can be opened and shut.
   this.readyTeams                       = false;
   this.readyFile                        = false;
   this.readyGameSize                    = false;
   $('#doConfig').on(       'click',      popupMgr.openDialog);
   $('#teamLeft').on(       'change',     popupMgr.checkTeams);
   $('#teamRight').on(      'change',     popupMgr.checkTeams);
   $('#fileInput').on(      'change',     popupMgr.checkFile);
   $('#fileSizeInput').on(  'change',     popupMgr.readSizes);
   $('#closeDialog').on(    'click',      popupMgr.closeDialog);
}

//function to select or deselect the link. When it is selected, the popup dialog is raised to visibility.
PopupMgr.prototype.openDialog = function(){
   console.log('Config Link was clicked, opening popup dialog.');
   $('#panel').focus();
    if($(this).hasClass('selected')) {
      deselect($(this));
    } else {
      $(this).addClass('selected');
      $('.pop').slideFadeToggle();
      $('.pop').focus();
      popupMgr.dialog='open';
      $('#closeDialog').disable (true);  // diabled until the file and the teams are ready.One cannot close the popup dialog without putting in the values needed.
      popupMgr.readyToClose();
    }
    return false;
  }

PopupMgr.prototype.closeDialog = function(){
   console.log('Accept button pressed. Closing the popup dialog.');
       popupMgr.dialog='closed';
       deselect($('#doConfig'));
       popupMgr.readFile($('#fileInput').first()[0].files[0]);
       return false;
  }

// function readyToClose()  stops showing errors in the popup errors field, the Accept button will be enabled, allowing us to close the dialog. */
PopupMgr.prototype.readyToClose = function(){
   var errs = "";
   $('#errors').val(errs);
   if( !popupMgr.fileName ){errs += " Need File. "; }
   if( popupMgr.fileSizes.size < 1 ){errs += " Need File sizes. "; }
   if( !popupMgr.readyTeams ){ errs += " Need different teams. ";  }
   if(errs.length > 0 ) {
      this.errors.val(errs);
      return;
   } else {   //We have all the information needed to check the gameSize against the number of items in the selected file.
      var gameSize = Number( $('#gameSize').val() );
      var count = popupMgr.fileSizes.get(popupMgr.fileName);
      if( gameSize > count ){
         popupMgr.readyGameSize = false;
         errs +='the gameSize of: ' + gameSize + '  will not be supported by file: ' + popupMgr.fileName + ' which holds only : ' + count + ' items.';
         this.errors.val(errs);
         return;
      } else {
         popupMgr.readyGameSize=true;
         $('#closeDialog').disable(false); //enables the Accept button to close the dialog.
      }
   }
}

PopupMgr.prototype.checkTeams = function(){
   var leftTeam = Number( $('#teamLeft').val());
   var rightTeam= Number( $('#teamRight').val());
   if( leftTeam != rightTeam) {
      popupMgr.readyTeams = true;
   } else {
      popupMgr.readyTeams= false;
   }
   popupMgr.readyToClose();
}

PopupMgr.prototype.checkFile = function(){
   var aFile = $('#fileInput').first()[0].files[0];
   if( aFile) {
      popupMgr.fileName = aFile.name;
      popupMgr.readyFile = true;
   }
   popupMgr.readyToClose();
}

PopupMgr.prototype.readSizes = function(){
  var fileSizesFile =$('#fileSizeInput').first()[0].files[0];
  var reader = new FileReader();
  var kva;
  reader.onloadend = function(evt) {
         if(evt.target.readyState == FileReader.DONE) {
              var strArray = event.target.result.split(" ");
              for(var i =0; i< strArray.length;i++){
                 kva = strArray[i].split(":");
                 popupMgr.fileSizes.set(kva[0],Number(kva[1]));
              }
              popupMgr.readyToClose();
         }
  }
   reader.readAsText(fileSizesFile, 'UTF-8');
}

PopupMgr.prototype.coinflip = function () {
 var result=0;
 while (result == 0){
   result = Math.floor((Math.random() * 3)-1 ); //will be one of:{-1,0,1} if zero, tries again.Hence, one of: { -1 or +1} emerges for starting direction
 }
 return result;
}


PopupMgr.prototype.getConfig = function(){
 return {
                teams: [Number($('#teamLeft').val()), Number($('#teamRight').val())]
              , gameSize: Number( $('#gameSize').val() )
              , timerDuration : Number($("#timerDur").val())
              , ballDirection : this.coinflip()
              , ballLocation : 2  //midfield
              , questionSet: this.questionSet
              , created: new Date().toString().slice(-45).substring(3,24)  
         }

}

PopupMgr.prototype.readFile  = function(file){
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
              popupMgr.rawQuestions = JSON.parse(event.target.result);
              popupMgr.randomizeQuestions();
              console.log('Questions are all randomized');
              $('#game').trigger("game:configured");          // triggers the event that will signal the game that it may request questions and start play.
      }
 }
      reader.readAsText(file, 'UTF-8');
}

// The function randomizeQuestions will reorder the questions and load them into the questionSet map, key=item.count, value= item (JSON object containing fields).

PopupMgr.prototype.randomizeQuestions = function(){
   console.log('Entered randomizeQuestions with rawQuestionSet of size: ' + popupMgr.rawQuestions.length);
   var counter = 0;
   while(popupMgr.rawQuestions.length > 0){
      randomIndex = Math.floor((Math.random() * popupMgr.rawQuestions.length) ); //will be in range:  0 < randomIndex < rawQuestionSet.length  , which is diminishing in length.
      var item= popupMgr.rawQuestions.splice(randomIndex,1); //removes and returns the element at index.
      item.count=counter++;
      popupMgr.questionSet.set( item.count, item );
   }
}

