import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { makeUrl, counter } from '../helpers'
import { directSave } from '../config';

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.seqLength}</td>
        <td>{this.props.numberOfTrials}</td>
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
    gameSeq: React.PropTypes.array,
    userTrials: React.PropTypes.array,
    speed: React.PropTypes.number,
    reset: React.PropTypes.func,
    home: React.PropTypes.func
  },
  getAvergeTr(){
    var seqLength = 0;
    var numberOfTrials = 0;
    for(var i=0;i<this.props.numberOfGames; i++){
      seqLength += this.props.gameSeq[i].length;
      numberOfTrials += this.props.userTrials[i].reduce((sum, num) => (sum += num), 0);
    }
    return (
      <TableRow
        idx='avg.'
        seqLength={(seqLength / this.props.numberOfGames).toFixed(2)}
        numberOfTrials={(numberOfTrials / this.props.numberOfGames).toFixed(2)}
      />
    )
  },
  getList(){
    var ret = [];
    for (var i=0; i<this.props.numberOfGames; i++){
      var seqLength = this.props.gameSeq[i].length;
      var numberOfTrials = this.props.userTrials[i].reduce((sum, num) => (sum += num), 0);
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          seqLength={seqLength}
          numberOfTrials={numberOfTrials}
        />
      )
    }
    return ret;
  },
  render() {
    return (
      <Modal.Dialog style={{overflowY: 'auto'}}>
        <Modal.Header>
          <Modal.Title>결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>시퀀스 길이</th>
                <th>시도 횟수</th>
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
    fetch(makeUrl('/result/spatial_memory'), requestHeader)
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
