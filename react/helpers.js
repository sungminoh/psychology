var config = require('./config.js');
var base = config.base;
var d3 = require('d3-array');

function random (min, max) {
	if (arguments.length == 1) {
		max = min;
		min = 0;
	}
	var r = Math.random();
	return Math.floor(r * (max - min) + min);
};

function clone(obj) {
	var newObj = {};
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			newObj[prop] = obj[prop];
		}
	}
	return newObj;
}

function makeUrl(path) {
  var url = base + '/' + path;
  return url.replace(/\/+/g, '/');
}


function toHex(pallet){
  return pallet.map(x => {return x.hex();});
}

function arrRepeat(value, n){
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push(value);
  }
  return arr;
}

function generateSeq(set, n){
  var ret = [];
  var arr = [];
  var cnt = Math.floor(n/(set.size || set.length));
  for(var e of set){
    ret = ret.concat(arrRepeat(e, cnt));
    arr.push(e);
  }
  if(ret.length < n){
    ret = ret.concat(d3.shuffle(arr).slice(0, n-ret.length));
  }
  return d3.shuffle(ret);
}

function randomColorPos(pallet){
  var colorIndices = [];
  for(var i=0; i<pallet.length; i++){
    if(pallet[i] != '#ffffff'){
      colorIndices.push(i);
    }
  }
  return colorIndices[Math.floor(Math.random() * colorIndices.length)];
}

function generatePallet(pallet, n){
  var ret = arrRepeat('#ffffff', pallet.length);
  var colors = d3.shuffle(pallet).slice(0, n+1);
  for(var i=0; i<Math.min(n, pallet.length); i++){
    ret[i] = colors[i];
  }
  return [d3.shuffle(ret), colors[n]];
}

function expandPossibles(possibles, options){
  var ret = [];
  for(var possible of possibles){
    if(typeof(possible) != 'object'){
      possible = [possible];
    }
    for(var option of options){
      ret.push(possible.concat(option));
    }
  }
  return ret;
}

function generatePossibles(listOfSet){
  var ret = [[]];
  for(var set of listOfSet){
    ret = expandPossibles(ret, set);
  }
  return ret;
}


module.exports = {
	random: random,
	clone: clone,
  makeUrl: makeUrl,

  toHex: toHex,
  arrRepeat: arrRepeat,
  generateSeq: generateSeq,
  generatePallet: generatePallet,
  randomColorPos: randomColorPos,

  generatePossibles: generatePossibles

};
