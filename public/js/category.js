$(document).ready(function() {  
 Parse.initialize("WSUgho0OtfVW9qimoeBAKW8qHKLAIs3SQqMs0HW6", "9ZmxN9S1vOOfTaL7lD5vtUYRAwTEComMztpJVuTK");

  $("#addCategory").on('click', function(){
    var bracket = Parse.Object.extend("Brackets");
    var query = new Parse.Query(bracket);
    query.descending('createdAt');
    query.first({
      success: function(object) {
        object.set('category',$("#category").val());
        object.save();
        window.location.href = "./bracket.html"
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  });
     
});


