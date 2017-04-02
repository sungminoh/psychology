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
        <td>{this.props.char}</td>
        <td>{this.props.rotation}</td>
        <td>{this.props.flip}</td>
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
        char={row[1]}
        rotation={row[2]}
        flip={row[3]}
        userAnswer={row[4]}
        correct={row[5]}
        delay={row[6]}
        ts={row[7]}
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
    fetch(makeUrl('/result/mental_rotation'), { method: 'GET', accept: 'application/json'})
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
    this.props.router.push({ pathname: makeUrl('/game/mental_rotation') });
  },
  requestRemoveAll(e){
    var password = prompt('비밀번호를 입력하세요.');
    fetch(makeUrl('/result/mental_rotation'), { method: 'DELETE', accept: 'application/json', body: JSON.stringify({'password': password})})
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
        <Form inline style={{margin:"0", display:"inline"}} method='GET' action={makeUrl('/download/mental_rotation')}>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        {' '}
        <Button onClick={this.requestRemoveAll} > 전체 삭제 </Button>

        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>문자</th>
              <th>회전</th>
              <th>반전</th>
              <th>입력</th>
              <th>정답</th>
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
