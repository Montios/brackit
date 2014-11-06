$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  

  //query the team objects
  var bracket = Parse.Object.extend("Brackets");
  var query = new Parse.Query(bracket);
  query.first({
    success: function(object) {
      var bracketData = object.get('bracket_data');
      console.log(JSON.stringify(bracketData));
      teams = buildBracket(bracketData); 
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  

  function buildBracket(bracketData)
  {
    console.log (JSON.stringify(bracketData));
    //var bracket_data = JSON.parse(bracketData);

    //get the list of team names
    var teams = []; 
    var team_list = [];
    for(var i = 0; i < bracketData.length; i++)
    {
      team_list.push(bracketData[i].value); 
    }

    //create array of array of pairs
    var pairArray = [];
    var pairCount = 0; 
    for (var i = 0; i < team_list.length; i++)
    {
      pairArray.push(team_list[i]);
      pairCount++; 
      if(pairCount==2)
      {
        pairCount = 0; 
        teams.push(pairArray); 
        pairArray = [];
      }
    }
    console.log(JSON.stringify(teams));
    

    var singleElimination = { 
         teams : teams,
         results : [[ /* WINNER BRACKET */
           [[3,5], [2,4], [6,3], [2,3]],
           [[0,0], [0,0]],
           //[[0,0]]
           ]]
       }
     //console.log(JSON.stringify(teams));


    $(function() { $('div#big').bracket({
      skipConsolationRound: true,
      init: singleElimination}) 
    }) 
  }





// var bigData = {
//       teams : [
//         ["Team 1",  "Team 2" ],
//         ["Team 3",  "Team 4" ],
//         ["Team 5",  "Team 6" ],
//         ["Team 7",  "Team 8" ]
//       ],
//       results : [[ /* WINNER BRACKET */
//         [[3,5], [2,4], [6,3], [2,3]],
//         [[1,2], [3,4]],
//         [[9,1]]
      
//     //     [[1,2], [3,4]],
//     //     [[9,1]]
//     //   ],[
//     //   [[1,2], [3,1]],
//     //   [[3,0], [1,9]],
//     //   [[3,2]],
//     //   [[4,2]]
//     // ], [         /* FINALS */
//     //   [[3,8], [1,2]],
//     //   [[2,1]]
//       ]]
    
//     }

//     $(function() { $('div#big').bracket({
//       skipConsolationRound: true,
//       init: bigData}) 
//     }) 

});

















