import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Row, Grid, Col} from 'react-bootstrap';
import Button from '../common/Button';


var ResponseButton = React.createClass({
  onClickHandler(e){
    this.props.callback(e.target.value);
  },
  render(){
    var buttonStyle = {
      width: '50%',
      height: '100%',
      fontSize: this.props.specs.height / 2
    };
    var selectedButtonStyle = {
      backgroundColor: 'red',
      width: '50%',
      height: '100%',
      fontSize: this.props.specs.height / 2
    };
    return(
      <div style={{width:'100%', height:'100%'}}>
        <Button
          id='0'
          style={this.props.selected == this.props.value[0] ? selectedButtonStyle : buttonStyle}
          value={this.props.value[0]}
          disabled={this.props.selected == this.props.value[1]}
          onClick={this.onClickHandler}
        >
          {this.props.text[0]}
        </Button>
        <Button
          id='1'
          style={this.props.selected == this.props.value[1] ? selectedButtonStyle : buttonStyle}
          value={this.props.value[1]}
          disabled={this.props.selected == this.props.value[0]}
          onClick={this.onClickHandler}
        >
          {this.props.text[1]}
        </Button>
      </div>
    );
  }
});

module.exports = ResponseButton;
