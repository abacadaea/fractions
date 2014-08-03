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

Fraction.randomFraction = function() {
  var numerator = 1 + Math.floor(Math.random() * 20);
  var denominator = 1 + Math.floor(Math.random() * 20);
  return new Fraction(numerator, denominator);
}

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


Puzzle.generatePuzzle = function(id) {
  var f1 = new Fraction(0,1);
  var f2 = new Fraction(0,1);
  // maybe can allow equals
  while (Fraction.equals(f1,f2)) {
    f1 = Fraction.randomFraction();
    f2 = Fraction.randomFraction();
  }
  return new Puzzle(f1, f2, id);
}

function PuzzlePlayer() {
  this.score = 0;
  this.puzzles = [];
  
  this.game_length = 60*1000; // 60 seconds
  this.start_time = 0;
}

PuzzlePlayer.prototype.gameStart = function() {
   this.start_time = new Date().getTime();
   this.nextPuzzle();
}

PuzzlePlayer.prototype.gameOver = function() {
  alert ("Game Over!");
}

PuzzlePlayer.prototype.displayPuzzle = function(puzzle) {
  $(".puzzle-current").html(puzzle.toString());
}

PuzzlePlayer.prototype.nextPuzzle = function() {
  var puzzle = Puzzle.generatePuzzle(this.index);
  this.puzzles.push(puzzle);
  console.log(puzzle);

  this.displayPuzzle(puzzle);
}

PuzzlePlayer.prototype.select = function(value) {
  // last puzzle
  var puzzle = this.puzzles[this.puzzles.length - 1];

  puzzle.select(value);
  console.log(puzzle);
  this.score += (puzzle.isCorrect() ? 1 : -1);
  $(".puzzle-current").html("");
  $(".puzzle-previous").prepend(puzzle.toString());
  $(".score").html(this.score);

  this.nextPuzzle();
}

var pp = new PuzzlePlayer();
$(document).keyup(function(event){
  if (event.keyCode == 37)
    pp.select(0);
  else if (event.keyCode == 39)
    pp.select(1);
});
