import React, {Component} from 'react';
import {
  Form,
  InputNumber,
  Button,
} from 'antd'

class SatSetting extends Component {
  render() {
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Longitude(degrees):">
          <InputNumber/>
        </Form.Item>
      </Form>
    );
  }
}

export default SatSetting;
