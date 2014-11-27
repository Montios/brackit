$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  // if(!isLocalStorageNameSupported()){
  //   alert("Please turn off Private Browsing! This can be done by clicking on the bottom right.");
  // }
  // function isLocalStorageNameSupported() 
  // {
  //     var testKey = 'test', storage = window.sessionStorage;
  //     try 
  //     {
  //         storage.setItem(testKey, '1');
  //         storage.removeItem(testKey);
  //         return localStorageName in win && win[localStorageName];
  //     } 
  //     catch (error) 
  //     {
  //         return false;
  //     }
  // }

  //store the initial data for the bracket
  $("#submit").on('click', function(){
    //var bracketSize = $("#bracketSize").val();
    var sizeOptions = document.getElementById("bracketSize");
    var size = sizeOptions.options[sizeOptions.selectedIndex].value;
    console.log(Math.log(size));
    var rounds = Math.ceil(Math.log(size)/Math.log(2));
    console.log(JSON.stringify(rounds));

    //save the appropriate fields
    var Brackets = Parse.Object.extend("Brackets");
    var brackets = new Brackets();
    brackets.set("furthest_round", 1);
    brackets.set("total_rounds", rounds+1);
    brackets.set("category", $("#category").val());
    brackets.set("playerCount", parseInt($("#numPlayers").val()));
    brackets.set("bracketSize", parseInt(size));
    brackets.set("playersVoted", 0);
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


