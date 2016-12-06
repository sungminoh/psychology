import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';


var ResponseButton = React.createClass({
  render(){
    var buttonStyle = {
      width: '50%',
      height: '100%',
      fontSize: this.props.specs.height / 2
    };
    return(
      <div style={{width:'100%', height:'100%'}}>
        <Button
          style={buttonStyle}
          value={this.props.value[0]}
          disabled={this.props.disabled}
          onClick={this.props.callback}
        >
          {this.props.text[0]}
        </Button>
        <Button
          style={buttonStyle}
          value={this.props.value[1]}
          disabled={this.props.disabled}
          onClick={this.props.callback}
        >
          {this.props.text[1]}
        </Button>
      </div>
    );
  }
});

module.exports = ResponseButton;
