import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var ColorGrid = React.createClass({
  getRows(pallet, size){
    var number = Math.sqrt(pallet.length);
    var brickSize = (size*0.9)/number;
    var rows = [];
    for(var i=0; i<number; i++){
      var cols = [];
      for(var j=0; j<number; j++){
        var idx = number*i+j;
        var brickStyle={
          height: brickSize,
          width: brickSize,
          margin: 1,
          backgroundColor: pallet[idx],
          display: 'inline-block'
        }
        var brick = (
          <div key={j} style={brickStyle}/>
        );
        cols.push(brick);
      }
      var row = <div key={i} style={{textAlign: 'center', maxHeight: brickSize}}>{cols}</div>;
      rows.push(row);
    }
    return rows;
  },
  render(){
    var specs = this.props.specs;
    var size = Math.min(specs.height, specs.width);
    var verticalPadding = (specs.height-size)/2;
    var horizentalPadding = (specs.width-size)/2;
    return(
      <Grid
        style={{
          minHeight: specs.height,
          minWidth: specs.width,
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          paddingLeft: horizentalPadding,
          paddingRight: horizentalPadding,
        }}
      >
        {this.getRows(this.props.pallet, size)}
      </Grid>
    );
  },
  componentDidMount(){
    if(this.props.afterMilliseconds){
      setTimeout(this.props.onExpired, this.props.afterMilliseconds);
    }
  },
  componentDidUpdate(){
    this.componentDidMount();
  }

});


module.exports = ColorGrid;
