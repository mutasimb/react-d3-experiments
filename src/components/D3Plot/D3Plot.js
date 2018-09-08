import React, { Component } from 'react'
import { timeFormat, timeParse } from 'd3-time-format'
import { max, range } from 'd3-array'

import css from './D3Plot.css'
import SvgElement from './SvgElement/SvgElement'

const currentTimeStationToData = (filteredData, objTimeStation) => {
  let { station, time } = objTimeStation;

  let data = filteredData.filter(
    row => +timeFormat("%Y%m")(timeParse("%m/%d/%Y")(row.date)) === time && row.site_station === station
  ).map(
    el => ({ date: +timeFormat("%d")(timeParse("%m/%d/%Y")(el.date)), rainfall_mm: el.rainfall_mm })
  );

  let daysInMonth = new Date(+`${ time }`.slice(0, 4), +`${ time }`.slice(4, 6), 0).getDate();
  return range(daysInMonth).map(date => {
    let filteredByDate = data.filter(row => row.date === date+1);
    return filteredByDate.length ? filteredByDate[0] : { date: date + 1, rainfall_mm: 0 };
  });

}

const updateStateFromProps = props => {
  let { filteredData, selectedSiteStation, selectedTime } = props;
  let objectsArr = [];
  
  selectedSiteStation.forEach(elSt => {
    selectedTime.forEach(elTm => {
      let dataStTm = filteredData.filter(row => elTm === +timeFormat("%Y%m")(timeParse("%m/%d/%Y")(row.date)) && elSt === row.site_station);
      if(dataStTm.length > 0) objectsArr.push({ time: elTm, station: elSt, maxRain: max(dataStTm, d => +d.rainfall_mm) });
    });
  });

  return { index: 0, objectsArr, data: currentTimeStationToData(filteredData, objectsArr[0]) };
}

export default class D3Plot extends Component {
  constructor(props) {
    super(props);
    let { index, objectsArr, data } = updateStateFromProps(this.props);
    this.state = { index, objectsArr, data };
  }

  componentWillReceiveProps(nextProps) {
    let { index, objectsArr, data } = updateStateFromProps(nextProps);

    this.setState({ index, objectsArr, data });
  }

  updateDataOnNavigation = (i) => {
    let { objectsArr } = this.state,
      { filteredData } = this.props;

    this.setState({ index: i, data: currentTimeStationToData(filteredData, objectsArr[i]) });
  }

  navigate = e => {
    let { index, objectsArr } = this.state;
    if(e === "prev") {
      index = index > 0 ? index - 1 : 0;
    } else if(e === "next") {
      index = index < objectsArr.length-1 ? index + 1 : objectsArr.length-1;
    }

    this.updateDataOnNavigation(index);
  }

  render() {
    let { data, objectsArr, index } = this.state;
    let { station, time } = objectsArr[index];

    return (
      <div className={ css.D3Plot } >
        <div className={ css.PlotHeader } >
          <h3 className={ css.PlotTitle} >{ station }</h3>
          <div className={ css.NavBtns } >
            <p>{ index+1 } / { objectsArr.length }</p>
            <button onClick={ () => this.navigate("prev") } >{'<<'}</button>
            <button onClick={ () => this.navigate("next") } >{'>>'}</button>
          </div>
        </div>
        <SvgElement
          data={ data }
          yMax={ max(objectsArr, d => d.maxRain) }
          YYmm={ timeFormat("%B, %Y")(timeParse("%Y%m")(time)) }
        />
      </div>
    )
  }
}
