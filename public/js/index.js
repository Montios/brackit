$(document).ready(function() {  
Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

    //add functions that should run at page-load here
    //deleteData();
    buildInputFields();

    //function to delete old data
    function deleteData ()
    {
      var oldBracket = Parse.Object.extend("Brackets");
      var query = new Parse.Query(oldBracket);
      query.first({
        success: function(myObj) {
          // The object was retrieved successfully
          if (myObj!=null)
          {
            myObj.destroy({});
          }
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and description.
        }
      });
    }

    var bracket_size = 2; 
    function buildInputFields()
    {
      $('#input_fields').html("");
      bracket_size = $("#bracketSize").val();
      console.log(bracket_size);
      for (var i = 1; i<=bracket_size; i++)
      {
        $("#input_fields").append(
          "<div class='input-row'>" + 
          "<label>" + i + "</label>" + 
          "<input id=" + i + " type='text'></div>"
          )
      }
    }

    $("#bracketSize").change(function(){
      buildInputFields();
    });


    $("#createBracket").on('click', function(){
      var input = bracket_size;
      //var rounds = (Math.ceil(Math.log2(input)));
      var rounds = Math.ceil(Math.log2(input));
      console.log(JSON.stringify(rounds));
      var array = [];
      for (var i = 1; i <= input; i++){
        var obj = {};
        obj['value'] = $("#" +i).val();
        for (var j =1; j <= rounds; j++){
          obj['votes' + j] = 0;
        }

        obj['round'] = 1;
        array.push(obj);    
      }

      console.log(JSON.stringify(array));
      var Brackets = Parse.Object.extend("Brackets");
      var brackets = new Brackets();
      brackets.set("bracket_data",array);
      brackets.set("furthest_round", 1);
      brackets.set("total_rounds", rounds+1);
      brackets.save(null, {
      success: function(brackets) {
        // Execute any logic that should take place after the object is saved.
        //alert('New object created with objectId: ' + brackets.id);
        window.location.href = "./category.html";
      },
      error: function(brackets, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
      });

    });  
});


