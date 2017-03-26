import React from 'react';
import Checkbox from 'rc-checkbox';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';
import 'rc-checkbox/assets/index.css';
import { clone, expand } from '../helpers.js'

var NbackCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={1} defaultChecked /><br/>1</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={2} defaultChecked /><br/>2</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={3} defaultChecked /><br/>3</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={4} /><br/>4</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={5} /><br/>5</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='nbacks' onChange={this.props.onChange} value={6} /><br/>6</label>{' '}</Col>
      </Grid>
    );
  }
});


var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },
  // test
  //componentDidMount(){
    //var nbacks = Array.from(this.state.nbacks);
    //var state = clone(this.state);
    //state.gameNbackTypes = expand(nbacks, state.numberOfGames).sort()
    //state.practiceNbackTypes = expand(nbacks, state.numberOfPractices).sort()
    //this.props.onClick(state);
  //},

  getInitialState() {
    return {
      id: '',
      isValidId: false,
      numberOfGames: 3, // 12
      isValidNumberOfGames: true,
      numberOfTrialsPerGame: 3, //12
      isValidNumberOfTrialsPerGame: true,
      numberOfPractices: 3, // 3
      isValidNumberOfPractices: true,
      numberOfTrialsPerPractice: 3, // 12
      isValidNumberOfTrialsPerPractice: true,
      nbacks: new Set([1,2,3]),
      nbacksSize: 3,
      hitRatio: 25,
      isValidHitRatio: true,
      expose: 10, // 800
      isValidExpose: true,
      blink: 10, // 200
      isValidBlink: true,
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

  changeCheckbox(e){
    var name = e.target.className;
    var checked = e.target.checked;
    var value = e.target.value;
    if(checked){
      this.state[name].add(value);
    }else{
      this.state[name].delete(value);
    }
    var stateObj = {};
    stateObj[name+'Size'] = this.state[name].size;
    this.setState(stateObj);
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

  startGame(){
    var nbacks = Array.from(this.state.nbacks);
    var state = clone(this.state);
    state.gameNbackTypes = expand(nbacks, state.numberOfGames).sort()
    state.practiceNbackTypes = expand(nbacks, state.numberOfPractices).sort()
    this.props.onClick(state);
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
        <FormGroup validationState={this.getValidationState('nbacks')} >
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
          <ControlLabel>게임 길이:</ControlLabel>
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
          <ControlLabel>연습 길이:</ControlLabel>
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
            || !this.state.nbacksSize
            || !this.state.isValidHitRatio
            || !this.state.isValidExpose
            || !this.state.isValidBlink
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        {' '}
        <FormGroup validationState={this.getValidationState('nbacksSize')}>
          <ControlLabel>자극:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={NbackCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
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
      </Form>
    );
  }
});

module.exports = InputForm;
