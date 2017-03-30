import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'whatwg-fetch';
import { Button } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';

import VisualWorkingMemory from './visual_working_memory';
import MentalRotation from './mental_rotation';
import TaskSwitching from './task_switching';
import StopSignalTask from './stop_signal_task';
import Nback from './nback';

import { makeUrl } from './helpers';
import { base } from './config';


function Index(props){
  return props.children;
}


var Selector = React.createClass({
  handleClick(e){
    var id = e.target.id;
    this.props.router.push({ pathname: makeUrl('/' + id) });
  },

  render(){
    const wellStyles = {
      position: 'relative',
      maxWidth: 400,
      margin: 'auto'
    };
    return (
      <div className="well" style={wellStyles}>
        <Button id='visual-working-memory' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Visual Working Memory
        </Button>
        <Button id='mental-rotation' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Mental Rotation
        </Button>
        <Button id='task-switching' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Task Switching
        </Button>
        <Button id='stop-signal-task' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Stop Sginal Task
        </Button>
        <Button id='nback' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          N-back
        </Button>
      </div>
    )
  }
});


const routes = {
  path: base,
  component: Index,
  indexRoute: {component: Selector},
  childRoutes: [
    VisualWorkingMemory,
    MentalRotation,
    TaskSwitching,
    StopSignalTask,
    Nback
  ]
}


const rootElement = document.getElementById('root');
ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
  />, rootElement)
