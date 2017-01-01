import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { clone, makeUrl } from '../helpers'

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.numberOfBoxes}</td>
        <td>{this.props.gameAnswer}</td>
        <td>{this.props.userAnswer}</td>
        <td>{this.props.correct}</td>
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
    gameBoxSeq: React.PropTypes.array,
    gameAnswers: React.PropTypes.array,
    userAnswers: React.PropTypes.array,
    reset: React.PropTypes.func,
    home: React.PropTypes.func
  },
  componentWillMount(){
    this.componentWillReceiveProps(this.props);
  },
  componentWillReceiveProps(nextProps){
    this.corrects = [];
    for(var i=0; i<nextProps.gameAnswers.length; i++){
      if(nextProps.gameAnswers[i] == nextProps.userAnswers[i]){
        this.corrects.push(1);
      }else{
        this.corrects.push(0);
      }
    }
  },
  getAvergeTr(){
    var avgOfBoxes = average(this.props.gameBoxSeq);
    var avgOfGameAnswer = average(this.props.gameAnswers);
    var avgOfUserAnswer = average(this.props.userAnswers);
    var corrects = this.corrects.reduce((a, b) => a + b, 0);
    var avgOfCorrects = corrects / this.corrects.length;

    return (
      <TableRow
        idx='avg.'
        numberOfBoxes={avgOfBoxes.toFixed(2)}
        gameAnswer={avgOfGameAnswer.toFixed(2)}
        userAnswer={avgOfUserAnswer.toFixed(2)}
        correct={avgOfCorrects.toFixed(2)}
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
          numberOfBoxes={this.props.gameBoxSeq[i]}
          gameAnswer={this.props.gameAnswers[i]}
          userAnswer={this.props.userAnswers[i]}
          correct={this.corrects[i] ? 'O' : 'X'}
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
                <th>상자수</th>
                <th>정답</th>
                <th>입력</th>
                <th>정오</th>
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
    fetch(makeUrl('/app1/result'), requestHeader)
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
