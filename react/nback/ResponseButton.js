import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';


var ResponseButton = React.createClass({
  getInitialState(){
    return(
      disabled0: false,
      disabled1: false
    );
  },
  onClickHandler(e){
    this.props.callback(e.target.value);
    if(e.target.id == '0'){
      this.setState({
        disabled0: true,
        disabled1: false
      });
    }else if(e.target.id == '1'){
      this.setState({
        disabled0: false,
        disabled1: true
      });
    }
  },
  render(){
    var buttonStyle = {
      width: '50%',
      height: '100%',
      fontSize: this.props.specs.height / 2
    };
    return(
      <div style={{width:'100%', height:'100%'}}>
        <Button
          id='0'
          style={buttonStyle}
          value={this.props.value[0]}
          disabled={this.state.disabled0}
          onClick={this.onClickHandler}
          onTouchStart={this.onClickHandler}
        >
          {this.props.text[0]}
        </Button>
        <Button
          id='1'
          style={buttonStyle}
          value={this.props.value[1]}
          disabled={this.state.disabled1}
          onClick={this.onClickHandler}
          onTouchStart={this.onClickHandler}
        >
          {this.props.text[1]}
        </Button>
      </div>
    );
  }
});

module.exports = ResponseButton;
