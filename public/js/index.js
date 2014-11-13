$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  //store the initial data for the bracket
  $("#submit").on('click', function(){
    var bracketSize = $("#bracketSize").val();
    var rounds = Math.ceil(Math.log2(bracketSize));
    console.log(JSON.stringify(rounds));

    //save the appropriate fields
    var Brackets = Parse.Object.extend("Brackets");
    var brackets = new Brackets();
    brackets.set("furthest_round", 1);
    brackets.set("total_rounds", rounds+1);
    brackets.set("category", $("#category").val());
    brackets.set("playerCount", parseInt($("#numPlayers").val()));
    brackets.set("bracketSize", parseInt(bracketSize));
    brackets.save(null, {
    success: function(brackets) {
      //alert('New object created with objectId: ' + ;
      window.location.href = "./build.html?bid="+brackets.id + "&creator=yes";
    },
    error: function(brackets, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
    });
  });  
});


