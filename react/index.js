import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'whatwg-fetch';
import { Button } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import App1 from './app1/App1';
import App2 from './app2/App2';
import App3 from './app3/App3';
import { makeUrl } from './helpers';
import { base } from './config';
import Game from './app3/Game';


function Index(props){
  return props.children;
}


var Selector = React.createClass({
  handleClick(e){
    var id = e.target.id;
    if(id == 1){
        this.props.router.push({ pathname: makeUrl('/app1') });
    }else if(id == 2){
        this.props.router.push({ pathname: makeUrl('/app2') });
    }else if(id == 3){
        this.props.router.push({ pathname: makeUrl('/app3') });
    }else if(id == 4){
        this.props.router.push({ pathname: makeUrl('/app4') });
    }

  },
  render(){
    const wellStyles = {
      position: 'relative',
      maxWidth: 400,
      margin: 'auto'
    };
    return (
      <div className="well" style={wellStyles}>
        <Button id={1} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Visual Working Memory
        </Button>
        <Button id={2} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Mental Rotation
        </Button>
        <Button id={3} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Task Switching
        </Button>
        <Button id={4} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Stop Sginal Task
        </Button>
      </div>
    )
  }
});


const routes = {
  path: base,
  component:Index,
  //component:Game,
  indexRoute: {component: Selector},
  childRoutes:[
    App1, App2, App3
  ]
}


const rootElement = document.getElementById('root');
ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
  />, rootElement)
