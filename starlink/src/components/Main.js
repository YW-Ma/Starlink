import React, {Component} from 'react';
import SatSetting from "./SatSetting";
import SatList from "./SatList";
import axios from 'axios';

import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants"

class Main extends Component {
  state = {
    satInfo: null,        // get the info from API
    settings: null,       // c->p, data come from setting. Main provides a call back to setting
    isLoadingList: false, // loading icon
  }
  render() {
    return (
      <div className="main">
        <div className="left-side">
          <SatSetting
            className="sat-setting"
            onShow={this.showSatellite}
          />
          <SatList
            sateInfo={this.state.satInfo}
            isLoading={this.state.isLoadingList}
            className="sat-list"
          />
        </div>
        <div className="right-side">
          right
        </div>
      </div>
    );
  }

  showSatellite = setting => {
    // Why we use an arrow function?
    // 省略bind的过程。如果是普通函数传入，那么this会变成指向satSetting。
    // Because if we want to access this.state,
    // and this function is not an arrow function.
    // Then, we need to use this.showSatellite.bind(this) to make sure
    // this in the function point to Main, not SatSetting

    console.log(setting);
    this.setState({ settings: setting }); // 随后会rerender
    // fetch satellite data
    this.fetchSatellite(setting);
  }

  fetchSatellite= (setting) => {
    // fetch data from N2YO
    // step1: get setting values
    const {latitude, longitude, elevation, altitude} = setting;

    // step2: prepare the url
    const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

    this.setState({
      isLoadingList: true
    });

    // step3: make a HTTPRequest using axios
    axios.get(url)
      .then(response => {
        console.log("response: ", response.data)
        this.setState({
          satInfo: response.data,
          isLoadingList: false
        })
      })
      .catch(error => {
        console.log('err in fetch satellite -> ', error);
      })
  }

}

export default Main;
