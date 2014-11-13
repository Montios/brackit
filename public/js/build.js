$(document).ready(function() {  
 Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");
  
  var bid = getUrlParameter("bid");
  var creator = getUrlParameter("creator");

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
      //query.descending('createdAt');
      query.get(bid,{
        success: function(object) {
          object.add("player_inputs",array);

          var inputs = object.get('player_inputs');
          var players = object.get('playerCount');
          var size = object.get('bracketSize');
          var rounds = object.get('total_rounds');
          //check if all players have inputted
          //if so, build the bracketData based on the seeds and players
          if (inputs.length <= players){
            object.set('bracket_data', buildBracketData(inputs,players,size,rounds));
          }
          object.save();
          console.log("object updated");
          if (creator==="yes"){
            window.location.href = "./bracket.html?bid="+ bid + "&creator=yes";
          }
          else {
            window.location.href = "./bracket.html?bid="+ bid;
          }
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

    var bracket = Parse.Object.extend("Brackets");
    var query = new Parse.Query(bracket);
    //query.descending('createdAt');
    query.get(bid,{
      success: function(object) {
        //get the number of players and bracket size
        //and build the appropriate # of input fields
        var playerCount = object.get('playerCount');
        var bracketSize = object.get('bracketSize');
        var inputs = object.get('player_inputs');
        if(inputs!=undefined && playerCount<=inputs.length){
          alert("Players are no longer allowed to add teams!");
          if (creator==="yes"){
            window.location.href = "./bracket.html?bid="+ bid + "&creator=yes";
          }
          else {
            window.location.href = "./bracket.html?bid="+ bid;
          }
          
        }
        fieldsCount = Math.ceil(bracketSize/(0.75*playerCount));
        $('#categoryTitle').append(object.get('category'));
        for (var i = 1; i<=fieldsCount; i++)
        {
          //create the appropriate number of input fields based on formula
          $("#input_fields").append(
            "<input id=" + i + " type='text' placeholder='Rank "+ i + "' required>"
            )
        }
        if(creator==="yes"){
          $(".content").append(
            "<input id='share' value='test-bracketgame.parseapp.com/build.html?bid=" + bid +"'></input>"
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

  function getUrlParameter(sParam)
  {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) 
      {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam) 
          {
              return sParameterName[1];
          }
      }
  }      
});