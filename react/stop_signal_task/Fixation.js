import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';


var Fixation = React.createClass({
  render(){
    var specs = this.props.specs;
    var size = Math.min(specs.height, specs.width);
    var verticalPadding = (specs.height-size)/2;
    var horizentalPadding = (specs.width-size)/2;
    var textStyle = { fontSize: specs.height/5, textAlign: 'center' };
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
          <Col xs={4} md={4} style={textStyle}>
            {' '}
          </Col>
          <Col xs={4} md={4} style={textStyle}>
            +
          </Col>
          <Col xs={4} md={4} style={textStyle}>
            {' '}
          </Col>
        </Row>
      </Grid>
    );
  },
  componentDidMount(){
    setTimeout(this.props.onExpired, this.props.expireAfter);
  },
  componentWillUnmount(){
    setTimeout(this.props.onUnmount, this.props.afterUnmount)
  }
})

module.exports = Fixation;
