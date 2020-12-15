import React, {Component} from 'react';
import {bindReporter} from "web-vitals/dist/lib/bindReporter"
import { List, Avatar, Button, Checkbox, Spin } from "antd";
import ListItem from "antd/es/transfer/ListItem"
import satelliteLogo from "../assets/images/satellite.svg"

class SatList extends Component {
  render() {
    const isLoading = this.props.isLoading;
    // const satList = this.props.sateInfo.above; 不安全，sateInfo可能是undefined
    const satList = this.props.sateInfo ? this.props.sateInfo.above : [];
    return (
      <div className="sat-list-box">
        <Button
          type="primary"
          className="sat-list-btn"
          size="large"
        >
          Track on the map
        </Button>
        <hr />
        {/*handle loading*/}
        {
          isLoading
            ?
            <div>
              <Spin tip="Loading" size="large"></Spin>
            </div>
            :
            <List
              className="sat-list"
              itemLayout="horizontal"
              size="small"
              dataSource={satList}
              renderItem={item => ( // this "item" stands for an entry of dataSource. (like an iterator)
                <List.Item
                  actions={[
                    <Checkbox dataInfo={item} onChange={this.onChange} />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar size={50} src={satelliteLogo} />}
                    title={<p>{item.satname}</p>}
                    description={`Launch Date: ${item.launchDate}`}
                  />
                </List.Item>
              )}
            />
        }
      </div>
    );
  }
  onChange = e => {
    console.log(e.target.dataInfo)
  }
}

export default SatList;
