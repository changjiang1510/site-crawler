import React, { Component } from 'react';
class TableRow extends Component {
  constructor() {
    super()
    this.state = {
      background: null
    }
  }
  render() {
    const { children, className, style, ...rest } = this.props
    return (
      <div
        className={'rt-tr ' + className}
        style={{
          ...style,
          ...this.state
        }}
        {...rest}
        onMouseEnter={() => this.setState({
          background: 'rgba(0, 0, 0, 0.1)'
        })}
        onMouseLeave={() => this.setState({
          background: null
        })}
      >
        {children}
      </div>
    )
  }
}

export default TableRow;