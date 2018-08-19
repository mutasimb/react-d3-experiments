import React, { Component } from 'react';
import logo from './logo.svg';
import css from './App.css';

import DataLoader from './components/DataLoader/DataLoader'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  dataHandler = data => {
    this.setState({ data });
  }

  render() {
    let { data } = this.state;

    return (
      <div className={ css.App }>
        <header className={ css.AppHeader }>
          <img src={logo} className={ css.AppLogo } alt="logo" />
          <h1 className={ css.AppTitle }>Welcome to React</h1>
        </header>
        <p className={ css.AppIntro }>{ JSON.stringify(data[0], null, 2) }</p>
        { data.length === 0 ? <DataLoader onDataLoading={ this.dataHandler } /> : null }
      </div>
    );
  }
}

export default App;
