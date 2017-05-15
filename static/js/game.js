/* 
 * Fraction 
 */
function Fraction(numerator, denominator) {
  var gcd = math.gcd(numerator, denominator);

  this.value = numerator / denominator;
  this.numerator = numerator / gcd;
  this.denominator = denominator / gcd;
}

Fraction.prototype.toString = function () {
  if (this.denominator == 1) {
    return this.numerator.toString();
  }else {
    return this.numerator.toString()
         + "/"
         + this.denominator.toString();
  }
}

Fraction.equals = function(f1, f2) {
  return Math.abs(f1.value - f2.value) < 1e-9;
}

Fraction.randomFraction = function(cap) {
  var numerator = 1 + Math.floor(Math.random() * cap);
  var denominator = 2 + Math.floor(Math.random() * (cap - 1));
  return new Fraction(numerator, denominator);
}


/* 
 * Puzzle - a single problem
 */
function Puzzle(left, right, id) {
  this.left = left;
  this.right = right;
  this.id = id;
  
  // 0 for left, 1 for right
  this.solution = (left.value > right.value ? 0 : 1);

  // what the user picked
  this.selected = -1;
}

Puzzle.prototype.select = function(value) {
  this.selected = value;
}

Puzzle.prototype.larger = function () {
  return Math.max (this.left.value, this.right.value);
}

Puzzle.prototype.smaller = function () {
  return Math.min (this.left.value, this.right.value);
}

Puzzle.prototype.ratio = function () {
  return this.larger() / this.smaller();
}

Puzzle.prototype.isSelected = function() {
  return this.selected != -1;
}

Puzzle.prototype.isCorrect = function() {
  return this.selected == this.solution;
}

Puzzle.prototype.getSign = function() {
  if (this.isSelected()) {
    return (this.solution ? "<" : ">");
  }else {
    return "?";
  }
}

Puzzle.prototype.toString = function() {
  var left_div = $("<td/>")
    .addClass("puzzle-fraction puzzle-fraction-left")
    .html(this.left.toString());
  var right_div = $("<td/>")
    .addClass("puzzle-fraction puzzle-fraction-right")
    .html(this.right.toString());
  var sign_div = $("<td/>")
    .addClass("puzzle-sign")
    .html(this.getSign());
  
  var result = $("<tr/>")
    .addClass("puzzle-container")
    .attr("id", this.id)
    .append(left_div)
    .append(sign_div)
    .append(right_div);

  if(this.isSelected())
    result.addClass(this.isCorrect() ? "puzzle-correct" : "puzzle-incorrect");

  return result;
}


Puzzle.generatePuzzle = function(id, cap) {
  var f1 = new Fraction(0,1);
  var f2 = new Fraction(0,1);
  // maybe can allow equals
  while (Fraction.equals(f1,f2)) {
    f1 = Fraction.randomFraction(cap);
    f2 = Fraction.randomFraction(cap);
  }
  return new Puzzle(f1, f2, id);
}

Puzzle.generateDifficultPuzzle = function (id, difficulty) {
  //var numPuzzles = Math.floor((difficulty + 1) / 2);
  var numPuzzles = difficulty; 
  var cap = difficulty * 2 + 1;
  var best_puzzle = Puzzle.generatePuzzle(id, cap);
  for (var i = 0; i < numPuzzles - 1; i ++) {
    var cur_puzzle = Puzzle.generatePuzzle(id, cap);
    if (cur_puzzle.ratio() < best_puzzle.ratio())
       best_puzzle = cur_puzzle;
  }
  return best_puzzle;
}


/*
 * PuzzlePlayer - object that allows continuous playing of game
 */
function PuzzlePlayer(selector) {
  this.timer_div = $("<div/>").addClass("game-timer");
  this.game_div = $("<div/>").addClass("game-body");
  this.selector = selector;
  this.selector
    .append(this.timer_div)
    .append(this.game_div);

  this.game_length = 15*1000 + 50; // 15 seconds

  // scope hack
  var pp = this;
  this.timer = new DisplayTimer(
    pp.timer_div, 
    pp.game_length, 
    function() {
      pp.finish("Time's up!"); 
    });

  this.score = 0;
  this.level = 1;
  this.count = 0;
  this.combo = 0;
  this.puzzles = [];
  
  // scope hack
  var pp = this;
  $(document).keyup(function(event){
    if (event.keyCode == 37)
      pp.select(0);
    else if (event.keyCode == 39)
      pp.select(1);
  });
}

