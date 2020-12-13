import React, {Component} from 'react';
import {
  Form,
  InputNumber,
  Button,
} from 'antd'

class SatSettingForm extends Component {
  // Satellite Setting Form
  render() {
    const { getFieldDecorator } = this.props.form;
    // 这个props是哪里来的？
    // - 高阶组件提供的props (SatSettingForm -> Form.create()(..here..) -> output SatSetting
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
                {
                  required: true,
                  message: "Please input your Longitude"
                }
              ]
            })(<InputNumber min={-180} max={180}
                            style={{width: "100%"}}
                            placeholder="Please input Longitude"
            />)
          }
        </Form.Item>

        <Form.Item label="Latitude(degrees)">
          {
            getFieldDecorator("latitude", {
              rules: [
                {
                  required: true,
                  message: "Please input your Latitude",
                }
              ],
            })(<InputNumber placeholder="Please input Latitude"
                            min={-90} max={90}
                            style={{width: "100%"}}
            />)
          }
        </Form.Item>

        <Form.Item label="Elevation(meters)">
          {
            getFieldDecorator("elevation", {
              rules: [
                {
                  required: true,
                  message: "Please input your Elevation",
                }
              ],
            })(<InputNumber placeholder="Please input Elevation"
                            min={-413} max={8850}
                            style={{width: "100%"}}
            />)
          }
        </Form.Item>

        <Form.Item label="Altitude(degrees)">
          {
            getFieldDecorator("altitude", {
              rules: [
                {
                  required: true,
                  message: "Please input your Altitude",
                }
              ],
            })(<InputNumber placeholder="Please input Altitude"
                            min={0} max={90}
                            style={{width: "100%"}}
            /> )
          }
        </Form.Item>

        <Form.Item label="Duration(secs)">
          {
            getFieldDecorator("duration", {
              rules: [
                {
                  required: true,
                  message: "Please input your Duration",
                }
              ],
            })(<InputNumber placeholder="Please input Duration" min={0} max={90} style={{width: "100%"}} />)
          }
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
