import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import { makeUrl } from '../helpers'
import Game from './Game';
import History from './History';

const wellStyles = {
  position: 'relative',
  maxWidth: 400,
  margin: 'auto'
};


function Index(props){
  return props.children;
}


var Selector = React.createClass({
  handleClick(e){
    var value = e.target.value;
    this.props.router.push({ pathname: makeUrl('/' + value + '/task_switching') });
  },
  render(){
    return (
      <div className="well" style={wellStyles}>
        <Button value="game" bsStyle="info" bsSize="large" onClick={this.handleClick} block>
          게임 시작
        </Button>
        <Button value="history" bsStyle="info" bsSize="large" onClick={this.handleClick} block>
          결과 보기
        </Button>
      </div>
    )
  }
});

module.exports = Selector
