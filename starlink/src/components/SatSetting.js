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

    // responsive design -- design the formItemLayout and pass to Form
    const formItemLayout = {
      labelCol: {         // label
        xs: { span: 24 },
        sm: { span: 11 }
      },
      wrapperCol: {       // wrapper
        xs: { span: 24 },
        sm: { span: 13 }
      }
    };

    // return JSX
    return (
      <Form {...formItemLayout} onSubmit={this.showSatellite} className="show-nearby">
        <Form.Item label="Longitude(degrees):">
          {
            getFieldDecorator('longitude', {
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

        <Form.Item className="show-nearby">
          <Button type="primary" htmlType="submit">Find Nearby Satellite</Button>
        </Form.Item>
      </Form>
    );
  }
  // implement showSatellite in our component
  // 1. prevent default GET and refresh
  // 2. get the value of the form
  showSatellite = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
      console.log(err);
    });
  }
}




/*
Form.create()的返回函数是高阶组件，
  传入SatSettingForm组件，返回SatSetting组件。
我们export 返回的组件。
*/
const SatSetting = Form.create({name: 'satellite-setting'})(SatSettingForm)
export default SatSetting;
