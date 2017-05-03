import React from 'react';
import ReactDOM from 'react-dom';
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import Fixation from './Fixation'
import Target from './Target'
import ResponseButton from './ResponseButton';
import distinctColors from 'distinct-colors';
import { random, makeUrl, toHex, genSeq, genStopSeq } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var locations = ['left', 'right'];

var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      fixationDisplay: false,
      fixationHide: false,
      targetDisplay: false,
      stopDisplay: false,
      beforeNext: false,
      practice: true,
      done: false,
      id: '',
      numberOfGames: 0,
      numberOfPractices: 0,
      fixation: 0,
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
  targetAppearedTime: null,
  practiceIdx: null,
  gameIdx: null,
  practiceSeq: null,
  practiceStopSeq: null,
  gameSeq: null,
  gameStopSeq: null,
  delays: null,
  userAnswers: null,
  corrects: null,
  timeoutList: null,
  componentWillMount(){
    this.targetAppearedTime = 0;
    this.practiceIdx= 0;
    this.gameIdx= 0;
    this.practiceSeq = [];
    this.practiceStopSeq = [];
    this.gameSeq = [];
    this.gameStopSeq = [];
    this.delays = [];
    this.userAnswers = [];
    this.corrects= [];
    this.timeoutList = [];
  },
  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    this.componentDidMount();
  },
  startGame(props){
    this.gameSeq = genSeq(locations, props.numberOfGames);
    this.gameStopSeq = genStopSeq(props.numberOfGames, props.stopRatio, props.stopDelay);
    this.practiceSeq = genSeq(locations, props.numberOfPractices);
    this.practiceStopSeq= genStopSeq(props.numberOfPractices, props.stopRatio, props.stopDelay);
    this.setState({
      game: true,
      countdown: true,
      fixationDisplay: true,
      fixationHide: false,
      targetDisplay: false,
      stopDisplay: false,
      beforeNext: false,
      done: false,
      id: props.id,
      practice: props.numberOfPractices == '0' ? false : true,
      numberOfGames: props.numberOfGames,
      numberOfPractices: props.numberOfPractices,
      fixation: props.fixation,
      blink: props.blink,
      wait: props.wait
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/history/stop_signal_task') });
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
        stopSeq={this.gameStopSeq}
        delays={this.delays}
        userAnswers={this.userAnswers}
        corrects={this.corrects}
        reset={this.resetComponent}
        home={this.redirectToHome}
        fixation={this.state.fixation}
        blink={this.state.blink}
        wait={this.state.wait}
      />
    );
  },
  getCountdownTimer(s){
    return <CountdownTimer sec={s} onExpired={x => {this.setState({ countdown: false, fixationDisplay: true});}} />;
  },
  getGuide(){
    let guide = ['동그라미가 나타난 방향을 최대한 빨리 선택하세요.', '하지만 빨간 동그라미가 나타나면 아무것도 선택하면 안됩니다.'];
    return (<span
      style={{
        fontSize: this.state.maxSize/20,
        width: '100%',
          top: this.state.gridHeight*0.4,
          textAlign: 'center',
          display: 'block',
          position: 'absolute'
      }} >
      {guide.map(s => (<div>{s}</div>))}
    </span>
    );
  },
  getTarget(){
    var seq, idx, stopSeq;
    if (this.state.practice){
      seq = this.practiceSeq;
      idx = this.practiceIdx;
      stopSeq = this.practiceStopSeq;
    }else{
      seq = this.gameSeq;
      idx = this.gameIdx;
      stopSeq = this.gameStopSeq;
    }
    var onExpireds = [this.checkAnswer];
    var times = [this.state.wait];
    if(stopSeq[idx] != 0){
      onExpireds.push(x=>{this.setState({stopDisplay:true})});
      times.push(stopSeq[idx]);
    }
    return (
      <Target
        specs={{height: this.state.gridHeight, width: this.state.gridWidth}}
        location={seq[idx]}
        stop={this.state.stopDisplay}
        onExpireds={onExpireds}
        times={times}
        timeoutList={this.timeoutList}
      />
    )
  },
  getFixation(){
    return (
      <Fixation
        specs={{height: this.state.gridHeight, width: this.state.gridWidth}}
        expireAfter={this.state.fixation}
        onExpired={x=>{this.setState({fixationDisplay:false, fixationHide:true})}}
        onUnmount={x=>{this.setState({fixationHide:false, targetDisplay:true})}}
        afterUnmount={this.state.blink}
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
  getButton(){
    if(this.state.practiceDone || this.state.countdown){
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
            text={['왼쪽', '오른쪽']}
            value={['left', 'right']}
            specs={{height: this.state.responseHeight}}
            disabled={!this.state.targetDisplay}
            callback={this.checkAnswer}/>
        </div>
      )
    }
  },
  getNextGameButton(){
    if(this.state.beforeNext){
      var button;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        button = (
          <Button
            style={{width:'100%', height:'100%', fontSize: this.state.responseHeight/2}}
            onTouchStart={this.nextGame}
          >
            다음 게임
          </Button>
        );
      }else{
        button = (
          <Button
            style={{width:'100%', height:'100%', fontSize: this.state.responseHeight/2}}
            onClick={this.nextGame}
          >
            다음 게임
          </Button>
        );
      }
      return (
        <div
          style={{
            height: this.state.responseHeight,
              width: '100%',
              position: 'absolute',
              bottom: this.state.responseHeight
          }}>
          {button}
        </div>
      );
    }
  },
  getStop(){
    if(this.state.stopDisplay && !this.state.beforeNext){
      return (
        <div
          style={{
            position: 'absolute',
            fontSize: this.state.maxSize/5,
            color: 'red',
            marginTop: this.state.gridHeight*0.3,
            textAlign: 'center',
            display: 'block'
          }}
        >O</div>
      )
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
        //var countdownTimer = this.getCountdownTimer(3);
        //return ( <div> {countdownTimer} </div> );
        return (
          <div>
            {this.getGuide()}
            {this.getButton()}
          </div>
        );
      }else{
        var main;
        if(this.state.fixationDisplay){
          main = this.getFixation();
        } else if(this.state.targetDisplay){
          main = this.getTarget();
        } else if(!this.state.fixationHide){
          main = this.getFeedback();
        }
        var button = this.getButton();
        var nextGameButton = this.getNextGameButton();
        return(
          <div>
            {main}
            {nextGameButton}
            {button}
          </div>
        );
      }
    }
  },
  checkAnswer(e){
    if(!this.state.targetDisplay){ return; }
    for(var i=0; i<this.timeoutList.length; i++){
      clearTimeout(this.timeoutList[i]);
    }
    var reaction;
    if(e){
      reaction = e.target.value;
    }else{
      reaction = 'none'
    }
    var seq, idx, stopSeq;
    if (this.state.practice){
      seq = this.practiceSeq;
      idx = this.practiceIdx;
    }else{
      seq = this.gameSeq;
      idx = this.gameIdx;
    }
    var delay = Date.now() - this.targetAppearedTime;
    var OX;
    if(this.state.stopDisplay){
      if(reaction == 'none'){
        delay = '';
        OX = '정답';
      }else{
        OX = '오답';
      }
    }else{
      if(reaction == 'none'){
        delay = '';
        OX = '미응답';
      }else if(seq[idx] == reaction){
        OX = '정답';
      }else{
        OX = '오답';
      }
    }
    //var stillPractice = this.state.practice;
    var practiceDone = false;
    if(this.state.practice){
      this.practiceIdx += 1;
      if(this.practiceIdx == this.state.numberOfPractices){
        //stillPractice = false
        practiceDone = true;
      }
    }else{
      this.delays.push(delay);
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
    if(this.state.countdown){
      this.setState({countdown: false, fixationDisplay: true});
    }
    if(this.gameIdx == this.state.numberOfGames){
      this.endGame();
    }else{
      if(this.state.practiceDone){
        this.setState({
          fixationDisplay: true,
          fixationHide: false,
          targetDisplay: false,
          stopDisplay: false,
          beforeNext: false,
          practice: false,
          practiceDone: false,
          OX: ''
        });
      }else{
        this.setState({
          fixationDisplay: true,
          fixationHide: false,
          targetDisplay: false,
          stopDisplay: false,
          beforeNext: false,
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
