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

function genSeq(set, n){
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

function genPallet(pallet, n){
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

function genPossibles(listOfSet){
  var ret = [[]];
  for(var set of listOfSet){
    ret = expandPossibles(ret, set);
  }
  return ret;
}

function genMaintains(n, ratio){
  ratio = ratio/100;
  var numberOfChanges = Math.floor(n*ratio);
  var factor = numberOfChanges+1
  var base = Math.round(n / factor);
  var arr;
  if(base * factor > n){
    arr = arrRepeat(base-1, base * factor - n);
  }else if(base * factor < n){
    arr = arrRepeat(base+1, n - base * factor);
  }else{
    arr = [];
  }
  factor -= arr.length;
  var numberOfOtherCase = Math.floor(factor / 3);
  arr = arr.concat(arrRepeat(base-1, numberOfOtherCase))
    .concat(arrRepeat(base+1, numberOfOtherCase))
    .concat(arrRepeat(base, factor - (2*numberOfOtherCase)));
  var cntZero = 0;
  for(var i=0; i<arr.length; i++){
    if(arr[i] == 0){
      arr[i] += 1;
      cntZero++;
    }else if (arr[i] > 1 && cntZero > 0){
      arr[i] -= 1;
      cntZero--;
    }
  }
  return d3.shuffle(arr);
}

function genSwitchSeq(maintains){
  var compatibilities = genSeq([1,2], maintains.length-1);
  var arr = [];
  var i = 0;
  for(; i<maintains.length-1; i++){
    for(var j=0; j<maintains[i]-1; j++){
      arr.push(0);
    }
    arr.push(compatibilities[i]);
  }
  for(var j=0; j<maintains[i]; j++){
    arr.push(0);
  }
  arr[0] = 0;
  return arr;
}

function genCompatible(possibles, compatibility){
  var idx1, idx2;
  if(compatibility){
    idx1 = random(possibles.length);
    idx2 = random(possibles.length/2);
    if(idx1 > possibles.length/2){
      idx2 += possibles.length/2;
    }
  }else{
    idx1 = random(possibles.length);
    idx2 = random(possibles.length/2);
    if(idx1 < possibles.length/2){
      idx2 += possibles.length/2;
    }
  }
  return [possibles[idx1], possibles[idx2]];
}

function genNumbers(switchSeq, possibles){
  var arr = new Array(switchSeq.length);
  for(var i=0; i<arr.length; i++){
    if(switchSeq[i] == 1){
      arr[i] = genCompatible(possibles, 1);
    }else if(switchSeq[i] == 2){
      arr[i] = genCompatible(possibles, 0);
    }else{
      arr[i] = genCompatible(possibles, random(2));
    }
  }
  return arr;
}


module.exports = {
	random: random,
	clone: clone,
  arrRepeat: arrRepeat,
  genSeq: genSeq,
  makeUrl: makeUrl,
  // for app1
  toHex: toHex,
  genPallet: genPallet,
  randomColorPos: randomColorPos,
  // for app2
  genPossibles: genPossibles,
  // fo app3
  genMaintains: genMaintains,
  genSwitchSeq: genSwitchSeq,
  genNumbers: genNumbers
};
