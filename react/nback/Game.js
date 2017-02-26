import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import Fixation from './Fixation'
import Target from './Target'
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { clone, random, makeUrl, genNBackSeq } from '../helpers';
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
      // for game panel size
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
      maxSize: 0,
    };
  },
  componentWillMount(){ // component attributes
    // from inputbox
    this.id = '';
    this.numberOfGames = 0;
    this.numberOfTrialsPerGame = 0;
    this.numberOfPractices = 0;
    this.numberOfTrialsPerPractice = 0;
    this.expose = 0;
    this.blink = 0;
    // game information
    this.gameNbackTypes = [];
    this.currentGameNback = 0;
    this.gameIdx = 0;
    this.gameNumberSeq = [];
    this.gameHitSeq = [];
    // practice information
    this.practiceNbackTypes = [];
    this.currentPracticeNback = 0;
    this.practiceIdx = 0;
    this.practiceNumberSeq = [];
    this.practiceHitSeq = [];
    // user answers
    this.selectedReaction = '';
    this.userReactions = [];
    this.userAnwers = [];
    // to handle timeouts
    this.timeoutList = [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
  },
  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/nback/history') });
  },
  getInputForm(){
    var historyButton = ( <Button onClick={this.redirectToHistory} > 기록 보기 </Button>);
    return ( <InputForm onClick={this.onClickStart} additionalButtons={historyButton} />);
  },
  setAttrByObj(obj){
    for(var key in obj){
      if(key in this){
        this[key] = obj[key];
      }
    }
  },
  onClickStart(props){ // triggered by inputform
    var nbacks = Array.from(props.nbacks).sort();
    this.gameNbackTypes = nbacks.slice();
    this.practiceNbackTypes = nbacks.slice();
    this.setAttrByObj(props)
    this.setState({
      // game status (game, practice are mutualy exclusive)
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
    if(this.state.game){
      this.currentGameNback = this.gameNbackTypes.shift();
      [this.gameNumberSeq, this.gameHitSeq] = genNBackSeq(this.numberOfTrialsPerGame, this.hitRatio, this.currentGameNback);
    }else if(this.state.practice){
      this.currentPracticeNback= this.practiceNbackTypes.shift();
      [this.practiceNumberSeq, this.practiceHitSeq] = genNBackSeq(this.numberOfTrialsPerPractice, this.numberOfPractices, this.currentPracticeNback);
    }
    this.setState({
      numberDisplay: true,
      countdown: false,
    });
  },
  render(){
    // before start game, get inputs
    if(!this.state.game && !this.state.practice){
      return this.getInputForm();
    }
    // after end of game, show results
    if(this.state.gameDone){
      return this.getResult();
    }
    // countdown
    if(this.state.countdown){
      return <div> {this.getCountdownTimer(0)} </div>;
    }
    // game or practice
    return(
      <div>
        {this.state.numberDisplay ? this.getNumber() : null}
        {this.getButton()}
      </div>
    );
  },
  getNumber(){
    var number;
    if(this.state.practice){
      number = <div>{this.practiceNumberSeq[this.practiceIdx]}</div>
    }else if(this.state.game){
      number = <div>{this.gameNumberSeq[this.gameIdx]}</div>
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
    if(this.state.practiceDone){
      var buttonStyleRed = clone(buttonStyle);
      buttonStyleRed['color'] = 'red';
      return (
        <div style={divStyle}>
          <Button style={buttonStyleRed} onClick={this.startGame} > 게임 시작 </Button>
        </div>
      );
    }
    // end of trials set
    if(this.state.practiceTrials || this.state.gameTrials){
      var button;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        button = <Button style={buttonStyle} onTouchStart={this.startTrials} > 다음 게임 </Button>;
      }else{
        button = <Button style={buttonStyle} onClick={this.startTrials} > 다음 게임 </Button>;
      }
      return <div style={divStyle}> {button} </div>;
    }
    // before N (this current trial is an introduction)
    if(this.state.beforeN){
      return (
        <div style={divStyle}>
          <Button style={buttonStyle} value='next' onClick={this.nextNumber}> 다음 </Button>
        </div>
      );
    }
    // doing trials
    return (
      <div style={divStyle}>
        <ResponseButton
          text={['일치', '불일치']}
          value={['same', 'different']}
          specs={{height: this.state.responseHeight}}
          callback={x => this.selectedReaction = x}/>
      </div>
    );
  },
  startGame(){
    this.setState({
      game: true,
      practice: false,
      practiceDone: false,
    })
    this.startTrials();
  },
  nextNumber(){
    for(var timeout in this.timeoutList){
      clearTimeout(timeout);
    }
    this.checkAnswer();
  },
  checkAnswer(e){
  },
















  redirectToHome(){
    this.props.router.push({ pathname: makeUrl('/') });
  },
  getResult(){
    return (
      <Result
        testId={this.state.id}
        seq={this.gameSeq}
        userAnswers={this.userAnswers}
        corrects={this.corrects}
        reset={this.resetComponent}
        home={this.redirectToHome}
        expose={this.state.expose}
        blink={this.state.blink}
        wait={this.state.wait}
      />
    );
  },

  getFeedback(){
    return (<span
      style={{
        fontSize: this.state.maxSize/5,
          marginTop: this.state.gridHeight*0.3,
          textAlign: 'center',
          display: 'block'
      }} >
      {this.state.OX}
    </span>
    );
  },
  nextGame(e){
    if(this.gameNbacks.length == 0){
      // if all the games are over
      this.endGame();
    }else{
      var beforeStart = (this.state.practice && this.currentPracticeNback > this.practiceIdx) || (!this.state.practice && this.currentGameNback > this.gameIdx);
      if(this.state.practiceDone){
        this.setState({
          beforeNext: false,
          numberDisplay: true,
          practice: false,
          practiceDone: false,
          OX: ''
        });
      }else{
        this.setState({
          beforeNext: false,
          numberDisplay: true,
          OX: ''
        });
      }
    }
  },
  endGame(){
    this.setState({
      game: false,
      numberDisplay: false,
      beforeNext: false,
      done: true
    });
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
    if(!prevState.numberDisplay && this.state.numberDisplay){
      this.timeoutList.push(setTimeout(x => {this.setState({numberDisplay: false});}, this.expose));
    }
    if(prevState.numberDisplay && !this.state.numberDisplay){
      this.timeoutList.push(setTimeout(this.checkAnswer, this.blink));
    }
    this.setWindowSize();
  },
});

module.exports = Game;
