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


var locations = ['left', 'right'];

var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      practice: true,
      done: false,
      id: '',
      numberOfGames: 0,
      numberOfTrialsPerGame: 0,
      numberOfPractices: 0,
      numberOfTrialsPerPractice: 0,
      expose: 0,
      blink: 0,
      wait: 0,
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
      maxSize: 0,
      interval: 1000,
      OX: ''
    };
  },
  practiceIdx: null,
  gameIdx: null,
  practiceSeq: null,
  gameSeq: null,
  practiceAnswers: null,
  gameAnswers: null,
  userAnswers: null,
  gameNbacks: null,
  currentGameNback: 0,
  currentPracticeNback: 0,
  practiceNbacks: null,
  corrects: null,
  componentWillMount(){
    this.practiceIdx= 0;
    this.gameIdx= 0;
    this.practiceSeq = [];
    this.gameSeq = [];
    this.userAnswers = [];
    this.corrects= [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    //this.componentDidMount();
  },
  startGame(props){
    var nbacks = Array.from(props.nbacks).sort();
    this.gameNbacks = nbacks.slice();
    this.currentGameNback= this.gameNbacks.shift();
    [this.gameSeq, this.gameAnswers] = genNBackSeq(props.numberOfTrialsPerGame, props.hitRatio, this.currentGameNback);

    this.practiceNbacks= nbacks.slice();
    this.currentPracticeNback= this.practiceNbacks.shift();
    [this.practiceSeq, this.practiceAnswers] = genNBackSeq(props.numberOfTrialsPerPractice, props.numberOfPractices, this.currentPracticeNback);

    this.setState({
      game: true,
      countdown: true,
      targetDisplay: false,
      done: false,
      id: props.id,
      practice: props.numberOfPractices == '0' ? false : true,
      numberOfGames: props.numberOfGames,
      numberOfTrialsPerGame: props.numberOfTrialsPerGame,
      numberOfPractices: props.numberOfPractices,
      numberOfTrialsPerPractice: props.numberOfTrialsPerPractice,
      expose: props.expose,
      blink: props.blink,
      wait: props.wait
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/nback/history') });
  },
  redirectToHome(){
    this.props.router.push({ pathname: makeUrl('/') });
  },

  getInputForm(){
    var historyButton = ( <Button onClick={this.redirectToHistory} > 기록 보기 </Button>);
    return ( <InputForm onClick={this.startGame} additionalButtons={historyButton} />);
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

  getCountdownTimer(s){
    return <CountdownTimer sec={s} onExpired={x => {this.setState({ countdown: false, targetDisplay: true});}} />;
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
  getButton(){
    var divStyle = {
      height: this.state.responseHeight,
      width: '100%',
      position: 'absolute',
      bottom: 0
    };
    var buttonStyle = {width:'100%', height:'100%', fontSize: this.state.responseHeight/2}
    if(!this.state.practice){
      var buttonStyleRed = clone(buttonStyle);
      buttonStyleRed['color'] = 'red';
      return (
        <div style={divStyle}>
          <Button style={buttonStyleRed} onClick={this.nextGame} > 게임 시작 </Button>
        </div>
      );
    }else if(this.state.beforeNext){
      var button;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        button = <Button style={buttonStyle} onTouchStart={this.nextGame} > 다음 게임 </Button>;
      }else{
        button = <Button style={buttonStyle} onClick={this.nextGame} > 다음 게임 </Button>;
      }
      return <div style={divStyle}> {button} </div>;
    }else{
      var beforeStart = (this.state.practice && this.currentPracticeNback > this.practiceIdx) || (!this.state.practice && this.currentGameNback > this.gameIdx);
      if (beforeStart){
        return (
          <div style={divStyle}>
            <Button style={buttonStyle} value='next' onClick={this.nextGame}> 다음 </Button>
          </div>
        );

      }else{
        return (
          <div style={divStyle}>
            <ResponseButton
              text={['일치', '불일치']}
              value={['same', 'different']}
              specs={{height: this.state.responseHeight}}
              disabled={!this.state.targetDisplay}
              callback={this.checkAnswer}/>
          </div>
        )
      }
    }
  },

  getTarget(){
    if(this.state.practice){
      return <div>{this.practiceSeq[this.practiceIdx ++]}</div>
    }else{
      return <div>{this.gameSeq[this.gameIdx ++]}</div>
    }
  },

  render(){
    if(!this.state.game){
      if(!this.state.done){
        return this.getInputForm();
      }else{
        return this.getResult();
      }
    }else{
      if(this.state.countdown){
        var countdownTimer = this.getCountdownTimer(3);
        return ( <div> {countdownTimer} </div> );
      }else{
        var button = this.getButton();
        var target = this.getTarget();
        return(
          <div>
            {target}
            {button}
          </div>
        );
      }
    }
  },
  checkAnswer(e){

    if(!this.state.targetDisplay){ return; }
    //var stillPractice = this.state.practice;
    var practiceDone = false;
    if(this.state.practice){
      if(this.practiceSeq[this.practiceIdx][0] == reaction){
        OX = '정답';
      }else{
        OX = '오답';
      }
      this.practiceIdx += 1;
      if(this.practiceIdx == this.state.numberOfPractices){
        //stillPractice = false;
        practiceDone = true;
      }
    }else{
      this.userAnswers.push(reaction);
      this.delays.push(delay);
      this.gameIdx += 1;
    }
    this.setState({
      targetDisplay: false,
      OX: OX,
      //practice: stillPractice
      practiceDone: practiceDone
    })
    if(!practiceDone){
      setTimeout(this.nextGame, this.state.interval);
    }



    var reaction = e? e.target.value : 'none';

    if(reaction == 'next'){
      setTimeout(this.nextGame, this.state.interval);
      this.setState({
        targetDisplay: false
      })
    }

    var hitArr = this.state.practice? this.practiceAnswers : this.gameAnswers;
    var idx = this.state.practice? this.practiceIDx : this.gameIdx;

    var OX;
    if(reaction == 'none'){
      OX = '미응답'
    }else if((reaction == 'same' && hitArr[idx]) || (reaction == 'different' && !hitArr[idx])){
      OX = '정답';
    }else{
      OX = '오답';
    }

    var practiceDone = false;
    if(this.state.practice){
      this.practiceIdx += 1;
      if(this.practiceIdx == this.practiceSeq.length){
        if(this.practiceNbacks.length == 0){
          practiceDone = true;
        }else{
          this.currentPracticeNback = this.practiceNbacks.shift();
          this.practiceIdx = 0;
          [this.practiceSeq, this.practiceAnswers] = genNBackSeq(this.state.numberOfTrialsPerPractice, this.state.hitRatio, this.currentPracticeNback)
        }
      }
    }else{ // !this.state.practice
      this.userAnswers.push(reaction);
      this.corrects.push(OX);
      OX = '';
      this.gameIdx += 1;
    }
    this.setState({
      targetDisplay: false,
      targetHide: false,
      targetRedisplay: false,
      beforeNext: true,
      OX: OX,
      practiceDone: practiceDone
      //practice: stillPractice
    })
  },
  nextGame(e){
    if(this.gameNbacks.length == 0){
      this.endGame();
    }else{
      if(this.state.practice){
        this.setState({
          targetDisplay: true,
          OX: ''
        });
      }else{
        this.setState({
          targetDisplay: false,
          practice: false,
          OX: ''
        });
      }
    }
  },
  endGame(){
    this.setState({
      game: false,
      fixationDisplay: false,
      fixationHide: false,
      targetDisplay: false,
      stopDisplay: false,
      beforeNext: false,
      done: true
    });
  },
  componentDidUpdate(prevProps, prevState){
    if(!prevState.targetDisplay && this.state.targetDisplay){
      this.targetAppearedTime = Date.now();
    }
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
  //componentDidMount(){
  //var windowHeight = window.innerHeight;
  //var windowWidth = window.innerWidth;
  //var responseHeight = Math.max(windowHeight*0.2, 50);
  //var gridHeight = windowHeight - responseHeight;
  //this.setState({
  //responseHeight: responseHeight,
  //gridHeight: gridHeight,
  //gridWidth: windowWidth,
  //maxSize: Math.min(gridHeight, windowWidth)
  //})
  //}
});

module.exports = Game;
