import React from 'react';
import Checkbox from 'rc-checkbox';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';
import 'rc-checkbox/assets/index.css';

var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      id: '',
      isValidId: false,
      numberOfGames:120,
      isValidNumberOfGames: true,
      numberOfPractices: 12,
      isValidNumberOfPractices: true,
      stopDelay: 300,
      isValidStopDelay: true,
      stopRatio: 25,
      isValidStopRatio: true,
      fixation: 700,
      isValidFixation: true,
      blink: 200,
      isValidBlink: true,
      wait: 1000,
      isValidWait: true,
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

  changeStopDelay(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidStopDelay: !isNaN(parsedValue) && parsedValue >= 40});
    this.setState({ stopDelay: e.target.value });
  },

  changeStopRatio(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidStopRatio: !isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100});
    this.setState({ stopRatio: e.target.value });
  },


  changeFixation(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidFixation: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ fixation: e.target.value });
  },

  changeBlink(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidBlink: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ blink: e.target.value });
  },

  changeWait(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidWait: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ wait: e.target.value });
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
        <FormGroup validationState={this.getValidationState('isValidStopDelay')} >
          <ControlLabel>정지신호 제시 시점:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.stopDelay}
            onChange={this.changeStopDelay}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidStopRatio')} >
          <ControlLabel>정지신호 제시 비율(%):</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.stopRatio}
            onChange={this.changeStopRatio}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidNumberOfGames
              || !this.state.isValidId
              || !this.state.isValidNumberOfPractices
              || !this.state.isValidStopDelay
              || !this.state.isValidStopRatio
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        {' '}
        <FormGroup validationState={this.getValidationState('isValidFixation')} >
          <ControlLabel>픽세이션:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.fixation}
            onChange={this.changeFixation}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidBlink')} >
          <ControlLabel>빈 화면:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.blink}
            onChange={this.changeBlink}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidWait')} >
          <ControlLabel>응답 대기 시간:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.wait}
            onChange={this.changeWait}
          />
          <FormControl.Feedback/>
        </FormGroup>
      </Form>
    );
  }
});

module.exports = InputForm;
