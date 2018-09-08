import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'
import { csv } from 'd3-request'
import { format } from 'd3-format'
import classnames from 'classnames'

import css from './DataLoader.css'

export default class DataLoader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSampleDownload: false,
      validDataLoaded: false,
      message: '',
      error: false
    }
  }

  setErrorMessage = (message, duration = 2500) => {

    this.setState({ message, error: true });
    setTimeout(() => {
      this.setState({ message: '', error: false });
    }, duration);

  }

  setSuccessMessage = message => {

    this.setState({ message, validDataLoaded: true });

  }

  readCsv = file => {
    csv(file, data => {

      let requiredColumns = ["date", "site_id", "station_id", "rainfall_mm"];
      let missingColumns = requiredColumns.filter(col => Object.keys(data[0]).indexOf(col) === -1);

      if(missingColumns.length > 0) {
        this.setState({ showSampleDownload: true });

        this.setErrorMessage(
          `The loaded .csv file isn't properly formatted. The following columns are missing from the data table: ${
            missingColumns.join(", ")
          }.`,
          6000
        );
      
      } else {

        this.setSuccessMessage("Success!");
        setTimeout(() => {

          this.props.onDataLoading(
            data.map(row => ({
              date: row.date,
              site_station: `${row.site_id}-${ format("02")(row.station_id) }`,
              rainfall_mm: +row.rainfall_mm
            }))
          );

        }, 1500);
      
      }

    });
  }

  onDrop = files => {

    if(files.length > 1) {
      this.setErrorMessage("Please do not load multiple files!");
    } else if(files[0].name.indexOf(".csv") === -1 || (files[0].type !== "text/csv" && files[0].type !== "application/vnd.ms-excel")) {
      this.setErrorMessage("Please load a valid .csv file");
    } else {

      let reader = new FileReader();
      reader.onloadend = event => {
        let dataUrl = event.target.result;
        this.readCsv(dataUrl);
      }

      reader.readAsDataURL(files[0]);
    
    }
    
  }

  render() {
    let { message, error, validDataLoaded } = this.state;

    return <div className={ css.DataLoader }>
      <ReactDropzone
        className={ classnames(css.DropZone, {
          [`${ css.Error }`]: error,
          [`${ css.Success }`]: validDataLoaded
        }) }
        activeClassName={ css.Active }
        onDrop={ this.onDrop }
        style={{
          position: "fixed",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          padding: "30px",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className={ css.DottedBox } >
          <span className={ classnames("lnr", "lnr-upload", css.LnrUpload) }></span>
          { message === '' ? <p>Drag here or <span>browse</span> to upload</p> : <p>{message}</p> }
        </div>
      </ReactDropzone>
      { this.state.showSampleDownload ? <a className={ css.SampleDownload } href="data/sample_data.csv" download>
        <p>Sample formatted .csv file</p>
      </a> : null}
    </div>;
  }
}
