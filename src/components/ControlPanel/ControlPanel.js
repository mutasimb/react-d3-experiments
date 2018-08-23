import React from 'react'
import Select from 'react-select'

import css from './ControlPanel.css'

export default props => {
  const onChangeTime = selectedItems => {
    if(selectedItems.length > 1) {
      props.onTimeSelection(selectedItems.map(el => +el.value).sort((a, b) => a - b));
    } else if(selectedItems.length === 1) {
      props.onTimeSelection(selectedItems.map(el => +el.value));
    } else {
      props.onTimeSelection(props.optionsTime.map(el => +el.value));
    }
  }

  const onChangeSiteStation = selectedItems => {
    if(selectedItems.length > 1) {
      props.onSiteStationSelection(selectedItems.map(el => el.value).sort((a, b) => a > b ? 1 : -1 ));
    } else if(selectedItems.length === 1) {
      props.onSiteStationSelection(selectedItems.map(el => el.value));
    } else {
      props.onSiteStationSelection(props.optionsSiteStation.map(el => el.value));
    }
  }

  return (
    <div className={ css.ControlPanel } >
      <Select
        className={ css.SelectDate }
        options={ props.optionsTime }
        closeMenuOnSelect={ false }
        isMulti
        onChange={ onChangeTime }
      />
      <Select
        className={ css.SelectSiteStation }
        options={ props.optionsSiteStation }
        closeMenuOnSelect={ false }
        isMulti
        onChange={ onChangeSiteStation }
      />
    </div>
  )
}
