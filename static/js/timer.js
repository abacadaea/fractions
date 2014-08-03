function Timer (length, callback, callback_finish) {
  this.length = length;
  this.callback = callback;  
  this.callback_finish = callback_finish;
}

Timer.getTime = function () { return (new Date ()).valueOf ();} //CHECK
Timer.pad = function (seconds) {
  return (seconds < 10 ? '0' + seconds : '' + seconds);
}

Timer.prototype.getTimeRemaining = function () {
  return Math.max(0, this.startTime + this.length - Timer.getTime());
}

Timer.prototype.getMinutes = function () {
  if (this.getTimeRemaining() < 0)
    return 0;
  return Math.floor (this.getTimeRemaining() / 1000 / 60);
}

Timer.prototype.getSeconds = function () {
  if (this.getTimeRemaining() < 0)
    return 0;
  return Math.floor (this.getTimeRemaining() / 1000 % 60);
}

Timer.prototype.toString = function () {
  return '' + this.getMinutes() + ':' + Timer.pad (this.getSeconds());
}

Timer.prototype.start = function () {
  this.startTime = Timer.getTime(); 
  
  // callback every second
  // scope hack
  var timer = this;
  this.callback();
  var interval = setInterval(function(){ timer.callback(); }, 1000);
  setTimeout(function(){ clearInterval(interval); }, this.length);

  // callback on finish
  setTimeout(this.callback_finish, this.length);
}

// DisplayTimer is child class of Timer
function DisplayTimer(selector, length, callback_finish) {
  var printTime = function () {
    $(selector).html(this.toString());
  }

  Timer.call(this, length, printTime, callback_finish);
  console.log(this);
}

DisplayTimer.prototype = Object.create(Timer.prototype);
