import React, { Component } from 'react';
import logo from './logo.svg';
import css from './App.css';

import DataLoader from './components/DataLoader/DataLoader'

class App extends Component {
  render() {
    return (
      <div className={ css.App }>
        <header className={ css.AppHeader }>
          <img src={logo} className={ css.AppLogo } alt="logo" />
          <h1 className={ css.AppTitle }>Welcome to React</h1>
        </header>
        <DataLoader />
        <p className={ css.AppIntro }>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
