function getName (){
  return $.cookie("name");
}
function setName (name){
  $.cookie("name", name);
  window.location.reload();
}
function promptName() {
  var name = prompt("What's your name?", "");
  setName(name); 
}
function checkName (){
  if (!getName()) {
    promptName();
  }
}

$(document).ready(function(){
  checkName();
  $(".name").html(getName());
  $(".name").click(function(event) {
    promptName();
  });
});
