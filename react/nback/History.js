import React from 'react';
import { Table, Button, Form, FormGroup } from 'react-bootstrap';
import { makeUrl } from '../helpers';


var TableRow = React.createClass({
  render(){
    var date = new Date(this.props.ts);
    var dateText = date.toLocaleString();
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.gameSeq}</td>
        <td>{this.props.numberSeq}</td>
        <td>{this.props.nback}</td>
        <td>{this.props.number}</td>
        <td>{this.props.hit}</td>
        <td>{this.props.userInput}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.expose}</td>
        <td>{this.props.blink}</td>
        <td>{dateText}</td>
      </tr>
    )
  }
});


function getList(data){
  var ret = [];
  for (var i=0; i<data.length; i++){
    var row = data[i]
    ret.push(
      <TableRow
        key={i+1}
        idx={row[0]}
        gameSeq={row[1]}
        numberSeq={row[2]}
        nback={row[3]}
        number={row[4]}
        hit={row[5]}
        userInput={row[6]}
        correct={row[7]}
        expose={row[8]}
        blink={row[9]}
        ts={row[10]}
      />
    )
  }
  return ret;
}


var History = React.createClass({
  getInitialState(){
    return{
      fetched: false
    }
  },
  getResultHistory(){
    fetch(makeUrl('/result/nback'), { method: 'GET', accept: 'application/json'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson.result;
        this.setState({fetched: true});
      })
      .catch((error) => {
        alert('데이터를 가져오지 못하였습니다. 다시 시도하세요.');
      });
  },
  redirectToGame(e){
    this.props.router.push({ pathname: makeUrl('/game/nback') });
  },
  requestRemoveAll(e){
    var password = prompt('비밀번호를 입력하세요.');
    fetch(makeUrl('/result/nback'), { method: 'DELETE', accept: 'application/json', body: JSON.stringify({'password': password})})
      .then((response) => response.ok)
      .then((responseOk) => {
        if(responseOk){
          this.setState({fetched: false});
          alert('데이터를 성공적으로 삭제하였습니다.');
        }
      })
      .catch((error) => {
        alert('데이터를 삭제하는데 실패하였습니다. 다시 시도하세요.');
      });
  },
  render(){
    return (
      <div>
        <Button onClick={this.redirectToGame}> 게임 하기 </Button>
        {' '}
        <Form inline style={{margin:"0", display:"inline"}} method='GET' action={makeUrl('/download/nback')}>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        {' '}
        <Button onClick={this.requestRemoveAll} > 전체 삭제 </Button>

        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>게임 번호</th>
              <th>숫자 순서</th>
              <th>N back</th>
              <th>자극</th>
              <th>일치 여부</th>
              <th>응답</th>
              <th>정답</th>
              <th>노출 시간(ms)</th>
              <th>공백 시간(ms)</th>
              <th>실험 시각</th>
            </tr>
          </thead>
          <tbody>
            {this.state.fetched ? getList(this.data) : null}
          </tbody>
        </Table>
      </div>
    )
  },
  componentDidMount(){
    this.getResultHistory();
  }
});

module.exports = History;
