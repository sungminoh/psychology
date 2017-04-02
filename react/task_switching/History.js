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
        <td>{this.props.value}</td>
        <td>{this.props.quantity}</td>
        <td>{this.props.gameType}</td>
        <td>{this.props.compatibility}</td>
        <td>{this.props.userAnswer}</td>
        <td>{this.props.correct}</td>
        <td>{this.props.delay}</td>
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
        value={row[1]}
        quantity={row[2]}
        gameType={row[3]}
        compatibility={row[4]}
        userAnswer={row[5]}
        correct={row[6]}
        delay={row[7]}
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
    fetch(makeUrl('/result/task_switching'), { method: 'GET', accept: 'application/json'})
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
    this.props.router.push({ pathname: makeUrl('/game/task_switching') });
  },
  requestRemoveAll(e){
    var password = prompt('비밀번호를 입력하세요.');
    fetch(makeUrl('/result/task_switching'), { method: 'DELETE', accept: 'application/json', body: JSON.stringify({'password': password})})
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
        <Form inline style={{margin:"0", display:"inline"}} method='GET' action={makeUrl('/download/task_switching')}>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        {' '}
        <Button onClick={this.requestRemoveAll} > 전체 삭제 </Button>

        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>숫자</th>
              <th>개수</th>
              <th>게임 타입</th>
              <th>변경</th>
              <th>입력</th>
              <th>정오</th>
              <th>응답 시간</th>
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
