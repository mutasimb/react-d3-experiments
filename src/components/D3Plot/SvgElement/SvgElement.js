import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { axisLeft } from 'd3-axis'
import {  } from 'd3-transition'

import css from './SvgElement.css'

export default class SvgElement extends Component {
  constructor(props) {
    super(props);

    let w = 1024,
      h = 768,
      mrg = 25,
      hLabelX = 16,
      hLabelY = 16,
      wBar = 16,
      p = { lm: 11, axY: 15, axX: 21 };
    let wBorder = w - mrg*2 - hLabelY - p.lm - p.axY,
      hBorder = h - 2*mrg - hLabelX - p.axX;
    let wBars = wBorder - 2 - mrg*2,
      hBars = hBorder - 2 - 2*mrg;
    
    this.state = {
      w, h, mrg, wBar, wBars, hBars, hLabelX, hLabelY, p, wBorder, hBorder,
      xScale: scaleLinear().range([0, wBars]).domain([1, 32]),
      yScale: scaleLinear().range([hBars, 0]).domain([0, this.props.yMax])
    };

  }

  createBars = props => {

    let { data } = props;
    let { xScale, yScale, wBars, hBars, mrg, wBar, p, hLabelY, hBorder } = this.state;
    let transitionDuration = 250,
      transitionDelay = 0;


    let gBars = select(this.refs.gBars)
      .attr("transform", `translate(${ 2*mrg + 1 + p.lm + hLabelY + p.axY + wBars/(2 * 31) - wBar/2 }, ${ 2*mrg + 1 })`);

    let selection = gBars.selectAll("rect").data(data);
    selection.exit()
      .transition()
      .duration(transitionDuration)
      .delay((_, i) => i * transitionDelay)
      .attr("opacity", 0)
      .remove();
    selection.enter()
      .append("rect")
      .attr("fill", "steelblue")
      .attr("stroke", "black")
      .attr("x", d => xScale(d.date))
      .attr("width", wBar)
      .attr("opacity", 0)
      .attr("y", yScale(0.1))
      .attr("height", hBars - yScale(0.1))
      .transition()
      .duration(transitionDuration)
      .delay((_, i) => i * transitionDelay)
      .attr("opacity", 1)
      .attr("y", d => yScale(d.rainfall_mm < 0.1 ? 0.1 : d.rainfall_mm))
      .attr("height", d => hBars - yScale(d.rainfall_mm < 0.1 ? 0.1 : d.rainfall_mm));
    selection
      .transition()
      .duration(transitionDuration)
      .delay((_, i) => i * transitionDelay)
      .attr("x", d => xScale(d.date))
      .attr("width", wBar)
      .attr("y", d => yScale(d.rainfall_mm < 0.1 ? 0.1 : d.rainfall_mm))
      .attr("height", d => hBars - yScale(d.rainfall_mm < 0.1 ? 0.1 : d.rainfall_mm));

    let gAxisXText = select(this.refs.gAxisXText)
      .attr("transform", `translate(${ wBars/(2 * 31) }, ${ hBorder + 18 })`);
    let gAxisXTick = select(this.refs.gAxisXTick)
      .attr("transform", `translate(${ wBars/(2 * 31) }, 0)`);
    let selectionAxisXText = gAxisXText.selectAll("text").data(data);
    let selectionAxisXTick = gAxisXTick.selectAll("line").data(data);

    selectionAxisXText.exit()
      .transition().duration(transitionDuration)
      .attr("opacity", 0).remove();
    selectionAxisXTick.exit()
      .transition().duration(transitionDuration)
      .attr("opacity", 0).remove();
    selectionAxisXText.enter()
      .append("text")
      .text(d => d.date)
      .attr("transform", d => `translate(${ xScale(d.date) }, 0)`)
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .transition().duration(transitionDuration)
      .attr("opacity", 1);
    selectionAxisXTick.enter()
      .append("line")
      .attr("transform", d => `translate(${ xScale(d.date) }, 0)`)
      .attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 6 + hBorder)
      .attr("stroke", "black")
      .attr("opacity", 0)
      .transition().duration(transitionDuration)
      .attr("opacity", 1);

  }

  componentDidUpdate() {
    this.createBars(this.props);
  }

  componentDidMount() {
    let { yScale, mrg, wBars, hBars, h, hLabelY, p, wBorder, hBorder } = this.state;
    let { yMax } = this.props;

    yMax = Math.ceil(yMax / 10) * 10;
    yMax = yMax < 100 ? 100 : yMax;
    yScale.domain([0, yMax]);

    select(this.refs.gAxisX)
      .attr("transform", `translate(${ 2*mrg + 1 + p.lm + hLabelY + p.axY }, ${ /*h - mrg - hLabelX - p.axX*/ mrg })`)
      .attr("font-family", "Ubuntu")
      .attr("font-size", 11);
    
    let gAxisY = select(this.refs.gAxisY);
    gAxisY.call(axisLeft().scale(yScale).tickSize(wBorder + 6))
      .attr("transform", `translate(${ mrg + p.lm + hLabelY + p.axY + wBorder }, ${ mrg*2 + 1 })`)
      .attr("font-family", "Ubuntu")
      .attr("font-size", 11);
    
    select(this.refs.rectChartBorder)
      .attr("stroke", "black")
      .attr("fill", "transparent")
      .attr("x", mrg + p.lm + hLabelY + p.axY)
      .attr("width", wBorder)
      .attr("y", mrg)
      .attr("height", hBorder);

    select(this.refs.textLabelX)
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${ 2*mrg + 1 + p.lm + hLabelY + p.axY + wBars/2 }, ${ h - mrg })`);
    select(this.refs.textLabelY)
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${ mrg + p.lm }, ${ mrg + hBars/2 }) rotate(-90)`);

    this.createBars(this.props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { yScale, wBorder } = prevState;

    let yMax = Math.ceil(nextProps.yMax / 10) * 10;
    yMax = yMax < 100 ? 100 : yMax;
    yScale.domain([0, yMax]);

    let gAxisY = select("."+css["g-axis-y"]);
    gAxisY
      .transition()
      .duration(500)
      .call(axisLeft().scale(yScale).tickSize(wBorder + 6));

    return { ...prevState, yScale };
  }

  render() {
    let { w, h } = this.state;
    return (
      <svg
        id="svg"
        width={ w }
        height={ h }
        className={ css.SvgElement }
      >
        <text ref="textLabelX">Date of { this.props.YYmm }</text>
        <text ref="textLabelY">Rainfall (mm)</text>
        <g className={ css["g-axis-x"] } ref="gAxisX" >
          <g className="g-axis-x-text" ref="gAxisXText" ></g>
          <g className="g-axis-x-tick" ref="gAxisXTick" ></g>
        </g>
        <g className={ css["g-axis-y"] } ref="gAxisY" ></g>
        <rect ref="rectChartBorder" />
        <g className="g-bars" ref="gBars" ></g>
      </svg>
    )
  }
}
