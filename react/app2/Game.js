import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import ColorGrid from './ColorGrid';
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { random, makeUrl, genSeq, genPossibles } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      practice: true,
      practiceDone: false,
      done: false,
      id: '',
      numberOfGames: 0,
      numberOfPractices: 0,
      rotations: null,
      characters: null,
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
      maxSize: 0,
      interval: 1000,
      OX: ''
    };
  },
  targetAppearedTime: null,
  practiceIdx: null,
  gameIdx: null,
  practiceSeq: null,
  gameSeq: null,
  userAnswers: null,
  delays: null,
  componentWillMount(){
    this.targetAppearedTime = 0,
    this.practiceIdx = 0;
    this.gameIdx = 0;
    this.practiceSeq = [];
    this.gameSeq = [];
    this.userAnswers = [];
    this.delays= [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    this.componentDidMount();
  },
  startGame(props){
    this.gameSeq = genSeq(genPossibles([[0,1], props.characters, props.rotations]), props.numberOfGames);
    this.practiceSeq = genSeq(genPossibles([[0,1], props.characters, props.rotations]), props.numberOfPractices);
    this.setState({
      game: true,
      practice: props.numberOfPractices == '0' ? false : true,
      countdown: true,
      //targetDisplay: true, //for test
      id: props.id,
      numberOfGames: props.numberOfGames,
      numberOfPractices: props.numberOfPractices,
      rotations: props.rotations,
      characters: props.characters,
      interval: props.interval,
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/app2/history') });
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
        gameSeq={this.gameSeq}
        userAnswers={this.userAnswers}
        delays={this.delays}
        reset={this.resetComponent}
        home={this.redirectToHome}
      />
    );
  },

  getCountdownTimer(s){
    return ( <CountdownTimer sec={s} onExpired={x => {this.setState({ countdown: false, targetDisplay: true});}} />);
  },

  getButton(){
    if(this.state.practiceDone){
      return (
        <div
          style={{
            height: this.state.responseHeight,
              width: '100%',
              position: 'absolute',
              bottom: 0
          }}>
          <Button
            style={{width:'100%', height:'100%', fontSize: this.state.responseHeight/2, color: 'red'}}
            onClick={this.nextGame} >
            게임 시작
          </Button>
        </div>
      );
    }else{
      return(
        <div
          style={{
            height: this.state.responseHeight,
              width: '100%',
              position: 'absolute',
              bottom: 0
          }}>
          <ResponseButton
            text={['반전', '정상']}
            value={[1, 0]}
            specs={{height: this.state.responseHeight}}
            disabled={!this.state.targetDisplay}
            callback={this.checkAnswer}/>
        </div>
      );
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
        var image = null;
        if(this.state.targetDisplay){
          var path = '../static/app2/';
          if(this.state.practice){
            path += this.practiceSeq[this.practiceIdx].join('-') + '.png';
          }else{
            path += this.gameSeq[this.gameIdx].join('-') + '.png';
          }
          var size = this.state.maxSize*0.8;
          var margin = (this.state.gridHeight - size) / 2;
          image = (
            <div
              style={{
                height: this.state.gridHeight,
                width: '100%'
              }}>
              <img
                src={path}
                style={{
                  width: size,
                  height: 'auto',
                  display: 'block', margin: 'auto',
                  marginTop: margin
                }}/>
            </div>
          )
        }
        var feedback = (
          <span
            style={{
              fontSize: this.state.maxSize/5,
              marginTop: this.state.gridHeight*0.3,
              textAlign: 'center',
              display: 'block'
            }} >
            {this.state.OX}
          </span>
        );
        var button = this.getButton();
        return(
          <div>
            {!this.state.targetDisplay ? feedback : image}
            {button}
          </div>
        );
      }
    }
  },
  checkAnswer(e){
    var delay = Date.now() - this.targetAppearedTime;
    var reaction = parseInt(e.target.value);
    var OX;
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
  },
  nextGame(){
    if(this.gameIdx == this.state.numberOfGames){
      this.endGame();
    }else{
      if(this.state.practiceDone){
        this.setState({
          targetDisplay: true,
          practice: false,
          practiceDone: false,
          OX: ''
        });
      }else{
        this.setState({
          targetDisplay: true,
          OX: ''
        });
      }
    }
  },
  endGame(){
    this.setState({
      game: false,
      targetDisplay: false,
      done: true
    });
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
  //},
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
  }
});

module.exports = Game;
