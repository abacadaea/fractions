function ajaxQuery (query, callback) {
  console.log(query);
  $.ajax({
    url: "/ajax",
    type: "POST",
    data: JSON.stringify(query),
    success: function(response_str){
      response = JSON.parse(response_str);
      console.log(response);
      callback(response);
    }
  });
}
