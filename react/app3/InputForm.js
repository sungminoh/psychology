import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';


var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      id: '',
      isValidId: false,
      numberOfGames: 120,
      isValidNumberOfGames: true,
      numberOfPractices: 12,
      isValidNumberOfPractices: true,
      ratio: 25,
      isValidRatio: true,
      interval: 1000,
      isValidInterval: true,
    };
  },

  getValidationState(t) {
    if (this.state[t]){
      return 'success';
    }else{
      return 'error';
    }
  },

  changeId(e){
    if(e.target.value.length != 0){
      this.setState({isValidId: true, id: e.target.value });
    }else{
      this.setState({isValidId: false, id: e.target.value });
    }
  },

  changeRatio(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidRatio: !isNaN(parsedValue) && parsedValue >= 0 && parsedValue < 100
    });
    this.setState({ ratio: e.target.value });
  },

  changeNumberOfGames(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfGames: !isNaN(parsedValue) && parsedValue > 0});
    this.setState({ numberOfGames: e.target.value });
  },

  changeNumberOfPractices(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfPractices: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ numberOfPractices: e.target.value });
  },

  changeInterval(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidInterval: !isNaN(parsedValue) && parsedValue > 0});
    this.setState({ interval: e.target.value });
  },


  startGame(){
    this.props.onClick(this.state);
  },

  render() {
    return (
      <Form style={{margin: 10}}>
        <FormGroup validationState={this.getValidationState('isValidId')} >
          <ControlLabel>실험 아이디:</ControlLabel>
          {' '}
          <FormControl
            type='text'
            placeholder={'아이디를 입력하세요.'}
            onChange={this.changeId}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidNumberOfGames')} >
          <ControlLabel>게임 횟수:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.numberOfGames}
            onChange={this.changeNumberOfGames}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidNumberOfPractices')} >
          <ControlLabel>연습 횟수:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.numberOfPractices}
            onChange={this.changeNumberOfPractices}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidRatio')} >
          <ControlLabel>변경 비율(%):</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.ratio}
            onChange={this.changeRatio}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup>
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidNumberOfGames
              || !this.state.isValidId
              || !this.state.isValidNumberOfPractices
              || !this.state.isValidRatio
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidInterval')} >
          <ControlLabel>간격 시간:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.interval}
            onChange={this.changeInterval}
          />
          <FormControl.Feedback/>
        </FormGroup>
      </Form>
    );
  }
});

module.exports = InputForm;
