function ajaxQuery (query, callback) {
  console.log(query);
  $.ajax({
    url: "ajax",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(query),
    success: function(response_str){
      response = JSON.parse(response_str);
      console.log(response);
      callback(response);
    }
  });
}

function ajaxLongPoll (query, callback, timeout) {
  if (!timeout) timeout = 2000;
  console.log(timeout);

  var callback_wrap = function(response) {
    callback(response);
    setTimeout(function(){ajaxQuery(query, callback_wrap);}, timeout);
  }
  ajaxQuery(query, callback_wrap);
}
