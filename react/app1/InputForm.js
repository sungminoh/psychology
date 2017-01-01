import React from 'react';
import Checkbox from 'rc-checkbox';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';
import 'rc-checkbox/assets/index.css';

var GameCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={2} defaultChecked /><br/>2</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={4} defaultChecked /><br/>4</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={6} defaultChecked /><br/>6</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={8} defaultChecked /><br/>8</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={10} /><br/>10</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={12} /><br/>12</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={14} /><br/>14</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfGame' onChange={this.props.onChange} value={16} /><br/>16</label>{' '}</Col>
      </Grid>
    );
  }
});

var PracticeCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={2} defaultChecked /><br/>2</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={4} defaultChecked /><br/>4</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={6} /><br/>6</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={8} /><br/>8</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={10} /><br/>10</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={12} /><br/>12</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={14} /><br/>14</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='boxesOfPractice' onChange={this.props.onChange} value={16} /><br/>16</label>{' '}</Col>
      </Grid>
    );
  }
});


var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      id: '',
      isValidId: false,
      length: 8,
      isValidLength: true,
      numberOfGames: 64,
      isValidNumberOfGames: true,
      numberOfPractices: 12,
      isValidNumberOfPractices: true,
      boxesOfGame: new Set([2,4,6,8]),
      boxesOfGameSize: 4,
      boxesOfPractice: new Set([2,4]),
      boxesOfPracticeSize: 2,
      interval: 1000,
      isValidInterval: true,
      blink: 900,
      isValidBlink: true,
      expose: 100,
      isValidExpose: true,
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

  changeExpose(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidExpose: !isNaN(parsedValue) && parsedValue > 0,
      expose: e.target.value
    });
  },

  changeBlink(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidBlink: !isNaN(parsedValue) && parsedValue > 0,
      blink: e.target.value
    });
  },

  changeInterval(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidInterval: !isNaN(parsedValue) && parsedValue > 0,
      interval: e.target.value
    });
  },

  changeLength(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidLength: !isNaN(parsedValue) && parsedValue > 0,
      length: e.target.value
    });
  },

  changeNumberOfGames(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidNumberOfGames: !isNaN(parsedValue) && parsedValue > 0,
      numberOfGames: e.target.value
    });
  },

  changeNumberOfPractices(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({
      isValidNumberOfPractices: !isNaN(parsedValue) && parsedValue >= 0,
      numberOfPractices: e.target.value
    });
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
        <FormGroup validationState={this.getValidationState('boxesOfGameSize')}>
          <ControlLabel>게임 박스 수:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={GameCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('boxesOfPracticeSize')}>
          <ControlLabel>연습 박스 수:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={PracticeCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
        {' '}
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidNumberOfGames
              || !this.state.isValidId
              || !this.state.isValidNumberOfPractices
              || !this.state.boxesOfGame.size
              || !this.state.boxesOfPractice.size
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        {' '}
        <FormGroup validationState={this.getValidationState('isValidLength')} >
          <ControlLabel>한변의 길이:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.length}
            onChange={this.changeLength}
          />
          <FormControl.Feedback/>
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
