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
    .addClass("puzzle-fraction")
    .html(this.left.toString());
  var right_div = $("<td/>")
    .addClass("puzzle-fraction")
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


/*
 * PuzzlePlayer - object that allows continuous playing of game
 */
function PuzzlePlayer(selector) {
  this.selector = selector;
  this.score = 0;
  this.level = 1;
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
  this.selector
    .append(
      $("<div/>")
        .addClass("game-score")
        .append(
          $("<span/>")
            .addClass("game-stat")
            .html("Score: <span class=\"score\">0</span>")
        )
        .append(
          $("<span/>")
            .addClass("game-stat")
            .html("Level: <span class=\"level\">1</span>")
        )
    ).append(
      $("<table/>")
        .addClass("puzzle-list")
        .append($("<thead/>").addClass("puzzle-current"))
        .append($("<tbody/>").addClass("puzzle-previous"))
    );
      
  this.nextPuzzle();
}

PuzzlePlayer.prototype.displayPuzzle = function(puzzle) {
  $(".puzzle-current").html(puzzle.toString());
}

PuzzlePlayer.prototype.nextPuzzle = function() {
  var puzzle = Puzzle.generatePuzzle(this.index, 5 * this.level);
  this.puzzles.push(puzzle);

  this.displayPuzzle(puzzle);
}

PuzzlePlayer.prototype.select = function(value) {
  // last puzzle
  var puzzle = this.puzzles[this.puzzles.length - 1];
  puzzle.select(value);

  var delta = 0;

  if (puzzle.isCorrect()) {
    delta = '+' + Math.pow(2, this.level - 1);
    this.score += Math.pow(2, this.level - 1);
    this.combo += 1;
    if (this.combo % 5 == 0)
      this.level += 1;
  }else {
    delta = '-1';
    this.score -= 1;
    this.combo = 0;
    this.level = Math.max(this.level - 1, 1);
  }

  $(".puzzle-current").html("");
  $(".puzzle-previous").prepend(puzzle.toString());
  $(".score").html('' + this.score + ' (' + delta + ')');
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

/*
 * Game - wrapper class for PuzzlePlayer
 */
function Game(selector) {
  var timer_div = $("<div/>").addClass("game-timer");
  var game_div = $("<div/>").addClass("game-body");
  this.selector = selector;
  this.selector
    .append(timer_div)
    .append(game_div);

  this.game_length = 60*1000 + 50; // 60 seconds
  this.start_time = 0;

  // scope hack
  var game = this;
  this.timer = new DisplayTimer(
    timer_div, 
    this.game_length, 
    function() { game.finish(); timer_div.hide(); });
  this.pp = new PuzzlePlayer(game_div);
}

Game.prototype.start = function (){
  this.start_time = new Date().getTime();
  this.timer.start();
  this.pp.start();
}

Game.prototype.finish = function() {
  var score = this.pp.score;
  $(".game-body").html(
    $("<div/>")
      .addClass("jumbotron")
      .append("<h1>Game Over!</h1>")
      .append("<h2>Score: " + score + "</h2>")
      .append("<a href=\"/play\" class=\"btn btn-success\">Play again</a>")
  );
  
  this.logResult();
}

Game.prototype.isFinished = function() {
  return this.timer.isFinished();
}

Game.prototype.logResult = function() {
  var query = {
    q: "log_result",
    score: this.pp.score,
    correct_bits: this.pp.getCorrectBits()
  };

  ajaxQuery(query, function(response) {});
}
