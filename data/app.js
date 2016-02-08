  var MongoClient = require('mongodb')// MongoClient is a Driver for connecting to MongoDB
  , fs=require('fs')
  , util=require('util')
  , csv = require("fast-csv");
 
var portstream = fs.createReadStream("port_questions_port.csv" );
var spanstream = fs.createReadStream("sp_questions_sp.csv");
var englishstream = fs.createReadStream("en_questions_en.csv");
var portquestions=new Map();
var spanquestions=new Map();
var englishquestions=new Map(); 
var count=0;
 MongoClient.connect('mongodb://localhost:27017/football', function(err, db) {
     "use strict";
   if(err) throw err;

readTheFile(portstream, "Portuguese", portquestions);
readTheFile(spanstream, "Spanish", spanquestions);
readTheFile(englishstream, "English", englishquestions);

function readTheFile(stream, lang, questions){
       console.log("reading: " + lang);
      csv
        .fromStream(stream, {headers : true} )
        .on("data", function(data){
           console.log(lang + ' ' + data._id + ' ' + data.q);
           questions.set(data._id, data.q);
     })
     .on("end", function(){
         var mapIter = questions.entries();
         console.log("Entries: " + questions.size ); 
         console.log(mapIter.next().value); // ["0", "foo"]
         console.log("done: " + lang);
        count++;
        if(count>2) {outputResult();}
     });
}
 function outputResult(){
          var questions = db.collection('questions');
          var qo, qs, qp, qe;
          var keys = spanquestions.keys();
          var key;
          console.log("Keys:");
//          logIterator(keys);
          for(key of keys){
           console.log("keyXYZ: " + key);
           qo = questions.find({_id: key});
           qp = portquestions.get(key); 
           qs = spanquestions.get(key);
           qe = englishquestions.get(key);
           console.log('original: ' + qo);
           console.log('portuguese: ' + qp);
           console.log('spanish: ' + qs);
           console.log('english: ' + qe);
//           questions.update({_id: key},$set{qp:qp, qs:qs, qe:qe});

/* ---------------------
           questions.find({_id: key}, function(err, doc){
             if(err){console.log("Error: " + err);}
             console.log(doc) + " port: " + qp + " span: " + qs + " english: "+ qe);
           });
--------------------- */
         }
}
function logIterator(iterator) {
    var current;
    while(true) {
        current = iterator.next();
        if (current.done) {
            break;
        }
        console.log(current.value);
    }
}

});
