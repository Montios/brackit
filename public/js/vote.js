$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  //query the team objects
  var bracket = Parse.Object.extend("Brackets");
  var query = new Parse.Query(bracket);
  query.descending('updatedAt');
  query.first({
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
  var bracketData; 
  var current_round;
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

    //display the first two in the buttons
    $("#team1").append(teams[0]);
    $("#team2").append(teams[1]);

    //store the current two teams
    team1 = teams[0];
    team2 = teams[1];
    option_count = 0;
  }

  function displayNextPair()
  {
    option_count++; 
    if(option_count!=total_count)
    {
      //access the elements of the next pair in the teams
      $("#team1").html("");
      $("#team2").html("");
      team1 = teams[option_count*2];
      team2 = teams[option_count*2+1];
      $("#team1").append(team1);
      $("#team2").append(team2);
    }
    else
    {
      //user is done voting, so increment votes accordingly
      var bracket = Parse.Object.extend("Brackets");
      var query = new Parse.Query(bracket);
      query.descending('updatedAt');
      query.first({
        success: function(object) {
          var bracketData = object.get('bracket_data');
          for (var i = 0; i < selected_teams.length; i++){
            for(var j = 0; j<bracketData.length; j++){
              if(bracketData[j].value==selected_teams[i]){
                bracketData[j]["votes" + current_round]++; 
              }
            }
          }
          object.set("bracket_data", bracketData);
          object.save(null, {
          success: function(savedObject) {
            // Execute any logic that should take place after the object is saved.
            alert('Object saved with objectId: ' + savedObject.id);
            window.location.href="./bracket.html";
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
  }

  $("#team1").on("click", function(){
    selected_teams.push(team1);
    displayNextPair();
  });

  $("#team2").on("click", function(){
    selected_teams.push(team2);
    displayNextPair();
  })

  $("#skipButton").on("click", function(){
    selected_teams.push('nil');
    displayNextPair();
  })

  // $( document ).on( "click", ".g_team", function() {
  //   console.log($(this).find("h3").clone().children().remove().end().text());
  //   var selected = $(this).find("h3").clone().children().remove().end().text().trim();
  //   alert("Your choice is \""+selected+"\". Thanks");
  // });
});







[{"round":1,"value":"pizza","votes1":1,"votes2":0},{"round":1,"value":"pasta","votes1":0,"votes2":0},{"round":1,"value":"sandwich","votes1":0,"votes2":0},{"round":1,"value":"burritos","votes1":1,"votes2":0}]














