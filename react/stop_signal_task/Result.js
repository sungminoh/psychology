import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { makeUrl, counter } from '../helpers'

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.location}</td>
        <td>{this.props.stop}</td>
        <td>{this.props.userAnswer}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.delay}</td>
      </tr>
    );
  }
});


function makeString(obj){
  var str = [];
  for(var key in obj){
    str.push(key+':'+obj[key]);
  }
  return str.join(' / ');
}

var Result = React.createClass({
  getInitialState(){
    return{
      saved: false
    };
  },

  propTypes: {
    seq: React.PropTypes.array,
    stopSeq: React.PropTypes.array,
    delays: React.PropTypes.array,
    userAnswers: React.PropTypes.array,
    corrects: React.PropTypes.array,
    fixation: React.PropTypes.number,
    blink: React.PropTypes.number,
    wait: React.PropTypes.number,
    reset: React.PropTypes.func,
    home: React.PropTypes.func
  },
  getAvergeTr(){
    var cntOfLocations = counter(this.props.seq);
    var cntOfStops = counter(this.props.stopSeq);
    var cntOfAnswers = counter(this.props.userAnswers);
    var numberOfCorrects = counter(this.props.corrects)['정답'];
    if(!numberOfCorrects){
      numberOfCorrects = 0;
    }
    var avgOfCorrects =  numberOfCorrects / this.props.corrects.length;
    var validDelays = this.props.delays.filter((x) => x != '');
    var avgOfDelays = validDelays.reduce((a, b) => a+b)/validDelays.length;
    return (
      <TableRow
        idx='avg.'
        location={makeString(cntOfLocations)}
        stop={makeString(cntOfStops)}
        userAnswer={makeString(cntOfAnswers)}
        correct={avgOfCorrects.toFixed(2)}
        delay={avgOfDelays.toFixed(2)}
      />
    )
  },

  getList(){
    var ret = [];
    for (var i=0; i<this.props.corrects.length; i++){
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          location={this.props.seq[i]}
          stop={this.props.stopSeq[i]}
          delays={this.props.delays[i]}
          userAnswer={this.props.userAnswers[i]}
          correct={this.props.corrects[i]}
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
                <th>위치</th>
                <th>정지신호(ms)</th>
                <th>응답</th>
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
        //'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props)
    }
    fetch(makeUrl('/app4/result'), requestHeader)
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
    this.sendResult();
  }
});

module.exports = Result;
