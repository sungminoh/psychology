import React from 'react';
import { clone } from '../helpers';
import { Grid, Row, Col } from 'react-bootstrap';


var Target = React.createClass({
  render(){
    var specs = this.props.specs;
    var size = Math.min(specs.height, specs.width);
    var verticalPadding = (specs.height-size)/2;
    var horizentalPadding = (specs.width-size)/2;
    var textStyle = { fontSize: specs.height/5, textAlign: 'center' };
    var stopStyle = clone(textStyle);
    stopStyle['color'] = 'red';
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
        <Row style={{marginTop: specs.height/4}}>
          <Col xs={4} style={textStyle}>
            {this.props.location == 'left' ? 'O' : ''}
          </Col>
          <Col xs={4} style={stopStyle}>
            {this.props.stop ? 'O' : ''}
          </Col>
          <Col xs={4} style={textStyle}>
            {this.props.location == 'right' ? 'O' : ''}
          </Col>
        </Row>
      </Grid>
    );
  },
  componentDidMount(){
    for(var i=0; i<this.props.times.length; i++){
      if(this.props.times[i]){
        this.props.timeoutList.push(setTimeout(this.props.onExpireds[i], this.props.times[i]));
      }
    }
  },
});


module.exports = Target;