PuzzlePlayer.prototype.start = function() {
  promptName();
  this.game_div
    .append(
      $("<div/>")
        .addClass("game-score")
        .append(
          $("<span/>")
            .addClass("game-stat")
            .append("Score: <span class=\"score\">0</span>")
        )
        .append(
          $("<span/>")
            .addClass("game-stat")
            .append("Level: <span class=\"level\">1</span>")
        )
    ).append(
      $("<table/>")
        .addClass("puzzle-list")
        .append($("<thead/>").addClass("puzzle-current"))
        .append($("<tbody/>").addClass("puzzle-previous"))
    );

  this.timer.start();  
  this.nextPuzzle();
}

PuzzlePlayer.prototype.displayPuzzle = function(puzzle) {
  var pp = this;
  $(".puzzle-current").html(puzzle.toString());
  $(".puzzle-fraction-left").click(function(event){
    pp.select(0);
  });
  $(".puzzle-fraction-right").click(function(event){
    pp.select(1);
  });
}

PuzzlePlayer.prototype.nextPuzzle = function() {
  var puzzle = Puzzle.generateDifficultPuzzle(this.puzzles.length, this.level);
  //var puzzle = Puzzle.generatePuzzle(this.index, this.level);
  this.puzzles.push(puzzle);
  this.displayPuzzle(puzzle);
}

PuzzlePlayer.prototype.getLastPuzzle = function() {
  return this.puzzles[this.puzzles.length - 1];
}

PuzzlePlayer.prototype.select = function(value) {
  // last puzzle
  var puzzle = this.getLastPuzzle();
  puzzle.select(value);

  var delta = '';

  if (puzzle.isCorrect()) {
    delta = '+' + Math.pow(2, this.level - 1);
    this.score += Math.pow(2, this.level - 1);
    //this.score += 1;
    this.combo += 1;
    this.count += 1;
    this.timer.addTime(1000 * (1 + 1 / this.level));
    if (this.combo % 5 == 0) {
      //this.timer.addTime(5000 * (1 + 1 / this.level));
      //this.timer.addTime(5000);
      this.level += 1;
    }
    $(".puzzle-previous").html("");
  }else {
    delta = '-1';
    this.timer.addTime(-5000);
    this.score -= 1;
    this.combo = 0;
    this.level = Math.max(this.level - 1, 1);
    $(".puzzle-previous").html(puzzle.toString());
    //this.finish("Wrong Answer!");
    //return;
  }

  $(".puzzle-current").html("");
  $(".score").html('' + this.score + ' (' + delta + ')');
  //$(".score").html(this.score);
  $(".level").html(this.level);
  $(".combo").html(this.combo);

  this.nextPuzzle();
}

PuzzlePlayer.prototype.getCorrectBits = function(){
  var res = "";
  for (var i = 0; i < this.puzzles.length; i ++){
    if(this.puzzles[i].isSelected()) {
      res += (this.puzzles[i].isCorrect() ? "1" : "0");
    }
  }
  return res;
}

PuzzlePlayer.prototype.finish = function(display) {
  if (!display || true) display = "Game Over!";

  $(".game-score").html(
    $("<div/>")
      .addClass("jumbotron")
      .append("<h1>" + display + "</h1>")
      //.append("<h3>" + display + "</h3>")
      .append("<h3>Score: " + this.score + "</h3>")
      .append("<a href=\"/play\" class=\"btn btn-success\">Play again</a>")
  );
  $(".puzzle-current").html(this.getLastPuzzle().toString());
  
  this.timer.stop();
  this.timer_div.hide();
  this.select = function(x) {}
  this.logResult();
}

PuzzlePlayer.prototype.isFinished = function() {
  return this.timer.isFinished();
}

PuzzlePlayer.prototype.logResult = function() {
  var query = {
    q: "log_result",
    name: getName(),
    score: this.score,
    ts: Math.floor(new Date().getTime() / 1000)
  };

  ajaxQuery(query, function(response) {});
}
