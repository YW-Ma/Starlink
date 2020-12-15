import React, {Component} from 'react';
import { List, Avatar, Button, Checkbox, Spin } from "antd";
import satelliteLogo from "../assets/images/satellite.svg"

// 显示返回的数据 - List
// 显示loading - main的state和修改
// 通知map我选了什么 - 一个selected state。


class SatList extends Component {
  constructor() {
    super();
    this.state = {
      selected: []
    };
  }

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
          onClick={this.onTrackOnMap}
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
                    <Checkbox
                      dataInfo={item}
                      onChange={this.onChange}
                      checked={this.state.selected.some( entry => entry.satid === item.satid )}
                    />
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
    // step1: get current selected sat-info
    const {dataInfo, checked} = e.target;
    const {selected} = this.state;

    // step2: add / remove current selected sat to / from a new selected list
    const list = this.addOrRemove(dataInfo, checked, selected);
    // step3: update selected state --> pass data to Main component to show it in Map
    this.setState({
      selected: list,
    })
  }

  addOrRemove = (item, checked, list) => {
    // case1: check is true:
    //    1.1 item is not in the list -> add item
    //    1.2 item is in the list -> do nothing

    // case2: check is false:
    //    2.1 item is not in the list -> do nothing
    //    2.2 item is in the list -> remove item

    // Tips:
    // The some() method tests whether at least one element in the array
    // passes the test implemented by the provided function.
    // 删filter, 找m，加..
    // It returns a Boolean value.
    const found = list.some( entry => entry.satid === item.satid )
    // 1.1
    if (checked && !found) {
      list = [...list, item];
    }
    // 2.2
    if (!checked && found) {
      list = list.filter(entry => {
        return entry.satid !== item.satid;
      });
    }
    return list;
  }

  onTrackOnMap = () => {
    this.props.onShowMap(this.state.selected);
  }
}

export default SatList;
