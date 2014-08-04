function Timer (length, callback, callback_finish) {
  this.length = length;
  this.callback_finish = callback_finish;

  // hack: wrap the callback function
  var timer = this;
  this.callback = function() {
    callback(timer);
    if (timer.getTime() <= 0) {
      timer.callback_finish();
      clearInterval(timer.interval);
    }
  }
}

Timer.getTime = function () { return (new Date ()).valueOf ();} //CHECK
Timer.pad = function (seconds) {
  return (seconds < 10 ? '0' + seconds : '' + seconds);
}

Timer.prototype.getTime = function () {
  return Math.max(0, this.startTime + this.length - Timer.getTime());
}

Timer.prototype.addTime = function (delta) {
  this.length += delta;
  this.callback();
}

Timer.prototype.setTime = function(time) {
  this.length = time;
  this.callback();
}

Timer.prototype.stop = function () {
  clearInterval(this.interval);
}

Timer.prototype.getMinutes = function () {
  if (this.getTime() < 0)
    return 0;
  return Math.floor (this.getTime() / 1000 / 60);
}

Timer.prototype.getSeconds = function () {
  if (this.getTime() < 0)
    return 0;
  return Math.floor (this.getTime() / 1000 % 60);
}

Timer.prototype.toString = function () {
  return '' + this.getMinutes() + ':' + Timer.pad (this.getSeconds());
}


Timer.prototype.start = function () {
  this.startTime = Timer.getTime(); 
  
  // scope hack
  var timer = this;
  this.callback();
  this.interval = setInterval(function(){ 
    timer.callback(); 
    }, 1000);
}

// DisplayTimer is child class of Timer
function DisplayTimer(selector, length, callback_finish) {
  var printTime = function (timer) {
    $(selector).html(timer.toString());
  }

  Timer.call(this, length, printTime, callback_finish);
  console.log(this);
}

DisplayTimer.prototype = Object.create(Timer.prototype);
