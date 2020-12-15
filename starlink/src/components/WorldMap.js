import React, {Component} from 'react';
import axios from 'axios';

import {WORLD_MAP_URL} from "../constants"
import {feature} from "topojson-client"
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

const width = 900;
const height = 600;

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.refMap = React.createRef(); // use ref to get a virtual node. So as we can draw on it.
  }


  componentDidMount() {
    axios.get(WORLD_MAP_URL)
      .then( res => {
        const {data} = res; // retrieve the map data
        // land: border of 177 countries
        const land = feature(data, data.objects.countries).features; // topo: data, object: countries
        console.log("axios get the:", land);
        // draw
        this.generateMap(land);
      })
      .catch(e => console.log("err in fetch world map data", e));
  }

  generateMap = land => {
    console.log("In generateMap: land is",land)
    // WE CAN ALSO USE REACT SIMPLE MAP TO DRAW
    // configure the projection method
    const projection = geoKavrayskiy7()
      .scale(170)
      .translate(width / 2, height / 2)
      .precision(.1);
    console.log("projection", projection);
    // get the longitude and latitude
    const graticule = geoGraticule();

    // let d3-selection get the canvas to draw
    console.log("d3Select will select the", this.refMap.current)
    const canvas = d3Select(this.refMap.current)
      .attr("width", width)
      .attr("height", height);

    // path can convert realworld data to context using projection
    const context = canvas.node().getContext("2d");
    let path = geoPath().projection(projection).context(context);

    // draw
    land.forEach( ele => {
      console.log("ele",ele)
      // draw a line
      context.fillStyle = '#B3DDEF';
      context.strokeStyle = '#000';
      context.globalAlpha = 0.7;
      context.beginPath();
      path(ele); // draw the border of a country
      context.fill(); // fill the country
      context.stroke();
    })

    //draw longitude and latitude
    context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
    context.beginPath();
    path(graticule());
    context.lineWidth = 1;
    context.stroke();

    //draw head and bottom
    context.beginPath();
    context.lineWidth = 1;
    path(graticule.outline());
    context.stroke();
  }

  render() {
    return (
      <div className="map-box">
        <canvas className="map" ref={this.refMap}></canvas>
      </div>
    );
  }
}

export default WorldMap;
