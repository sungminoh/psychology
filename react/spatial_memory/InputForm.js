import React from 'react';
import Checkbox from 'rc-checkbox';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row, Grid, Col} from 'react-bootstrap';
import 'rc-checkbox/assets/index.css';
import { clone, expand } from '../helpers.js'

var SeqLengthCheckboxGroup = React.createClass({
  render(){
    return(
      <Grid>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={3} defaultChecked /><br/>3</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={4} defaultChecked /><br/>4</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={5} defaultChecked /><br/>5</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={6} defaultChecked /><br/>6</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={7} defaultChecked /><br/>7</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={8} defaultChecked /><br/>8</label> {' '}</Col>
        <Col xs={1}><label><Checkbox className='seqLengths' onChange={this.props.onChange} value={9} defaultChecked /><br/>9</label> {' '}</Col>
      </Grid>
    );
  }
});


var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },
  //test
  //componentDidMount(){
    //this.props.onClick(state);
  //},

  getInitialState() {
    return {
      id: '',
      isValidId: false,
      numberOfGames: 63,
      isValidNumberOfGames: true,
      numberOfPractices: 2,
      isValidNumberOfPractices: true,
      seqLengths: new Set([3, 4, 5, 6, 7, 8, 9]),
      seqLengthsSize: 7,
      isValidSeqLengths: true,
      speed: 1000,
      isValidSpeed: true,
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
    this.setState({ numberOfGames: parsedValue });
  },

  changeNumberOfPractices(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidNumberOfPractices: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ numberOfPractices: parsedValue });
  },

  changeCheckbox(e){
    var name = e.target.className;
    var checked = e.target.checked;
    var value = parseInt(e.target.value);
    if(checked){
      this.state[name].add(value);
    }else{
      this.state[name].delete(value);
    }
    var stateObj = {};
    stateObj[name+'Size'] = this.state[name].size;
    this.setState(stateObj);
  },

  changeSpeed(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({isValidSpeed: !isNaN(parsedValue) && parsedValue >= 0});
    this.setState({ speed: parsedValue });
  },

  startGame(){
    var seqLengths = Array.from(this.state.seqLengths);
    var state = clone(this.state);
    state.gameSeqLengths = expand(seqLengths, state.numberOfGames).sort();
    state.practiceSeqLengths = expand(seqLengths, state.numberOfPractices).sort();
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
        <Button
          onClick={this.startGame}
          disabled={
            !this.state.isValidId
            || !this.state.isValidNumberOfGames
            || !this.state.isValidNumberOfPractices
            || !this.state.isValidSeqLengths
            || !this.state.isValidSpeed
          }
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
        {' '}
        <FormGroup validationState={this.getValidationState('seqLengthsSize')}>
          <ControlLabel>시퀀스 길이:</ControlLabel> {' '}
          {' '}
          <FormControl
            componentClass={SeqLengthCheckboxGroup}
            onChange={this.changeCheckbox}
          />
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState('isValidSpeed')} >
          <ControlLabel>등장 속도:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.speed}
            onChange={this.changeSpeed}
          />
          <FormControl.Feedback/>
        </FormGroup>
      </Form>
    );
  }
});

module.exports = InputForm;
