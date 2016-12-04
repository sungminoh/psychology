import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm';
import NumberGrid from './NumberGrid';
import Result from './Result';
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { random, makeUrl, genMaintains, genSwitchSeq, genNumbers } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';

var possibles = [1,2,3,4,6,7,8,9];

var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      practice: true,
      done: false,
      currentGameType: null,
      numberOfGames: 0,
      numberOfPractices: 0,
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
      maxSize: 0,
      OX: '',
      interval: 0
    };
  },
  targetAppearedTime: null,
  practiceIdx: null,
  practiceSwitchSeq: null,
  practiceSeq: null,
  gameIdx: null,
  gameSwitchSeq: null,
  gameSeq: null,
  userAnswers: null,
  gameTypes: null,
  delays: null,
  componentWillMount(){
    this.targetAppearedTime = 0,
    this.practiceIdx = 0;
    this.practiceSwitchSeq = [];
    this.practiceSeq = [];
    this.gameIdx = 0;
    this.gameSwitchSeq = [];
    this.gameSeq = [];
    this.userAnswers = [];
    this.gameTypes = [];
    this.delays= [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    this.componentDidMount();
  },
  startGame(props){
    this.gameSwitchSeq= genSwitchSeq(genMaintains(props.numberOfGames, props.ratio));
    this.gameSeq = genNumbers(this.gameSwitchSeq, possibles)
    this.practiceSwitchSeq = genSwitchSeq(genMaintains(props.numberOfPractices, props.ratio));
    this.practiceSeq = genNumbers(this.practiceSwitchSeq, possibles)
    this.setState({
      game: true,
      practice: props.numberOfPractices == '0' ? false : true,
      //countdown: true,
      targetDisplay: true, //for test
      numberOfGames: props.numberOfGames,
      numberOfPractices: props.numberOfPractices,
      currentGameType: random(2),
      interval: props.interval
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/app3/history') });
  },

  getInputForm(){
    var historyButton = ( <Button onClick={this.redirectToHistory} > 기록 보기 </Button>);
    return ( <InputForm onClick={this.startGame} additionalButtons={historyButton} />);
  },

  getNumberGrid(numbers){
    return <NumberGrid numbers={numbers} specs={{height: this.state.gridHeight, width: this.state.gridWidth}} />;
  },

  getResult(){
    return (
      <Result
        gameSwitchSeq={this.gameSwitchSeq}
        gameSeq={this.gameSeq}
        userAnswers={this.userAnswers}
        gameTypes={this.gameTypes}
        delays={this.delays}
        reset={this.resetComponent}
      />
    );
  },

  getCountdownTimer(s){
    return ( <CountdownTimer sec={s} onExpired={x => {this.setState({ countdown: false, targetDisplay: true});}} />);
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
        var text = [];
        var numberGrid = null;
        if(this.state.targetDisplay){
          if(this.state.currentGameType == 0){
            text = ['적다', '많다'];
          } else{
            text = ['작다', '크다'];
          }
          if(this.state.practice){
            numberGrid = this.getNumberGrid(this.practiceSeq[this.practiceIdx]);
          }else{
            numberGrid = this.getNumberGrid(this.gameSeq[this.gameIdx]);
          }
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
        return(
          <div>
            {!this.state.targetDisplay ? feedback : numberGrid}
            <div
              style={{
                height: this.state.responseHeight,
                width: '100%',
                position: 'absolute',
                bottom: 0
              }}>
              <ResponseButton
                text={text}
                value={[0, 1]}
                specs={{height: this.state.responseHeight}}
                disabled={!this.state.targetDisplay}
                callback={this.checkAnswer}/>
            </div>
          </div>
        );
      }
    }
  },
  checkAnswer(e){
    var delay = Date.now() - this.targetAppearedTime;
    var reaction = parseInt(e.target.value);
    var OX;
    var nextGameType = this.state.currentGameType;
    var stillPractice = this.state.practice;
    if(this.state.practice){
      if((this.practiceSeq[this.practiceIdx][this.state.currentGameType] > 5) == reaction){
        OX = '정답';
      }else{
        OX = '오답';
      }
      this.practiceIdx += 1;
      if(this.practiceIdx == this.state.numberOfPractices){
        stillPractice = false
      }
      if(stillPractice){
        if(this.practiceSwitchSeq[this.practiceIdx] > 0){
          nextGameType = (nextGameType+1)%2;
        }
      }else{
          nextGameType = random(2);
      }
    }else{
      this.userAnswers.push(reaction);
      this.gameTypes.push(this.state.currentGameType);
      this.delays.push(delay);
      this.gameIdx += 1;
      if(this.gameSwitchSeq[this.gameIdx] > 0){
        nextGameType = (nextGameType+1)%2;
      }
    }
    this.setState({
      targetDisplay: false,
      OX: OX,
      practice: stillPractice,
      currentGameType: nextGameType
    })
    setTimeout(this.nextGame, this.state.interval);
  },
  nextGame(){
    if(this.gameIdx == this.state.numberOfGames){
      this.endGame();
    }else{
      this.setState({
        targetDisplay: true,
        OX: ''
      })
    }
  },
  endGame(){
    this.setState({
      game: false,
      targetDisplay: false,
      done: true
    });
  },
  componentDidMount(){
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var responseHeight = Math.max(windowHeight*0.2, 50);
    var gridHeight = windowHeight - responseHeight;
    this.setState({
      responseHeight: responseHeight,
      gridHeight: gridHeight,
      gridWidth: windowWidth,
      maxSize: Math.min(gridHeight, windowWidth)
    })
  },
  componentDidUpdate(prevProps, prevState){
    if(!prevState.targetDisplay && this.state.targetDisplay){
      this.targetAppearedTime = Date.now();
    }
  }
});

module.exports = Game;
