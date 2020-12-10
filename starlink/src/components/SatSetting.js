import React, {Component} from 'react';
import {
  Form,
  InputNumber,
  Button,
} from 'antd'

class SatSettingForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    // 这个props是哪里来的？
    // 高阶组件提供的props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 11 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Longitude(degrees):">
          {
            getFieldDecorator('email', {
              rules: [

              ]
            })
          }
          <InputNumber/>
        </Form.Item>
      </Form>
    );
  }
}
/*
Form.create()的返回函数是高阶组件，
  传入SatSettingForm组件，返回SatSetting组件。
我们export 返回的组件。
*/
const SatSetting = Form.create()(SatSettingForm)
export default SatSetting;
