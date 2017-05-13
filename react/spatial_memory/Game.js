import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import GridBoard from './GridBoard'
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { clone, random, makeUrl, setAttrByObj, genAppearanceSeq } from '../helpers';
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '../common/Button';


var Game = React.createClass({
  getInitialState() { // component states
    return {
      // game status
      game: false,
      gameDone: false,
      gameTrialDone: false,
      practice: false,
      practiceDone: false,
      practiceTrialDone: false,
      countdown: false,
      targetDisplaying: false,
      targetDisplayed: new Set(),
      // for game panel size
      windowHeight: 0,
      windowWidth: 0,
      responseHeight: 0,
      maxSize: 0,
    };
  },
  isNotStarted() {
    return !this.state.game && !this.state.practice;
  },
  isAllDone() {
    return this.state.gameDone;
  },
  isGame() {
    return this.state.game && !this.state.practice;
  },
  isPractice() {
    return !this.state.game && this.state.practice;
  },
  isTrialsDone() {
    return this.state.gameTrialDone || this.state.practiceTrialDone;
  },
  isCountdown() {
    return this.state.countdown;
  },
  isDisplaying() {
    return this.state.targetDisplaying;
  },
  hasNextTarget() {
    return (this.isGame() && (this.currentGameIdx < this.currentGameSeqLength)) ||
      (this.isPractice() && (this.currentPracticeIdx < this.currentPracticeSeqLength))
  },
  isLastTargetDisplaying() {
    return (this.isGame() && (this.currentGameIdx == this.currentGameSeqLength)) ||
      (this.isPractice() && (this.currentPracticeIdx == this.currentPracticeSeqLength))
  },
  isPracticeDone() {
    return this.state.practiceDone;
  },
  isPracticeTrialsDone() {
    return (this.state.practice && this.state.practiceTrialDone) || this.state.practiceDone;
  },
  isBeforeN() {
    return this.state.beforeN;
  },

  componentWillMount(){ // component attributes
    // from inputbox
    this.id = '';
    this.numberOfGames = 0;
    this.numberOfPractices = 0;
    this.speed = 0;
    this.gridSize = 4;
    // game information
    this.gameIdx = 0;
    this.gameSeqLengths = [];
    this.gameSeqLengthIdx = 0;
    this.currentGameSeq = [];
    this.currentGameIdx = 0;
    this.currentGameSeqLength = 0;
    // practice information
    this.practiceIdx = 0;
    this.practiceSeqLengths = [];
    this.practiceSeqLengthIdx = 0;
    this.currentPracticeSeq = [];
    this.currentPracticeIdx = 0;
    this.currentPracticeSeqLength = 0;
    // user answers
    this.currentUserTrial = 0;
    this.currentUserTrials = [];
    // for result
    this.gameSeq = [];
    this.userTrials = [];
    // to handle timeouts
    this.timeoutList = [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
  },
  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/history/spatial_memory') });
  },
  getInputForm(){
    var historyButton = ( <Button onClick={this.redirectToHistory} > 기록 보기 </Button>);
    return ( <InputForm onClick={this.onClickStart} additionalButtons={historyButton} />);
  },
  onClickStart(props){ // triggered by inputform
    setAttrByObj(this, props)
    this.setState({
      // game status (game, practice are mutually exclusive)
      game: props.numberOfPractices == '0' ? true : false,
      gameDone: false,
      gameTrialDone: false,
      practice: props.numberOfPractices == '0' ? false: true,
      practiceDone: false,
      practiceTrialDone: false,
      countdown: true,
      targetDisplaying: false,
      targetDsiplayed: [],
    });
  },
  getCountdownTimer(s){
    return <CountdownTimer sec={s} onExpired={this.startTrials} />;
  },
  startTrials(){
    this.currentUserTrial = 0;
    this.currentUserTrials  = [];
    if(this.isGame()){
      this.currentGameSeqLength = this.gameSeqLengths[this.gameSeqLengthIdx++];
      this.currentGameSeq = genAppearanceSeq(this.currentGameSeqLength, this.gridSize);
      this.currentGameIdx = 0;
    }else if(this.isPractice()){
      this.currentPracticeSeqLength = this.practiceSeqLengths[this.practiceSeqLengthIdx++];
      this.currentPracticeSeq = genAppearanceSeq(this.currentPracticeSeqLength, this.gridSize);
      this.currentPracticeIdx = 0;
    }
    this.setNextState({
      practiceTrialDone: false,
      gameTrialDone: false,
      targetDisplaying: true,
      targetDisplayed: new Set(),
      countdown:  false
    });
  },
  startTouch(){
    if(this.isGame()){
      this.currentGameIdx = 0;
    }else{
      this.currentPracticeIdx = 0;
    }
    this.setState({
      targetDisplaying: false,
      targetDisplayed: new Set()
    });
  },
  render(){
    // before start game, get inputs
    if(this.isNotStarted()){
      return this.getInputForm();
    }
    // after end of game, show results
    if(this.isAllDone()){
      return this.getResult();
    }
    // countdown
    if(this.isCountdown()){
      //return <div> {this.getCountdownTimer(3)} </div>;
      return (
        <div>
          <div>{this.getGuide()}</div>
          <div>{this.getButton()}</div>
        </div>
      )
    }
    // game or practice
    // if it is exposing targets
    if(this.isDisplaying()){
      if(this.hasNextTarget()) {
        // set timeout for next target
        setTimeout(this.nextTarget, this.speed);
      }else if(this.isLastTargetDisplaying()){
        // if this target is the last one, then next state would be getting user input
        setTimeout(this.startTouch, this.speed);
      }
    }
    if(this.isPracticeTrialsDone()){
      return (
        <div>
          {this.getFeedback()}
          {this.getButton()}
        </div>
      )
    }
    return(
      <div>
        {this.getTargets()}
        {this.getButton()}
      </div>
    );
  },
  nextTarget(){
    if(this.isGame()){
      this.setState({targetDisplayed: this.state.targetDisplayed.add(this.currentGameSeq[this.currentGameIdx++])});
    }else{
      this.setState({targetDisplayed: this.state.targetDisplayed.add(this.currentPracticeSeq[this.currentPracticeIdx++])});
    }
  },
  getTargets(){
    var gridBoard = (<GridBoard gridSize={this.gridSize}
      specs={{height: this.state.windowHeight, width: this.state.windowWidth}}
      positions={this.state.targetDisplayed}
      onClick={this.handleClick}
      />);
    return gridBoard;
  },
  handleClick(e){
    if(this.isDisplaying()) return;
    var position = e.target.id;
    var isColored = e.target.style.backgroundColor;
    if(!position || isColored) return;
    this.checkAnswer(position);
  },
  checkAnswer(position){
    this.currentUserTrial++;
    if(this.isGame()){
      if(position == this.currentGameSeq[this.currentGameIdx]){
        this.currentUserTrials.push(this.currentUserTrial);
        this.currentGameIdx ++;
        this.currentUserTrial = 0;
        //let gameTrialDone = !this.hasNextTarget();
        this.setNextState({
          targetDisplayed: this.state.targetDisplayed.add(position)
        })
      }else{
        this.blink(position);
      }
    }else{
      if(position == this.currentPracticeSeq[this.currentPracticeIdx]){
        this.currentUserTrials.push(this.currentUserTrial);
        this.currentPracticeIdx ++;
        this.currentUserTrial = 0;
        //let practiceTrialDone = !this.hasNextTarget();
        this.setNextState({
          targetDisplayed: this.state.targetDisplayed.add(position)
        })
      }else{
        this.blink(position);
      }
    }
  },
  blink(position){
    this.setState({
      targetDisplayed: this.state.targetDisplayed.add(position)
    });
    setTimeout(() => {
      this.state.targetDisplayed.delete(position);
      this.setState({
        targetDisplayed: this.state.targetDisplayed
      });
    }, 100);
  },
  getButton(){
    var divStyle = {
      height: this.state.responseHeight,
      width: '100%',
      position: 'absolute',
      bottom: 0
    };
    var buttonStyle = {
      width:'100%',
      height:'100%',
      fontSize: this.state.responseHeight/2
    }
    // done with all practices
    if(this.isPracticeDone() || this.isCountdown()){
      var buttonStyleRed = clone(buttonStyle);
      buttonStyleRed.color = 'red';
      return (
        <div style={divStyle}>
          <Button style={buttonStyleRed} onClick={this.startTrials} >
            {this.state.practiceDone ? '게임 시작' : '연습 시작'}
          </Button>
        </div>
      );
    }
    // end of trials set
    else if(this.isTrialsDone()){
      var button = <Button style={buttonStyle} onClick={this.startTrials} > 다음 게임 </Button>;
      return <div style={divStyle}> {button} </div>;
    }
    return;
  },
  setNextState(additionalInfo){
    var state = {};
    if(this.state.practice){
      state.practiceTrialDone = !this.hasNextTarget();
      state.practiceDone = state.practiceTrialDone && this.practiceSeqLengthIdx >= this.practiceSeqLengths.length;
      state.game = state.practiceDone;
      state.practice = !state.practiceDone;
    }else if(this.state.game){
      state.gameTrialDone = !this.hasNextTarget();
      if(state.gameTrialDone){
        this.gameSeq.push(this.currentGameSeq);
        this.userTrials.push(this.currentUserTrials);
      }
      state.gameDone = state.gameTrialDone && this.gameSeqLengthIdx >= this.gameSeqLengths.length;
      state.practiceTrialDone = false;
      state.practiceDone = false;
      state.practice = false;
    }
    setAttrByObj(state, additionalInfo, true);
    this.setState(state);
  },
  getFeedback(){
    var numberOfTrials = this.currentUserTrials.reduce((sum, numberOfTrials) => (sum += numberOfTrials), 0);
    var score = numberOfTrials + "/" + this.currentPracticeSeqLength;
    return (<span
      style={{
        fontSize: this.state.maxSize/5,
          marginTop: this.state.windowHeight * 0.25,
          textAlign: 'center',
          display: 'block'
      }} >
      {score}
    </span>
    );
  },
  getGuide(){
    let guide = ['검은 상자가 하나씩 나타났다가 사라집니다.', '등장하는 순서대로 정확히 눌러주세요'];
    return (<span
      style={{
        fontSize: this.state.maxSize/20,
        width: '100%',
        top: this.state.maxSize*0.3,
        textAlign: 'center',
        display: 'block',
        position: 'absolute'
      }} >
      {guide.map((s, i) => (<div key={i}>{s}</div>))}
    </span>
    );
  },
  redirectToHome(){
    this.props.router.push({ pathname: makeUrl('/') });
  },
  getResult(){
    return (
      <Result
        testId={this.id}
        numberOfGames={this.numberOfGames}
        gameSeq={this.gameSeq}
        userTrials={this.userTrials}
        speed={this.speed}
        reset={this.resetComponent}
        home={this.redirectToHome}
      />
    );
  },
  setWindowSize(){
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var responseHeight = Math.max(windowHeight*0.2, 50);
    if(this.state.windowHeight != windowHeight ||
      this.state.windowWidth != windowWidth ||
      this.state.responseHeight != responseHeight){
      this.setState({
        windowHeight: windowHeight,
        windowWidth: windowWidth,
        responseHeight: responseHeight,
        maxSize: Math.min(windowHeight, windowWidth)
      });
    }
  },
  componentDidUpdate(prevProps, prevState){
    // when number appears, it should be disappear after a few seconds expose
    //if(!prevState.targetDisplay && this.state.targetDisplay){
      //this.timeoutList.push(setTimeout(x => {this.setState({targetDisplay: false});}, this.expose));
    //}
    // when number dispears, it should check answer and call next number after short blink
    //if(prevState.targetDisplay && !this.state.targetDisplay){
      //this.timeoutList.push(setTimeout(this.nextNumber(), this.blink));
    //}
    this.setWindowSize();
  },
});

module.exports = Game;
