import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { makeUrl, counter } from '../helpers'
import { directSave } from '../config';

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.nbackType}</td>
        <td>{this.props.score}</td>
      </tr>
    );
  }
});

var Result = React.createClass({
  getInitialState(){
    return{
      saved: false
    };
  },
  propTypes: {
    testId: React.PropTypes.string,
    numberOfGames: React.PropTypes.number,
    numberOfTrialsPerGame: React.PropTypes.number,
    gameNbackTypes: React.PropTypes.array,
    gameNumberSeqs: React.PropTypes.array,
    gameHitSeqs: React.PropTypes.array,
    userReactions: React.PropTypes.array,
    userAnswers: React.PropTypes.array,
    expose: React.PropTypes.number,
    blink: React.PropTypes.number,
    reset: React.PropTypes.func,
    home: React.PropTypes.func
  },
  getAvergeTr(){
    var numberOfCorrects = 0;
    var numberOfReactions = 0;
    for(var i=0;i<this.props.numberOfGames; i++){
      var nbackType = parseInt(this.props.gameNbackTypes[i]);
      var answers = this.props.userAnswers[i];
      numberOfCorrects += answers.reduce((cnt, answer) => {return answer === true ? cnt+1 : cnt}, 0);
      numberOfReactions += (answers.length - nbackType);
    }
    var correctRatio = (numberOfCorrects / numberOfReactions).toFixed(2)
    var score = numberOfCorrects + "/" + numberOfReactions + " (" + correctRatio + ")";
    return (
      <TableRow
        idx='avg.'
        nbackType=''
        score={score}
      />
    )
  },
  getList(){
    var ret = [];
    for (var i=0; i<this.props.numberOfGames; i++){
      var nbackType = parseInt(this.props.gameNbackTypes[i]);
      var answers = this.props.userAnswers[i];
      var numberOfCorrects = answers.reduce((cnt, answer) => {return answer === true ? cnt+1 : cnt}, 0);
      var numberOfReactions = (answers.length - nbackType);
      var correctRatio = (numberOfCorrects / numberOfReactions).toFixed(2)
      var score = numberOfCorrects + "/" + numberOfReactions + " (" + correctRatio + ")";
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          nbackType={nbackType}
          score={score}
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
                <th>N back</th>
                <th>정답률</th>
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
    fetch(makeUrl('/result/nback'), requestHeader)
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
  },
  componentDidMount(){
    if(directSave){
      this.sendResult();
    }
  }
});

module.exports = Result;
