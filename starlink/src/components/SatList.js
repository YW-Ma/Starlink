import React, {Component} from 'react';
import {bindReporter} from "web-vitals/dist/lib/bindReporter"
import {Button} from "antd"

class SatList extends Component {
  render() {
    return (
      <div className="sat-list-box">
        <div className="bin-container">
          <Button className="sat-list-bin"
                  type = "primary"
          >
            Track on the map
          </Button>
        </div>
        <hr/>
        <div>data</div>
      </div>
    );
  }
}

export default SatList;
