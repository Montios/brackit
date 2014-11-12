$(document).ready(function() {  
 Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  //put functions that should run at load here
  buildInputFields();

  //global variables
  var fieldsCount;

  $("#addInputs").on('click', function(){
    //get all the inputs entered by user
    var array = []; 
    var inputError=false; 
    for (var i = 1; i<=fieldsCount;i++) {
      //check if user did not enter anything
      if ($("#"+ i).val()!="") {
        array.push($("#"+i).val());
      }
      else { 
        //set the error to true
        inputError = true; 
      }
    }

    //only save if user input properly, else alert user
    if (inputError==false){
      //save this user input to Parse
      var bracket = Parse.Object.extend("Brackets");
      var query = new Parse.Query(bracket);
      query.descending('createdAt');
      query.first({
        success: function(object) {
          object.add("player_inputs",array);

          var inputs = object.get('player_inputs');
          var players = object.get('playerCount');
          var size = object.get('bracketSize');
          var rounds = object.get('total_rounds');
          //check if all players have inputted
          //if so, build the bracketData based on the seeds and players
          if (inputs.length == players){
            object.set('bracket_data', buildBracketData(inputs,players,size,rounds));
          }
          object.save();
          console.log("object updated");
          window.location.href = "./bracket.html";
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
    else {
      //alert add an input to all fields
      alert("Missing input!");
    }

  });

  function buildInputFields()
  {
    var playerCount;
    var bracketSize;
    var bracket = Parse.Object.extend("Brackets");
    var query = new Parse.Query(bracket);
    query.descending('createdAt');
    query.first({
      success: function(object) {
        //get the number of players and bracket size
        //and build the appropriate # of input fields
        playerCount = object.get('playerCount');
        bracketSize = object.get('bracketSize');
        console.log("object successfully retrieved");
        console.log(bracketSize);
        fieldsCount = Math.ceil(bracketSize/(0.75*playerCount));
        console.log(fieldsCount);
        $('#categoryTitle').append(object.get('category'));
        for (var i = 1; i<=fieldsCount; i++)
        {
          //create the appropriate number of input fields based on formula
          $("#input_fields").append(
            "<input id=" + i + " type='text' placeholder='Item "+ i + "'>"
            )
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }


  //function to build the bracket data based on seeds and # of players
  function buildBracketData(inputs,players,size,rounds){
    var data =[];
    var seed = 0; 
    var index = 0; 
    while (data.length!=size){
      //run through the highest seed of each player and add to data
      //then repeat with next seed

      var team ={};
      team['round'] = 1; 
      team['value'] = inputs[index][seed];
      //create all the vote + i fields in the team object
      for (var i = 1; i<rounds; i++) {
        team['votes' + i] = 0; 
      }
      data.push(team);
      index++;
      if(index == players) {
        //if the index is the same as players, move to the next seed
        //and restart the index
        index = 0; 
        seed++;
      }
    }

    return data;
  }




     
});