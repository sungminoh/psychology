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
        <td>{this.props.seq}</td>
        <td>{this.props.stopSeq}</td>
        <td>{this.props.userInput}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.fixation}</td>
        <td>{this.props.blink}</td>
        <td>{this.props.wait}</td>
        <td>{dateText}</td>
      </tr>
    )
  }
});


function  getList(data){
  var ret = [];
  for (var i=0; i<data.length; i++){
    var row = data[i]
    ret.push(
      <TableRow
        key={i+1}
        idx={row[0]}
        seq={row[1]}
        stopSeq={row[2]}
        userInput={row[3]}
        correct={row[4]}
        fixation={row[5]}
        blink={row[6]}
        wait={row[7]}
        ts={row[8]}
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
    fetch(makeUrl('/app4/result'), { method: 'GET', accept: 'application/json'})
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
    this.props.router.push({ pathname: makeUrl('/app4/game') });
  },
  requestRemoveAll(e){
    var password = prompt('비밀번호를 입력하세요.');
    fetch(makeUrl('/app4/result'), { method: 'DELETE', accept: 'application/json', body: JSON.stringify({'password': password})})
      .then((response) => {
        if(response.status == 200){
          this.setState({fetched: false});
          alert('데이터를 성공적으로 삭제하였습니다.');
        }else{
          alert('데이터를 삭제할 수 없습니다.\n[' + response.statusText + ']');
        }
      })
      .catch((error) => {
        alert('데이터를 삭제하는데 실패하였습니다. 관리자에게 문의하세요.\n' + error.toString());
      });
  },
  render(){
    return (
      <div>
        <Button onClick={this.redirectToGame}> 게임 하기 </Button>
        {' '}
        <Form inline style={{margin:"0", display:"inline"}} method='GET' action={makeUrl('/app4/download')}>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        {' '}
        <Button onClick={this.requestRemoveAll} > 전체 삭제 </Button>

        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>위치</th>
              <th>정지신호(ms)</th>
              <th>응답</th>
              <th>정답</th>
              <th>픽세이션(ms)</th>
              <th>공백 시간(ms)</th>
              <th>응답 대기 시간(ms)</th>
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
