import React, { Component } from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import DataLoader from './components/DataLoader/DataLoader'
import ControlPanel from './components/ControlPanel/ControlPanel'
import D3Plot from './components/D3Plot/D3Plot'
import css from './App.css';

// import sampleData from './data/data.json'

const dataToDefaultState = data => {
  let filteredData = data;

  let optionsTime = data.map(
    row => timeFormat("%Y%m")(timeParse("%m/%d/%Y")(row.date))
  ).filter(
    (el, i, arr) => arr.indexOf(el) === i
  ).map(YYYYMM => ({
    value: YYYYMM,
    label: timeFormat("%B, %Y")(timeParse("%Y%m")(YYYYMM))
  }));
  let optionsSiteStation = data.map(
    row => row.site_station
  ).filter((el, i, arr) => arr.indexOf(el) === i).map(
    el => ({ value: el, label: el })
  ).sort(
    (a, b) => a.label > b.label ? 1 : -1
  );

  let selectedTime = optionsTime.map(el => +el.value);
  let selectedSiteStation = optionsSiteStation.map(el => el.value);

  return { data, filteredData, selectedTime, selectedSiteStation, optionsTime, optionsSiteStation }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = dataToDefaultState([]);
    // this.state = dataToDefaultState(sampleData);
  }

  dataHandler = data => {
    this.setState(
      dataToDefaultState(data)
    );
  }

  timeHandler = selectedArray => {
    let filteredData = [...this.state.data];

    if(selectedArray.length !== this.state.optionsTime.length) {
      filteredData = filteredData.filter(
        el => selectedArray.indexOf(+timeFormat("%Y%m")(timeParse("%m/%d/%Y")(el.date))) > -1
      );
    }

    if(this.state.selectedSiteStation.length !== this.state.optionsSiteStation.length) {
      filteredData = filteredData.filter(
        el => this.state.selectedSiteStation.indexOf(el.site_station) > -1
      );
    }

    this.setState({ selectedTime: selectedArray, filteredData });
  }

  siteStationHandler = selectedArray => {
    let filteredData = [...this.state.data];

    if(selectedArray.length !== this.state.optionsSiteStation.length) {
      filteredData = filteredData.filter(
        el => selectedArray.indexOf(el.site_station) > -1
      );
    }

    if(this.state.selectedTime.length !== this.state.optionsTime.length) {
      filteredData = filteredData.filter(
        el => this.state.selectedTime.indexOf(+timeFormat("%Y%m")(timeParse("%m/%d/%Y")(el.date))) > -1
      );
    }

    this.setState({ selectedSiteStation: selectedArray, filteredData });
  }

  render() {
    let { data, filteredData, selectedTime, selectedSiteStation, optionsTime, optionsSiteStation } = this.state;

    return (
      <div className={ css.App }>
        { data.length !== 0 ? <ControlPanel
          optionsTime={ optionsTime }
          optionsSiteStation={ optionsSiteStation }
          onTimeSelection={ this.timeHandler }
          onSiteStationSelection={ this.siteStationHandler }
        /> : null }
        { data.length !== 0 ? <D3Plot
          filteredData={ filteredData }
          selectedTime={ selectedTime }
          selectedSiteStation={ selectedSiteStation }
        /> : null }
        { data.length === 0 ? <DataLoader
          onDataLoading={ this.dataHandler }
        /> : null }
      </div>
    );
  }
}

export default App;
