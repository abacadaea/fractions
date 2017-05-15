$(document).ready(function() {
  $("table.hiscore")
    .append($("<thead/>")
      .append($("<tr/>")
        .append($("<th/>").html("Name"))
        .append($("<th/>").html("Score"))
        .append($("<th/>").html(""))
      )
    ).append($("<tbody/>"));
});

function displayHiscore (scores, selector) {
  selector.html("");
  for (var i = 0; i < scores.length; i ++) {
    selector.append(
      $("<tr/>")
        .append($("<td/>").html(scores[i].name))
        .append($("<td/>").html(scores[i].score))
        .append($("<td/>").html(Timer.displayTimeDiff(scores[i].ts)))
    )
  }
}

function pollHiscore (query, selector) {
  $.each(selector, function() {
    // scope hack
    var elem = this;
    ajaxLongPoll(query, function(response) {
      displayHiscore (
        response.output.scores, 
        $(elem.children[1]));
    }, 15000);
  });
}

pollHiscore({
  q: "get_hiscore",
  time: 0,
  number: 10,
  order: "ts"
}, $(".score-recent"));

pollHiscore({
  q: "get_hiscore",
  time: 24*3600,
  number: 10
}, $(".hiscore-recent"));

pollHiscore({
  q: "get_hiscore",
  time: 0,
  number: 10
}, $(".hiscore-global"));
