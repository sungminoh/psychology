import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { clone, random, makeUrl, genNBackSeq, setAttrByObj } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var Game = React.createClass({
  getInitialState() { // component states
    return {
      // game status
      game: false,
      gameDone: false,
      gameTrialsDone: false,
      practice: false,
      practiceDone: false,
      practiceTrialsDone: false,
      countdown: false,
      numberDisplay: false,
      beforeN: true,
      selectedReaction: 'none',
      // for game panel size
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
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
    return this.state.gameTrialsDone || this.state.practiceTrialsDone;
  },
  isCountdown() {
    return this.state.countdown;
  },
  isPracticeDone() {
    return this.state.practiceDone;
  },
  isPracticeTrialsDone() {
    return (this.state.practice && this.state.practiceTrialsDone) || this.state.practiceDone;
  },
  isBeforeN() {
    return this.state.beforeN;
  },

  componentWillMount(){ // component attributes
    // from inputbox
    this.id = '';
    this.numberOfGames = 0;
    this.numberOfTrialsPerGame = 0;
    this.numberOfPractices = 0;
    this.numberOfTrialsPerPractice = 0;
    this.hitRatio = 0;
    this.expose = 0;
    this.blink = 0;
    // game information
    this.gameNbackTypes = [];
    this.gameNbackIdx = 0;
    this.currentGameNback = 0;
    this.gameIdx = 0;
    this.gameNumberSeq = [];
    this.gameHitSeq = [];
    // practice information
    this.practiceNbackTypes = [];
    this.practiceNbackIdx = 0;
    this.currentPracticeNback = 0;
    this.practiceIdx = 0;
    this.practiceNumberSeq = [];
    this.practiceHitSeq = [];
    // user answers
    this.currentUserReactions = [];
    this.currentUserAnswers = [];
    // for result
    this.gameNumberSeqs = [];
    this.gameHitSeqs = [];
    this.userReactions = [];
    this.userAnswers = [];
    // to handle timeouts
    this.timeoutList = [];
  },
  getData(){
    var obj = {}
    // from inputbox
    obj.id = this.id;
    obj.numberOfGames = this.numberOfGames;
    obj.numberOfTrialsPerGame = this.numberOfTrialsPerGame;
    obj.hitRatio = this.hitRatio;
    obj.expose = this.expose;
    obj.blink = this.blink;
    // game information
    obj.gameNbackTypes = this.gameNbackTypes;
    obj.gameNumberSeq = this.gameNumberSeq;
    obj.gameHitSeq = this.gameHitSeq;
    // user answers
    obj.userReactions = this.userReactions;
    obj.userAnswers = this.userAnswers;
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
  },
  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/history/nback') });
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
      gameTrialsDone: false,
      practice: props.numberOfPractices == '0' ? false: true,
      practiceDone: false,
      practiceTrialsDone: false,
      countdown: true,
      numberDisplay: false,
      beforeN: true,
    });
  },
  getCountdownTimer(s){
    return <CountdownTimer sec={s} onExpired={this.startTrials} />;
  },
  startTrials(){
    const afterTimeout = () => {
      this.currentUserAnswers = [];
      this.currentUserReactions = [];
      if(this.isGame()){
        //this.currentGameNback = this.gameNbackTypes.shift();
        this.currentGameNback = this.gameNbackTypes[this.gameNbackIdx ++];
        [this.gameNumberSeq, this.gameHitSeq] = genNBackSeq(this.numberOfTrialsPerGame, this.hitRatio, this.currentGameNback);
        this.gameIdx = 0;
      }else if(this.isPractice()){
        //this.currentPracticeNback= this.practiceNbackTypes.shift();
        this.currentPracticeNback= this.practiceNbackTypes[this.practiceNbackIdx ++];
        [this.practiceNumberSeq, this.practiceHitSeq] = genNBackSeq(this.numberOfTrialsPerPractice, this.hitRatio, this.currentPracticeNback);
        this.practiceIdx = 0;
      }
      this.setNextState({
        practiceTrialsDone: false,
        gameTrialsDone: false,
        numberDisplay: true,
        countdown:  false
      });
    }
    this.setState({practiceTrialsDone: false})
    setTimeout(afterTimeout, 500);
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
      return (
        <div>
          {/*<div> {this.getCountdownTimer(3)} </div>*/}
          <div> {this.getGuide()} </div>
          <div> {this.getButton()} </div>
        </div>
      );
    }
    // game or practice
    return(
      <div>
        {this.state.numberDisplay ? this.getNumber() : null}
        {this.isPracticeTrialsDone() ? this.getFeedback() : null}
        {this.isTrialsDone() ? this.getGuide() : null}
        {this.getButton()}
      </div>
    );
  },
  getNumber(){
    var numberStyle = {
      fontSize: this.state.maxSize/5,
      marginTop: this.state.gridHeight*0.3,
      textAlign: 'center',
      display: 'block'
    }
    var number;
    if(this.isPractice()){
      number = <div style={numberStyle}>{this.practiceNumberSeq[this.practiceIdx]}</div>
    }else if(this.isGame()){
      number = <div style={numberStyle}>{this.gameNumberSeq[this.gameIdx]}</div>
    }
    return number;
  },
  /*
   * during game or practice, there are a few phases
   * (before N -> doing trials -> end of trials set) many times -> done with all practices ->
   * (before N -> doing trials -> end of trials set) many times -> done with all games
   */
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
          <Button style={buttonStyleRed} onClick={this.startTrials} > 게임 시작 </Button>
        </div>
      );
    }
    // end of trials set
    else if(this.isTrialsDone()){
      var button;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        button = <Button style={buttonStyle} onTouchStart={this.startTrials} > 다음 게임 </Button>;
      }else{
        button = <Button style={buttonStyle} onClick={this.startTrials} > 다음 게임 </Button>;
      }
      return <div style={divStyle}> {button} </div>;
    }
    // before N (this current trial is an introduction)
    else if(this.isBeforeN()){
      return (
        <div style={divStyle}>
          <Button style={buttonStyle} value='next' onClick={this.nextNumber}> 다음 </Button>
        </div>
      );
    }
    else if(this.state.numberDisplay){
      return (
        <div style={divStyle}>
          <ResponseButton
            text={['일치', '불일치']}
            value={['same', 'different']}
            specs={{height: this.state.responseHeight}}
            selected={this.state.selectedReaction}
            callback={x => {this.setState({selectedReaction: x})}}/>
        </div>
      );
    }
    else{
      return (
        <div style={divStyle}>
          <Button style={buttonStyle} value='next' disabled={true}></Button>
        </div>
      );
    }
  },
  nextNumber(){
    // remove all the timeout event
    for(var i in this.timeoutList){
      clearTimeout(this.timeoutList[i]);
      delete this.timeoutList[i]
    }
    this.timeoutList = [];
    if(this.isBeforeN()){
      // just move index and check whether it is still before N or not
      if(this.isPractice()) this.practiceIdx ++;
      if(this.isGame()) this.gameIdx ++;
      this.currentUserReactions.push('');
      this.currentUserAnswers.push('');
      this.setNextState({numberDisplay: false});
    }
    else{
      this.checkAnswer()
    }
  },
  checkAnswer(){
      var correctness = false;
      if(this.isPractice()){
        correctness = (this.practiceHitSeq[this.practiceIdx] && (this.state.selectedReaction == 'same'))
          || (!this.practiceHitSeq[this.practiceIdx] && (this.state.selectedReaction == 'different'));
        this.practiceIdx ++;
      }
      if(this.isGame()){
        correctness = (this.gameHitSeq[this.gameIdx] && (this.state.selectedReaction == 'same'))
          || (!this.gameHitSeq[this.gameIdx] && (this.state.selectedReaction == 'different'));
        this.gameIdx ++;
      }
      this.currentUserReactions.push(this.state.selectedReaction);
      this.currentUserAnswers.push(correctness);
      this.setNextState({numberDisplay: false, selectedReaction: 'none'});
  },
  setNextState(additionalInfo){
    var state = {};
    if(this.state.practice){
      state.beforeN = this.practiceIdx < this.currentPracticeNback;
      state.practiceTrialsDone = this.practiceIdx == this.practiceNumberSeq.length;
      state.practiceDone = state.practiceTrialsDone && this.practiceNbackIdx == this.practiceNbackTypes.length;
      state.game = state.practiceDone;
      state.practice = !state.practiceDone;
    }else if(this.state.game){
      state.beforeN = this.gameIdx < this.currentGameNback;
      state.gameTrialsDone = this.gameIdx == this.gameNumberSeq.length;
      if(state.gameTrialsDone){
        this.gameNumberSeqs.push(this.gameNumberSeq);
        this.gameHitSeqs.push(this.gameHitSeq);
        this.userReactions.push(this.currentUserReactions);
        this.userAnswers.push(this.currentUserAnswers);
      }
      state.gameDone = state.gameTrialsDone && this.gameNbackIdx == this.gameNbackTypes.length;
      state.practiceTrialsDone = false;
      state.practiceDone = false;
      state.practice = false;
    }
    // during trials
    if (!(state.practiceTrialsDone || state.gameTrialsDone)){
      this.timeoutList.push(setTimeout(x => {this.setState({numberDisplay: true})}, this.blink));
    }
    setAttrByObj(state, additionalInfo, true);
    this.setState(state);
  },
  getFeedback(){
    var numberOfCorrects = this.currentUserAnswers.reduce((cnt, answer) => {return answer === true ? cnt+1 : cnt;}, 0);
    var score = numberOfCorrects + "/" + this.numberOfTrialsPerPractice;
    return (<span
      style={{
        fontSize: this.state.maxSize/5,
          marginTop: this.state.gridHeight*0.2,
          textAlign: 'center',
          display: 'block'
      }} >
      {score}
    </span>
    );
  },
  getGuide(){
    let nextType;
    if(this.isGame()){
      nextType = this.gameNbackTypes[this.gameNbackIdx];
    }else if(this.isPractice()){
      nextType = this.practiceNbackTypes[this.practiceNbackIdx];
    }
    let guide = ['다음 게임은', `등장하는 숫자가 ${nextType}번 전의 숫자와 같을 때 일치를,`, '그렇지 않을 땐 불일치를 누르세요.'];
    return (<span
      style={{
        fontSize: this.state.maxSize/20,
        width: '100%',
          top: this.state.gridHeight*0.5,
          textAlign: 'center',
          display: 'block',
          position: 'absolute'
      }} >
      {guide.map(s => (<div>{s}</div>))}
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
        numberOfTrialsPerGame={this.numberOfTrialsPerGame}
        gameNbackTypes={this.gameNbackTypes}
        gameNumberSeqs={this.gameNumberSeqs}
        gameHitSeqs={this.gameHitSeqs}
        userReactions={this.userReactions}
        userAnswers={this.userAnswers}
        hitRatio={this.hitRatio}
        expose={this.expose}
        blink={this.blink}
        reset={this.resetComponent}
        home={this.redirectToHome}
      />
    );
  },
  setWindowSize(){
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var responseHeight = Math.max(windowHeight*0.2, 50);
    if(this.state.responseHeight != responseHeight){
      var gridHeight = windowHeight - responseHeight;
      this.setState({
        responseHeight: responseHeight,
        gridHeight: gridHeight,
        gridWidth: windowWidth,
        maxSize: Math.min(gridHeight, windowWidth)
      });
    }
  },
  componentDidUpdate(prevProps, prevState){
    // when number appears, it should be disappear after a few seconds expose
    if(!prevState.numberDisplay && this.state.numberDisplay){
      this.timeoutList.push(setTimeout(x => {this.setState({numberDisplay: false});}, this.expose));
    }
    // when number dispears, it should check answer and call next number after short blink
    if(prevState.numberDisplay && !this.state.numberDisplay){
      this.timeoutList.push(setTimeout(this.nextNumber(), this.blink));
    }
    this.setWindowSize();
  },
});

module.exports = Game;
