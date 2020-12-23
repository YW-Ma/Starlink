import React, { Component } from 'react';
import axios from 'axios';
import { Spin } from "antd"

import { feature } from "topojson-client"
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';
import { timeFormat as d3TimeFormat } from "d3-time-format";
import { schemeCategory10 } from "d3-scale-chromatic";
import * as d3Scale from "d3-scale";

import {WORLD_MAP_URL, SATELLITE_POSITION_URL, SAT_API_KEY, ANIMATION_SPEED, RERENDER_PER_SECOND} from "../constants"


const width = 1024;
const height = 768;

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDrawing: false
    }
    this.refMap = React.createRef();                                  // use ref to get a virtual node. So as we can draw on it.
    this.refTrack = React.createRef();
    this.map = null;
    this.color = d3Scale.scaleOrdinal(schemeCategory10); // connect color and number
  }

  componentDidMount() {
    axios.get(WORLD_MAP_URL)
      .then( res => {
        const { data } = res;                                         // retrieve the map data
        const land = feature(data, data.objects.countries).features;  // land: border of 177 countries; topo: data, object: countries
        this.generateMap(land);                                       // draw
      })
      .catch(e => console.error("err in fetch world map data", e));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // determine whether prevProps and current props is different. Make a HTTPRequest only when props changed.
    if(prevProps.satList !== this.props.satList) {
      const {latitude, longitude, elevation, altitude, duration} = this.props.settings;
      const endTime = duration * ANIMATION_SPEED; // speed up

      this.setState({
        isLoading: true
      });

      // step1: fetch data from API - a list of promise object
      const urls = this.props.satList.map(sat => {
        // Request: /positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}//&apiKey={API_KEY}
        const { satid } = sat;
        const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${altitude}/${endTime}/&apiKey=${SAT_API_KEY}`;
        // send ajax call
        return axios.get(url);
      })

      // step2: handle urls and extract results - Promise.all(...array...).then(results=>{})
      Promise.all(urls)
        .then(results => { // results are all returned promises from each axios.get(url)
          this.setState({
            isLoading: false,
            isDrawing: true
          });
          if (!prevState.isDrawing) {
            const data = results.map(item => item.data);
            this.track(data);
          } else {
            const oHint = document.getElementsByClassName("hint")[0];
            oHint.innerHTML =
              "Please wait for these satellite animation to finish before selection new ones!";
          }
        })
        .catch(e => {
          console.error("failed -> ", e);
        });
    }
  }

  // a callback used in componentDidUpdate - draw all satellites on the second canvas.
  track = data => {
    // validate the input
    if (!data || !data[0].hasOwnProperty('positions')) {
      throw new Error("no position data", data);
    }

    const len = data[0].positions.length;
    const { duration } = this.props.settings;
    const { context2 } = this.map;

    // Step 1: draw time on the top
    // current time
    let initialTime = new Date();
    let i = 0;
    // interval between two drawing
    let timer = setInterval(() => {
      let currentTime = new Date();
      let timePassed = i === 0 ? 0 : currentTime - initialTime;
      // 1 sec in display == 1 minute in real world (corresponding to accelerated positions we got)
      let time = new Date(initialTime.getTime() + 60 * timePassed);

      context2.clearRect(0, 0, width, height); // clear the rect area.

      context2.font = "bold 20px sans-serif";
      context2.fillStyle = "#333";
      context2.textAlign = "center";
      context2.fillText(d3TimeFormat(time), width / 2, 20);

      if (i >= len) {                   // timer cannot excced the length of positions array
        clearInterval(timer);
        this.setState({ isDrawing: false });
        const oHint = document.getElementsByClassName("hint")[0];
        oHint.innerHTML = "";
        return;
      }

      data.forEach(sat => {             // draw
        const { info, positions } = sat;
        this.drawSat(info, positions[i]);
      });

      i += ANIMATION_SPEED / RERENDER_PER_SECOND;
    }, 1000 / RERENDER_PER_SECOND)
  }

  // a helper function used in track to draw each satellite
  drawSat = (sat, pos) => {
    const { satlongitude, satlatitude } = pos;
    if (!satlongitude || !satlongitude) return;

    const { satname } = sat;
    const nameWithNumber = satname.match(/\d+/g).join(""); // extract satname number

    const { projection, context2 } = this.map;
    const xy = projection([satlongitude, satlatitude]); // get coordinate
    context2.fillStyle = this.color(nameWithNumber); // name is a number
    context2.beginPath();
    context2.arc(xy[0], xy[1], 4, 0,2 * Math.PI); //radius, startAngle, endAngle
    context2.fill();

    context2.font = "bold 11px sans-serif";
    context2.textAlign = "center";
    context2.fillText(nameWithNumber, xy[0], xy[1] + 14);
  }

  // a callback used in componentDidMount - prepare 2 canvases' context & draw a world map on the first canvas
  generateMap = land => {
    const projection = geoKavrayskiy7()                            // Step 1: configure the projection method
      .scale(180)
      //.translate(width / 2, height / 2)                          // NOTICE: translate need an array
      .translate([width / 2, height / 2])
      .precision(.1);

    const graticule = geoGraticule();                              // Step 2: get the longitude and latitude

    const canvas = d3Select(this.refMap.current)                  // Step 3.1: let d3-selection get the canvas to draw world map
      .attr("width", width)
      .attr("height", height);

    const canvas2 = d3Select(this.refTrack.current)               // Step 3.2: let d3 get the canvas to draw the satellite
      .attr("width", width)
      .attr("height", height);

    const context = canvas.node().getContext("2d");       // path can convert realworld data to context using projection
    const context2 = canvas2.node().getContext("2d");

    let path = geoPath().projection(projection).context(context);

    land.forEach( ele => {                                        // Step 4.1 : draw countries' border
      context.fillStyle = '#B3DDEF';
      context.strokeStyle = '#000';
      context.globalAlpha = 0.7;
      context.beginPath();
      path(ele);            // draw the border of a country
      context.fill();       // fill the country
      context.stroke();
    })

    context.strokeStyle = 'rgba(220, 220, 220, 0.5)';           //Step 4.2: draw longitude and latitude
    context.beginPath();
    path(graticule());
    context.lineWidth = 1;
    context.stroke();

    context.beginPath();                                        //Step 4.3: draw head and bottom
    context.lineWidth = 1;
    path(graticule.outline());
    context.stroke();

    this.map = {                                                //Step 5: store map in a field. they don't update UI so
      context: context,                                          //       there is no need to store them in a state
      context2: context2,
      projection: projection
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="map-box">
        {isLoading ? (
          <div className="spinner">
            <Spin tip="Loading..." size="large" />
          </div>
        ) : null}
        <canvas className="map" ref={this.refMap}/>
        <canvas className="track" ref={this.refTrack}/>
        <div className="hint" />
      </div>
    );
  }
}

export default WorldMap;
