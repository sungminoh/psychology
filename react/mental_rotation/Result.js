import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { makeUrl } from '../helpers';
import { directSave } from '../config';

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.char}</td>
        <td>{this.props.rotation}</td>
        <td>{this.props.flip}</td>
        <td>{this.props.userAnswer}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.delay}</td>
      </tr>
    );
  }
});

function calStat(arr){
  var numberOfFlip = 0;
  var numberOfChar = 0;
  var numberOfRotation = { 0:0, 60:0, 120:0, 180:0, 240:0, 300:0 };
  for(var e of arr){
    if(e[0]) {numberOfFlip += 1;}
    if(e[1] == 'char') {numberOfChar += 1;}
    numberOfRotation[e[2]] += 1;
  }
  return {
    numberOfFlip: numberOfFlip,
    numberOfChar: numberOfChar,
    numberOfRotation: numberOfRotation
  };
}

function average(arr){
  var sum = 0;
  for(var i=0; i<arr.length; i++){
    var parsed = parseFloat(arr[i]);
    if(isNaN(parsed)){
      sum += arr[i].toString() == 'true' ? 1 : 0;
    }else if (typeof(parsed) == 'number'){
      sum += parseFloat(parsed);
    }
  }
  return sum/arr.length;
}

var Result = React.createClass({
  getInitialState(){
    return{
      saved: false
    };
  },

  propTypes: {
    gameBoxSeq: React.PropTypes.array,
    userAnswers: React.PropTypes.array,
    delays: React.PropTypes.array,
    reset: React.PropTypes.func,
    home: React.PropTypes.func
  },
  componentWillMount(){
    this.componentWillReceiveProps(this.props);
  },
  componentWillReceiveProps(nextProps){
    this.corrects = [];
    for(var i=0; i<nextProps.gameSeq.length; i++){
      if(nextProps.gameSeq[i][0] == nextProps.userAnswers[i]){
        this.corrects.push(1);
      }else{
        this.corrects.push(0);
      }
    }
  },
  getAvergeTr(){
    var stat = calStat(this.props.gameSeq);
    var numberOfFlip = stat.numberOfFlip;
    var numberOfChar = stat.numberOfChar;
    var numberOfRotation = stat.numberOfRotation;
    var numberOfGames = this.props.gameSeq.length;
    var numberOfUserAnswerFlip = this.props.userAnswers.reduce((a, b) => a + b, 0);
    var corrects = this.corrects.reduce((a, b) => a + b, 0);
    var avgOfCorrects = corrects / this.corrects.length;
    var avgOfDelays = average(this.props.delays);

    return (
      <TableRow
        idx='avg.'
        char={'ㅋ: ' + numberOfChar + ', 5: ' + (numberOfGames-numberOfChar)}
        rotation={ '0: ' + numberOfRotation['0'] +
            ', 60: ' + numberOfRotation['60'] +
            ', 120: ' + numberOfRotation['120'] +
            ', 180: ' + numberOfRotation['180'] +
            ', 240: ' + numberOfRotation['240'] +
            ', 300: ' + numberOfRotation['300']}
        flip={numberOfFlip + ' / ' + (numberOfGames-numberOfFlip)}
        userAnswer={numberOfUserAnswerFlip + ' / ' + (numberOfGames-numberOfUserAnswerFlip)}
        correct={avgOfCorrects.toFixed(2)}
        delay={avgOfDelays.toFixed(2)}
      />
    )
  },

  getList(){
    var ret = [];
    for (var i=0; i<this.corrects.length; i++){
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          char={this.props.gameSeq[i][1] == 'char' ? 'ㅋ' : 5}
          rotation={this.props.gameSeq[i][2]}
          flip={this.props.gameSeq[i][0]}
          userAnswer={this.props.userAnswers[i]}
          correct={this.corrects[i] ? 'O' : 'X'}
          delay={this.props.delays[i]}
        />
      )
    }
    return ret;
  },

  render() {
    return (
      //<div className="static-modal">
      <Modal.Dialog style={{overflowY: 'auto'}}>
        <Modal.Header>
          <Modal.Title>결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>자극</th>
                <th>회전</th>
                <th>반전</th>
                <th>입력</th>
                <th>정오</th>
                <th>응답 시간</th>
              </tr>
            </thead>
            <tbody>
              {this.getAvergeTr()}
              {this.getList()}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.reset}>새 게임</Button>
          <Button onClick={this.props.home}>게임 선택</Button>
          <Button bsStyle="primary" onClick={this.sendResult} disabled={this.state.saved}>저장</Button>
        </Modal.Footer>
      </Modal.Dialog>
        //</div>
    );
  },

  sendResult(){
    var requestHeader = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props)
    }
    fetch(makeUrl('/result/mental_rotation'), requestHeader)
      .then((response) => {
        if (response.ok){
          alert('성공적으로 저장되었습니다.');
          this.setState({saved: true});
        }
      })
      .catch((error) => {
        alert('데이터가 정상적으로 저장되지 못하였습니다. 다시 시도하세요.');
      });
  },

  componentDidMount(){
    if(directSave){
      this.sendResult();
    }
  }
});

module.exports = Result;
