import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import ColorGrid from './ColorGrid';
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { random, makeUrl, toHex, genSeq, genPallet, randomColorPos } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      targetHide: false,
      targetRedisplay: false,
      practice: true,
      practiceDone: false,
      done: false,
      id: '',
      numberOfGames: 0,
      numberOfPractices: 0,
      boxesOfGame: null,
      boxesOfPractice: null,
      responseHeight: 0,
      gridHeight: 0,
      gridWidth: 0,
      maxSize: 0,
      interval: 1000,
      blink: 900,
      expose: 100,
      OX: ''
    };
  },
  pallet: null,
  practiceIdx: null,
  gameIdx: null,
  practiceBoxSeq: null,
  gameBoxSeq: null,
  practiceAnswers: null,
  gameAnswers: null,
  currentPallet: null,
  spareColor: null,
  userAnswers: null,
  componentWillMount(){
    this.pallet = [];
    this.practiceIdx= 0;
    this.gameIdx= 0;
    this.practiceBoxSeq = [];
    this.gameBoxSeq = [];
    this.practiceAnswers = [];
    this.gameAnswers = [];
    this.currentPallet = [];
    this.spareColor = null;
    this.userAnswers = [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    this.componentDidMount();
  },
  startGame(props){
    this.pallet = toHex(distinctColors({count:Math.pow(props.length, 2)}));
    this.gameBoxSeq = genSeq(props.boxesOfGame, props.numberOfGames);
    this.practiceBoxSeq = genSeq(props.boxesOfPractice, props.numberOfPractices);
    this.gameAnswers= genSeq([1, 0], props.numberOfGames)
    this.practiceAnswers = genSeq([1, 0], props.numberOfPractices)
    this.setState({
      game: true,
      practice: props.numberOfPractices == '0' ? false : true,
      countdown: true,
      length: props.length,
      id: props.id,
      numberOfGames: props.numberOfGames,
      numberOfPractices: props.numberOfPractices,
      boxesOfGame: props.boxesOfGame,
      boxesOfPractice: props.boxesOfPractice,
      interval: props.interval,
      blink: props.blink,
      expose: props.expose
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/app1/history') });
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
        gameBoxSeq={this.gameBoxSeq}
        gameAnswers={this.gameAnswers}
        userAnswers={this.userAnswers}
        expose={this.state.expose}
        blink={this.state.blink}
        interval={this.state.interval}
        reset={this.resetComponent}
        home={this.redirectToHome}
      />
    );
  },

  getCountdownTimer(s){
    if (this.state.countdown){
      return (
        <CountdownTimer
          sec={s}
          onExpired={x => {this.setState({ countdown: false, targetDisplay: true});}}
        />
      );
    }else{
      return null;
    }
  },

  getColorGrid(pallet){
    if(this.state.targetDisplay){
      return (
        <ColorGrid
          pallet={pallet}
          specs={{height: this.state.gridHeight, width: this.state.gridWidth}}
          onExpired={
            x => {
              this.setState({
                targetDisplay: false,
                targetHide: true,
                targetRedisplay: false
              })
            }
          }
          afterMilliseconds={this.state.expose}
          />
      );
    }else if(this.state.targetHide){
      setTimeout(x => {
        this.setState({
          targetDisplay: false,
          targetHide: false,
          targetRedisplay: true
        })
      }, this.state.blink);
    }else if(this.state.targetRedisplay){
      if(this.state.practice){
        if(this.practiceAnswers[this.practiceIdx] == 1) {
          this.currentPallet[randomColorPos(this.currentPallet)] = this.spareColor;
        }
        return ( <ColorGrid pallet={this.currentPallet} specs={{height: this.state.gridHeight, width: this.state.gridWidth}} />);
      }else{
        if(this.gameAnswers[this.gameIdx] == 1) {
          this.currentPallet[randomColorPos(this.currentPallet)] = this.spareColor;
        }
        return ( <ColorGrid pallet={this.currentPallet} specs={{height: this.state.gridHeight, width: this.state.gridWidth}} />);
      }
    }
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
      return (
        <div
          style={{
            height: this.state.responseHeight,
              width: '100%',
              position: 'absolute',
              bottom: 0
          }}>
          <ResponseButton
            text={['변함', '안변함']}
            value={[1, 0]}
            specs={{height: this.state.responseHeight}}
            disabled={!this.state.targetRedisplay}
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
        if(this.state.targetDisplay){
          var pallet, spare;
          var conf = this.state.practice ? this.practiceBoxSeq[this.practiceIdx] : this.gameBoxSeq[this.gameIdx];
          [pallet, spare] = genPallet(this.pallet, conf);
          this.currentPallet = pallet;
          this.spareColor = spare;
        }
        var grid = this.getColorGrid(this.currentPallet);
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
            {!this.state.targetHide && !this.state.targetRedisplay && !this.state.targetDisplay ? feedback : grid}
            {button}
          </div>
        );
      }
    }
  },
  checkAnswer(e){
    var reaction = parseInt(e.target.value);
    var OX;
    var practiceDone = false;
    if(this.state.practice){
      if(this.practiceAnswers[this.practiceIdx] == reaction){
        OX = '정답';
      }else{
        OX = '오답';
      }
      this.practiceIdx += 1;
      if(this.practiceIdx == this.state.numberOfPractices){
        practiceDone = true;
      }
    }else{
      this.userAnswers.push(reaction);
      this.gameIdx += 1;
    }
    this.setState({
      targetDisplay: false,
      targetHide: false,
      targetRedisplay: false,
      OX: OX,
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
      if (this.state.practiceDone){
        this.setState({
          targetDisplay: true,
          targetHide: false,
          targetRedisplay: false,
          practice: false,
          practiceDone: false,
          OX: ''
        });
      }else{
        this.setState({
          targetDisplay: true,
          targetHide: false,
          targetRedisplay: false,
          OX: ''
        });
      }
    }
  },
  endGame(){
    this.setState({
      game: false,
      targetDisplay: false,
      targetHide: false,
      targetRedisplay: false,
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
