$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  var bid = getUrlParameter("bid");
  var creator = getUrlParameter("creator");
  //query the team objects
  var bracket = Parse.Object.extend("Brackets");
  var query = new Parse.Query(bracket);
  query.get(bid,{
    success: function(object) {
      bracketData = object.get('bracket_data');
      current_round = object.get('furthest_round');
      var totalRounds = object.get("total_rounds");
      buildTeamList(bracketData,current_round); 
      $("#title").append(object.get('category'));
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  //NOTES
  //name = string value given in bracket
  //id = allows for unique hovering
  //seed = number shown before value
  // var bracketData; 
  // var current_round;
  var teams = [];
  var selected_teams = []; 
  var team1; 
  var team2; 
  var option_count; //how many times user has voted/skipped
  var total_count;  //how many times the user should vote/skip in a round
  function buildTeamList(data,currRound)
  {
    //build the list of teams
    for (var i = 0; i < data.length; i++) {
      if(data[i].round==currRound){
        teams.push(data[i].value);
      }
    }
    total_count = teams.length/2; 
    console.log(total_count);

    option_count=0;
    displayNextPair();

    //display the indicator for the user
    $("#indicator").append("1 of " + total_count);
  }

  function displayNextPair()
  {
    team1 = teams[option_count*2];
    team2 = teams[option_count*2+1];  
    if(option_count!=total_count)
    {
      while(team1=="Byes" || team2=="Byes"){
        //skip the round if there is a bye
        option_count++;
        total_count--;
        if(option_count>total_count){
          returnToBracket();
        }
        team1 = teams[option_count*2];
        team2 = teams[option_count*2+1];
      }

      $("#team1").html(team1);
      $("#team2").html(team2);

      //refresh the indicator
      $("#indicator").html("");
      $('#indicator').append("" + (option_count+1) + " of " + total_count);
    }
    else
    {
      returnToBracket();
    }
    option_count++;
  }

  function returnToBracket()
  {
    //alert("last round");
    //user is done voting, so increment votes accordingly
    var bracket = Parse.Object.extend("Brackets");
    var query = new Parse.Query(bracket);
    query.get(bid, {
      success: function(object) {
        var bracketData = object.get('bracket_data');
        var current_round = object.get('furthest_round');
        //alert("currentround" + current_round);
        var playersVoted = object.get('playersVoted');
        playersVoted++;

        for (var i = 0; i < selected_teams.length; i++){
          for(var j = 0; j<bracketData.length; j++){
            if(bracketData[j].value==selected_teams[i]){
              bracketData[j]["votes" + current_round]++; 
            }
          }
        }

        object.set("bracket_data",bracketData);
        object.set("playersVoted", playersVoted);
        object.save(null, {
        success: function(savedObject) {
          // Execute any logic that should take place after the object is saved.
         // alert('Object saved with objectId: ' + savedObject.id);
          if (creator==="yes"){
            window.location.href = "./bracket.html?bid="+ bid + "&creator=yes";
          }
          else {
            window.location.href = "./bracket.html?bid="+ bid;
          }
        },
        error: function(brackets, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
        });

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    console.log(JSON.stringify(bracketData));
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

  $("#team1").on("click", function(){
    selected_teams.push(team1);
    displayNextPair();
  });

  $("#team2").on("click", function(){
    selected_teams.push(team2);
    displayNextPair();
  })

  $("#neither").on("click", function(){
    selected_teams.push('nil');
    displayNextPair();
  })

});


