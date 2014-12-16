var Circle, x;

x = function() {
  return console.log('hello world');
};

Circle = (function() {
  function Circle() {
    this.variable = 12;
  }

  Circle.prototype.hello = function() {
    return alert('hello world');
  };

  return Circle;

})();
