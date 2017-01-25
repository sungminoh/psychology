import React from 'react';
import Checkbox from 'rc-checkbox';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';
import 'rc-checkbox/assets/index.css';

var RotationCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={0} defaultChecked /><br/>0</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={60} defaultChecked /><br/>60</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={120} defaultChecked /><br/>120</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={180} defaultChecked /><br/>180</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={240} defaultChecked /><br/>240</label>{' '}</Col>
        <Col xs={1}><label><Checkbox className='rotations' onChange={this.props.onChange} value={300} defaultChecked /><br/>300</label>{' '}</Col>
      </Grid>
    );
  }
});

var CharacterCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='characters' onChange={this.props.onChange} value={'char'} defaultChecked /><br/>ㅋ</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='characters' onChange={this.props.onChange} value={'num'} defaultChecked /><br/>5</label> {' '}</Col>
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
      numberOfGames: 64,
      isValidNumberOfGames: true,
      numberOfPractices: 10,
      isValidNumberOfPractices: true,
      rotations: new Set([0,60,120,180,240,300]),
      rotationsSize: 4,
      characters: new Set(['char', 'num']),
      charactersSize: 2,
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
        <FormGroup validationState={this.getValidationState('rotations')}>
          <ControlLabel>회전:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={RotationCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('characters')}>
          <ControlLabel>자극:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={CharacterCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
        {' '}
        <FormGroup>
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidNumberOfGames
              || !this.state.isValidId
              || !this.state.isValidNumberOfPractices
              || !this.state.rotationsSize
              || !this.state.charactersSize
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
