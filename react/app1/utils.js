var d3 = require('d3-array');

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


module.exports = {
  toHex: toHex,
  arrRepeat: arrRepeat,
  generateSeq: generateSeq,
  generatePallet: generatePallet,
  randomColorPos: randomColorPos
}
