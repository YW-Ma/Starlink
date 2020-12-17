import React, {Component} from 'react';
import axios from 'axios';

import {feature} from "topojson-client"
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

import {WORLD_MAP_URL} from "../constants"

const width = 1024;
const height = 768;

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    }
    this.refMap = React.createRef();                                  // use ref to get a virtual node. So as we can draw on it.
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

  generateMap = land => {
    const projection = geoKavrayskiy7()                            // Step 1: configure the projection method
      .scale(180)
      //.translate(width / 2, height / 2)                          // NOTICE: translate need an array
      .translate([width / 2, height / 2])
      .precision(.1);

    const graticule = geoGraticule();                              // Step 2: get the longitude and latitude

    const canvas = d3Select(this.refMap.current)                  // Step 3: let d3-selection get the canvas to draw
      .attr("width", width)
      .attr("height", height);

    const context = canvas.node().getContext("2d");       // path can convert realworld data to context using projection
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
  }

  render() {
    return (
      <div className="map-box">
        <canvas className="map" ref={this.refMap}/>
      </div>
    );
  }
}

export default WorldMap;
