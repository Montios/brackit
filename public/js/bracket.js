$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  //query the team objects
  var bracket = Parse.Object.extend("Brackets");
  var query = new Parse.Query(bracket);
  query.descending('updatedAt');
  query.first({
    success: function(object) {
      var bracketData = object.get('bracket_data');
      var furthest_round = object.get('furthest_round');
      var totalRounds = object.get("total_rounds");
      buildBracket(bracketData,totalRounds); 
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

  var bracketData = []; 
  function buildBracket(data,rounds)
  {
      console.log (JSON.stringify(data));
      var bracketData= []; //store the entire data for bracket
      var roundArray = []; //store each round's teams
      var pairArray = [];  //store an array of team pairs
      var teamObj = {};
      var team_list = []; 
      var pairCount = 0; 
      for (var i = 1; i <=rounds; i++) {
        //build the team_list for the round we are in 
        for(var j = 0; j < data.length; j++){
          //only add the team to the array if it is >= the current round
          if (data[j].round >= i){
            team_list.push(data[j].value);
            console.log(JSON.stringify(data[j].value));
          }
        }

        //calculate how many pairs there should be for each round, except winner
        var pairNumber = Math.ceil((Math.pow(2,(rounds - i)))/2); 
        console.log(pairNumber);

        //if the team list length isnt 0, then we have all the necessary teams
        if(team_list.length!=0) {
          if(rounds!=i)//check if any round other than last
          {
            //now add the teams to the bracketData
            for (var k = 0; k < team_list.length; k++){
              teamObj['name'] = team_list[k];
              teamObj['id'] = k;
              pairArray.push(teamObj);
              teamObj = {};
              pairCount++; 
              if(pairCount==2) {
                //add the pair to the array for the current round
                roundArray.push(pairArray);
                pairCount = 0; 
                pairArray =  [];
              }
            }
          }
          else //last round scenario
          {
            teamObj['name'] = team_list[0];
            teamObj['id'] = 0;
            var winnerArray = []
            winnerArray.push(teamObj);
            roundArray.push(winnerArray);
          }
          //push the round array to the bracketData
          bracketData.push(roundArray);
          roundArray = [];
        }
        else if (rounds!=i){
          for (var k = 0; k < pairNumber; k++)
          {
            teamObj['name'] = "To Be Determined";
            teamObj['id'] = "tbd";
            pairArray.push(teamObj);
            pairArray.push(teamObj);
            teamObj = {};
            //add the pair to the array for the current round
            roundArray.push(pairArray);
            pairArray =  [];
          }
          //push the round array to the bracketData
          bracketData.push(roundArray);
          roundArray = [];
        }
        else {
          teamObj['name'] = "To Be Determined";
          teamObj['id'] = "tbd";
          var winnerArray = [];
          winnerArray.push(teamObj);
          teamObj={};
          //add the pair to the array for the current round
          roundArray.push(winnerArray);
          bracketData.push(roundArray);
          roundArray=[];
        }
        team_list=[];
      }

      //build the bracket with the data
      $(".my_gracket").gracket({
        src : bracketData
      });

      console.log(JSON.stringify(bracketData));


  }

  $( document ).on( "click", ".g_team", function() {
    console.log($(this).find("h3").clone().children().remove().end().text());
    var selected = $(this).find("h3").clone().children().remove().end().text().trim();
    alert("Your choice is \""+selected+"\". Thanks");
  });

  //redirect to votes page
  $("#voteButton").on("click", function(){
    window.location.href = "./vote.html";
  });

  $("#endRoundButton").on("click", function(){
    //determine the winner by comparing votes and incrementing the round

  });

  // var bracketData = 
  // [
  //   [
  //     [{"name":"pizza","id":0},{"name":"burritos","id":1}],
  //     [{"name":"Chinese","id":2},{"name":"sushi","id":3}],
  //     [{"name":"Korean","id":4},{"name":"burgers","id":5}],
  //     [{"name":"pasta","id":6},{"name":"vegetarian","id":7}]
  //   ],
  //   [
  //     [{"name":"To Be Determined","id":"tbd"},{"name":"To Be Determined","id":"tbd"}],
  //     [{"name":"To Be Determined","id":"tbd"},{"name":"To Be Determined","id":"tbd"}]
  //   ],
  //   [
  //     [{"name":"To Be Determined","id":"tbd"},{"name":"To Be Determined","id":"tbd"}]
  //   ],
  //   [
  //     [{"name":"To Be Determined","id":"tbd"}]
  //   ]
  // ];


});























