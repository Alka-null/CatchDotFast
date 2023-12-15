function RandomObjectMover(obj, container) {
	this.$object = obj;
  this.$container = container;
  this.container_is_window = container === window;
  this.pixels_per_second = 80;
  this.current_position = { x: 0, y: 0 };
  this.is_running = false;
}

// Set the speed of movement in Pixels per Second.
RandomObjectMover.prototype.setSpeed = function(pxPerSec) {
	this.pixels_per_second = pxPerSec;
}

RandomObjectMover.prototype._getContainerDimensions = function() {
   if (this.$container === window) {
       return { 'height' : this.$container.innerHeight, 'width' : this.$container.innerWidth };
   } else {
   	   return { 'height' : this.$container.clientHeight, 'width' : this.$container.clientWidth };
   }
}

RandomObjectMover.prototype._generateNewPosition = function() {

	// Get container dimensions minus div size
  var containerSize = this._getContainerDimensions();
	var availableHeight = containerSize.height - this.$object.clientHeight;
  var availableWidth = containerSize.width - this.$object.clientHeight;
    
  // Pick a random place in the space
  var y = Math.floor(Math.random() * availableHeight);
  var x = Math.floor(Math.random() * availableWidth);
    
  return { x: x, y: y };    
}

RandomObjectMover.prototype._calcDelta = function(a, b) {
	var dx   = a.x - b.x;         
  var dy   = a.y - b.y;         
  var dist = Math.sqrt( dx*dx + dy*dy ); 
  return dist;
}

RandomObjectMover.prototype._moveOnce = function() {
		// Pick a new spot on the page
    var next = this._generateNewPosition();
    
    // How far do we have to move?
    var delta = this._calcDelta(this.current_position, next);
    
		// Speed of this transition, rounded to 2DP
		var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;
    
    //console.log(this.current_position, next, delta, speed);
          
    this.$object.style.transition='transform '+speed+'s linear';
    this.$object.style.transform='translate3d('+next.x+'px, '+next.y+'px, 0)';
    
    // Save this new position ready for the next call.
    this.current_position = next;
  
};

RandomObjectMover.prototype.start = function() {

	if (this.is_running) {
  	return;
  }

	// Make sure our object has the right css set
  this.$object.willChange = 'transform';
  this.$object.pointerEvents = 'auto';
	
  this.boundEvent = this._moveOnce.bind(this)
  
  // Bind callback to keep things moving
  this.$object.addEventListener('transitionend', this.boundEvent);
  
  // Start it moving
  this._moveOnce();
  
  this.is_running = true;
}

RandomObjectMover.prototype.stop = function() {

	if (!this.is_running) {
  	return;
  }
  
  this.$object.removeEventListener('transitionend', this.boundEvent);
  
	this.is_running = false;
}


// Init it
var x = new RandomObjectMover(document.getElementById('a'), window);
var movingobj = document.querySelector('div#a')
var points = document.querySelector('#points')
var endofgamemessage = document.querySelector('#endofgamemessage')
var pointscount = 0

movingobj.addEventListener('click', function(){
  // points.innerText = isNaN(parseInt(points.innerText))? 1: pointscount++
  points.innerText = pointscount++
});

var timer = document.querySelector('#timer')
var incrtimer
var minutes = 125
var minuteselement = 50
var secondselement = 10
var begindate = new Date('Thu Jan 01 1970 00:00:30')
fixedTime = 30
var count = fixedTime
// Toolbar stuff
document.getElementById('start').addEventListener('click', function(){
  endofgamemessage.style.backgroundColor  = 'aquamarine'
  endofgamemessage.innerText  = 'Hit the moving dot as many times as 20 or more in 30 seconds'
  points.innerText = '0'

    incrtimer = setInterval(function(){
      console.log('i was clicked')
      count--
      if(count < 0){
        clearInterval(incrtimer)
        timer.innerText = ''
        if(parseInt(points.innerText) < 20 || isNaN(parseInt(points.innerText))){
          endofgamemessage.innerText = 'Sorry, you lost. You can try again'
          endofgamemessage.style.backgroundColor  = 'red'
          
        }
        else{
          endofgamemessage.innerText = 'Hurray, you smashed it'
          endofgamemessage.style.backgroundColor  = 'green'
        }

        x.stop();
        begindate = new Date('Thu Jan 01 1970 00:1:18')
        count = fixedTime

      }
      else{
        begindate = new Date(begindate - (1000))
        timer.innerText = begindate.getMinutes() + ':' + begindate.getSeconds()
      }
  }, 1000)
	x.start();
});
// document.getElementById('stop').addEventListener('click', function(){
//   clearInterval(incrtimer)
// 	x.stop();
// });
// document.getElementById('speed').addEventListener('keyup', function(){
//   if (parseInt(this.value) > 3000 ) {
//  		alert('Don\'t be stupid, stupid');
//     this.value = 250;
//   }
// 	x.setSpeed(parseInt(this.value));
// });


// Start it off

//x.start();


var blinkpatterns = [2, 1.5, 1, 3]
window.onload = function(){
  
  function freshDot(){
    var blink = blinkpatterns[Math.floor(Math.random()*blinkpatterns.length)]
    this.obj = document.createElement("div");
    this.obj.classList.add("box");
    if(blink == 1){
      this.obj.classList.add("onesec");
    }
    if(blink == 2){
      this.obj.classList.add("twosec");
    }
    if(blink == 1.5){
      this.obj.classList.add("onep5sec");
    }

    this.obj.style.top = (window.innerHeight * Math.random()) + 'px';
    this.obj.style.left = (window.innerWidth * Math.random()) + 'px';
    this.size = Math.floor(5 * Math.random());
    this.obj.style.height =  this.size + 'px';
    this.obj.style.width = this.size + 'px';
    
    document.body.appendChild(this.obj);
  }
  var dot = [];
  for(var i = 0 ; i < 400; i++ ){
    dot.push(new freshDot());
  }
  /*
  $(window).resize(function(){
    for(i=0;i<200;i++){
      document.body.removeChild(dot[i]);
    }
  });
  */
}