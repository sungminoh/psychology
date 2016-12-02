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
    if(e.target.id == 1){
      this.props.router.push({ pathname: makeUrl('/app2/game') });
    }else{
      this.props.router.push({ pathname: makeUrl('/app2/history') });
    }
  },
  render(){
    return (
      <div className="well" style={wellStyles}>
        <Button id={1} bsStyle="info" bsSize="large" onClick={this.handleClick} block>
          게임 시작
        </Button>
        <Button id={2} bsStyle="info" bsSize="large" onClick={this.handleClick} block>
          결과 보기
        </Button>
      </div>
    )
  }
});


module.exports = {
  path: 'app2',
  component: Index,
  indexRoute: {component: Selector},
  childRoutes: [
    {
      path: 'game',
      component: Game
    },
    {
      path: 'history',
      component: History
    }
  ]
}
