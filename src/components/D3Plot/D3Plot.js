import React, { Component } from 'react'

import css from './D3Plot.css'

export default class D3Plot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  render() {
    return (
      <div className={ css.D3Plot } >
        <p>{ JSON.stringify(this.props.data) }</p>
      </div>
    )
  }
}
