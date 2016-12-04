import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var NumberGrid = React.createClass({
  getRows(numbers, size){
    var quantity = numbers[0];
    var value = numbers[1];
    var number = Math.sqrt(9);
    var brickSize = (size*0.9)/number;
    var rows = [];
    for(var i=0; i<number; i++){
      var cols = [];
      for(var j=0; j<number; j++){
        var idx = number*i+j;
        var brickStyle={
          height: brickSize,
          fontSize: brickSize/2,
          display: 'inline-block'
        }
        var brick;
        if(quantity-- > 0){ brick = ( <Col xs={4} sm={4} key={j} style={brickStyle}>{value}</Col>); }
        else{ brick = ( <Col xs={4} sm={4} key={j} style={brickStyle}/>);}
        cols.push(brick);
      }
      var row = <Row key={i} style={{textAlign: 'center', maxHeight: brickSize}}>{cols}</Row>;
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
        {this.getRows(this.props.numbers, size)}
      </Grid>
    );
  },
});


module.exports = NumberGrid;
