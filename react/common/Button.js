import React from 'react'
import { Button } from 'react-bootstrap';

export default class MyButton extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const {
      id,
      value,
      disabled,
      onClick,
      style,
      type,
      children,
    } = this.props
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return <Button id={id} value={value} type={type} disabled={disabled} style={style} onTouchStart={onClick} > {children} </Button>;
    }else{
      return <Button id={id} value={value} type={type} disabled={disabled} style={style} onClick={onClick} > {children} </Button>;
    }
  }
}

