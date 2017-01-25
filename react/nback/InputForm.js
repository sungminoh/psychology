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
      numberOfGames:12,
      isValidNumberOfGames: true,
      numberOfTrialsPerGame: 12,
      isValidNumberOfTrialsPerGame: true,
      numberOfPractices: 3,
      isValidNumberOfPractices: true,
      numberOfTrialsPerPractice: 12,
      isValidNumberOfTrialsPerPractice: true,
      hitRatio: 25,
      isValidHitRatio: true,
      expose: 800,
      isValidExpose: true,
      blink: 200,
      isValidBlink: true,
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

  changeNumberOfGames(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfGames: !isNaN(parsedValue) && parsedValue > 0});
    this.setState({ numberOfGames: e.target.value });
  },

  changeNumberOfTrialsPerGame(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({ isValidNumberOfTrialsPerGame: !isNaN(parsedValue) && parsedValue > 0});
    this.setState({ numberOfTrialsPerGame: e.target.value });
  },


  changeNumberOfPractices(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfPractices: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ numberOfPractices: e.target.value });
  },

  changeNumberOfTrialsPerPractice(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfTrialsPerPractice: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ numberOfTrialsPerPractice: e.target.value });
  },

  changeHitRatio(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidHitRatio: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ hitRatio: e.target.value });
  },

  changeExpose(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidExpose: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ expose: e.target.value });
  },

  changeBlink(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidBlink: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ blink: e.target.value });
  },

  changeInterval(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidInterval: !isNaN(parsedValue) && parsedValue >= 0});
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
        <FormGroup validationState={this.getValidationState('isValidNumberOfTrialsPerGame')} >
          <ControlLabel>게임당 횟수:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.numberOfTrialsPerGame}
            onChange={this.changeNumberOfTrialsPerGame}
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
        <FormGroup validationState={this.getValidationState('isValidNumberOfTrialsPerPractice')} >
          <ControlLabel>연습당 횟수:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.numberOfTrialsPerPractice}
            onChange={this.changeNumberOfTrialsPerPractice}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidHitRatio')} >
          <ControlLabel>일치 비율(%):</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.hitRatio}
            onChange={this.changeHitRatio}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidId
            || !this.state.isValidNumberOfGames
            || !this.state.isValidNumberOfTrialsPerGame
            || !this.state.isValidNumberOfPractices
            || !this.state.isValidNumberOfTrialsPerPractice
            || !this.state.isValidHitRatio
            || !this.state.isValidExpose
            || !this.state.isValidBlink
            || !this.state.isValidInterval
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        {' '}
        <FormGroup validationState={this.getValidationState('isValidExpose')} >
          <ControlLabel>노출 시간:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.expose}
            onChange={this.changeExpose}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidBlink')} >
          <ControlLabel>빈화면 시간:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.blink}
            onChange={this.changeBlink}
          />
          <FormControl.Feedback/>
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
