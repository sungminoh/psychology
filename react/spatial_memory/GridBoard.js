import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var GridBoard = React.createClass({
  getBrickArr(positions, gridSize){
    var bricks = new Array(gridSize * gridSize);
    for(let ij of positions){
      ij = ij.split(',');
      let i = Number(ij[0]);
      let j = Number(ij[1]);
      bricks[i * gridSize + j] = true;
    }
    return bricks;
  },
  getRows(positions, size, gridSize){
    var bricks = this.getBrickArr(positions, gridSize);
    var brickSize = (size * 0.9) / gridSize;
    var baseBrickStyle={
      height: brickSize,
      width: brickSize,
      margin: 1,
      display: 'inline-block'
    }
    var rows = [];
    for(let i=0; i<gridSize; i++){
      var cols = [];
      for(let j=0; j<gridSize; j++){
        var id = i + ',' + j;
        let idx = i * gridSize + j;
        var brickStyle = Object.assign({}, baseBrickStyle);
        if(bricks[idx] === true){
          brickStyle.backgroundColor = '#000';
        }
        var brick = (<div id={id} key={j} style={brickStyle}/>);
        cols.push(brick);
      }
      var row = (<div key={i} style={{textAlign: 'center', maxHeight: brickSize}}>{cols}</div>);
      rows.push(row);
    }
    return rows;
  },
  render(){
    var specs = this.props.specs;
    var size = Math.min(specs.height, specs.width);
    var verticalPadding = (specs.height-size)/2;
    var horizentalPadding = (specs.width-size)/2;
    var gridStyle = {
      minHeight: specs.height,
      minWidth: specs.width,
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizentalPadding,
      paddingRight: horizentalPadding,
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return (
        <Grid
          style={gridStyle}
          onTouchStart={this.props.onClick}
        >
          {this.getRows(this.props.positions, size, this.props.gridSize)}
        </Grid>
      );
    }else{
      return (
        <Grid
          style={gridStyle}
          onClick={this.props.onClick}
        >
          {this.getRows(this.props.positions, size, this.props.gridSize)}
        </Grid>
      );

    }
  },
});


module.exports = GridBoard;
