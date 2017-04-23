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
import SpatialmMemory from './spatial_memory';

import VisualWorkingMemoryGame from './visual_working_memory/Game';
import MentalRotationGame from './mental_rotation/Game';
import TaskSwitchingGame from './task_switching/Game';
import StopSignalTaskGame from './stop_signal_task/Game';
import NbackGame from './nback/Game';
import SpatialmMemoryGame from './spatial_memory/Game';

import VisualWorkingMemoryHistory from './visual_working_memory/History';
import MentalRotationHistory from './mental_rotation/History';
import TaskSwitchingHistory from './task_switching/History';
import StopSignalTaskHistory from './stop_signal_task/History';
import NbackHistory from './nback/History';
import SpatialmMemoryHistory from './spatial_memory/History';

import { makeUrl } from './helpers';
import { base } from './config';


function Index(props){
  return props.children;
}


var Selector = React.createClass({
  handleClick(e){
    var value = e.target.value;
    this.props.router.push({ pathname: makeUrl('/' + value) });
  },

  render(){
    const wellStyles = {
      position: 'relative',
      maxWidth: 400,
      margin: 'auto'
    };
    return (
      <div className="well" style={wellStyles}>
        <Button value='visual_working_memory' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Visual Working Memory
        </Button>
        <Button value='mental_rotation' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Mental Rotation
        </Button>
        <Button value='task_switching' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Task Switching
        </Button>
        <Button value='stop_signal_task' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Stop Sginal Task
        </Button>
        <Button value='nback' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          N back
        </Button>
        <Button value='spatial_memory' bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          Spatial Memory
        </Button>
      </div>
    )
  }
});

const rootElement = document.getElementById('root');
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path={base} component={Index}>
      <IndexRoute component={Selector}/>
      <Route path='/visual_working_memory' component={VisualWorkingMemory}/>
      <Route path='/mental_rotation' component={MentalRotation}/>
      <Route path='/task_switching' component={TaskSwitching}/>
      <Route path='/stop_signal_task' component={StopSignalTask}/>
      <Route path='/nback' component={Nback}/>
      <Route path='/spatial_memory' component={SpatialmMemory}/>
      <Route path='/game/visual_working_memory' component={VisualWorkingMemoryGame}/>
      <Route path='/game/mental_rotation' component={MentalRotationGame}/>
      <Route path='/game/task_switching' component={TaskSwitchingGame}/>
      <Route path='/game/stop_signal_task' component={StopSignalTaskGame}/>
      <Route path='/game/nback' component={NbackGame}/>
      <Route path='/game/spatial_memory' component={SpatialmMemoryGame}/>
      <Route path='/history/visual_working_memory' component={VisualWorkingMemoryHistory}/>
      <Route path='/history/mental_rotation' component={MentalRotationHistory}/>
      <Route path='/history/task_switching' component={TaskSwitchingHistory}/>
      <Route path='/history/stop_signal_task' component={StopSignalTaskHistory}/>
      <Route path='/history/nback' component={NbackHistory}/>
      <Route path='/history/spatial_memory' component={SpatialmMemoryHistory}/>
    </Route>
  </Router>
), rootElement);
