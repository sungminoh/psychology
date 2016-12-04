import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { clone, makeUrl } from '../helpers'

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.value}</td>
        <td>{this.props.quantity}</td>
        <td>{this.props.type}</td>
        <td>{this.props.switch}</td>
        <td>{this.props.userAnswer}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.delay}</td>
      </tr>
    );
  }
});

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
    gameSwitchSeq: React.PropTypes.array,
    gameSeq: React.PropTypes.array,
    userAnswers: React.PropTypes.array,
    gameTypes: React.PropTypes.array,
    delays: React.PropTypes.array,
    reset: React.PropTypes.func
  },
  componentWillMount(){
    this.componentWillReceiveProps(this.props);
  },
  componentWillReceiveProps(nextProps){
    this.corrects = [];
    for(var i=0; i<nextProps.gameSeq.length; i++){
      if((nextProps.gameSeq[i][nextProps.gameTypes[i]] > 5) == nextProps.userAnswers[i]){
        this.corrects.push(1);
      }else{
        this.corrects.push(0);
      }
    }
  },
  getAvergeTr(){
    var cntQuantityType = 0;
    var cntValueType = 0;
    for(var type of this.props.gameTypes){
      if(type == 0) cntQuantityType += 1;
      else cntValueType += 1;
    }
    var cntMaintain = 0;
    var cntCompatible = 0;
    var cntIncompatible = 0;
    for(var switchType of this.props.gameSwitchSeq){
      if(switchType == 0) cntMaintain += 1;
      else if (switchType == 1) cntCompatible += 1;
      else cntIncompatible += 1;
    }
    var corrects = this.corrects.reduce((a, b) => a + b, 0);
    var avgOfCorrects = corrects / this.corrects.length;
    var avgOfDelays = average(this.props.delays);
    return (
      <TableRow
        idx='avg.'
        value=''
        quantity=''
        type={'양:' + cntQuantityType + ' / 값:' + cntValueType}
        switch={'0: ' + cntMaintain +
          ' / 1: ' + cntCompatible +
            ' / 2: ' + cntIncompatible
        }
        userAnswer=''
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
          value={this.props.gameSeq[i][1]}
          quantity={this.props.gameSeq[i][0]}
          type={this.props.gameTypes[i] == 0 ? '양' : '값'}
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
                <th>숫자</th>
                <th>개수</th>
                <th>게임 타입</th>
                <th>변경<br/>(0:유지, 1:compatible, 2:incompitible)</th>
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
          <Button onClick={this.props.reset}>닫기</Button>
          <Button bsStyle="primary" onClick={this.sendResult} disabled={this.state.saved}>저장</Button>
        </Modal.Footer>
      </Modal.Dialog>
        //</div>
    );
  },

  sendResult(){
    var obj = clone(this.props);
    obj['corrects'] = this.corrects;
    var requestHeader = {
      method: 'POST',
      headers: {
        //'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }
    fetch(makeUrl('/app3/result'), requestHeader)
      .then((response) => {
        if (response.ok){
          alert('성공적으로 저장되었습니다.');
          this.setState({saved: true});
        }
      })
    //.then((response) => response.json())
    //.then((responseJson) => {
    //console.log(responseJson);
    //})
      .catch((error) => {
        alert('데이터가 정상적으로 저장되지 못하였습니다. 다시 시도하세요.');
      });
  }
});

module.exports = Result;
