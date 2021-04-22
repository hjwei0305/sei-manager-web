import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, omit, isEqual } from 'lodash';
import { Form, Input, Card, Button, Upload } from 'antd';
import { message } from 'suid';
import styles from './Profile.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const defaultHeadIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAFhUlEQVRYR71Za4gbVRT+zkyaZNLdbWvJPvrY7U0o/pCWKiwIUnUtCEKLVOsDRCmCpX8KChaK1IqPIkJRKIpof2gRwa5YoRT8VWgVH1hf1PaHQmamqU1rtvtod5PdPGaunLBZstlscu+k7gdDyOz5vvPNzb13zrlLaANSypDrutsA3AtgM4AkgDUA7piVHQOQAZACcAHAT67rnhkaGioHTUtBiKlUarthGM8A2AkgoqlRAPC17/ufJ5PJ05pcaBl2HOdpAPsB3KObqFE8Ef0qpTwihPhCVU/JsG3bdxqGcURKuV1VWCeOiE77vv9yIpH4qxWvpeHLly8/6/v+xwCircTa/PuMlHJPIpH4rJlOU8Ou6x6UUr7ZphEtupTy1UQi8dZipEUN27Z9mIhe0cp2m4KJ6PCGDRsONpz3jW46jnMAwNu3KX9QmQNCiHfqyQtG2HGcpwAor1oWjEaj6OrqQigUqlyGYczlmZmZwdTUVOXShe/7u5LJ5Fe1vHmGM5lMf6FQ+APAKlXx1atXo7Ozs2W453m4cuVKy7i6gBEp5aZEIvFv9f48w7ZtDxPRE6qqbJQNqyKfzyObzaqGV+OOCyF2LzBs2/YOIjqlqsY/fV9fH0zTVKVU4m7evInx8XEtDoAhIcRZJs2NsOM4fOMBVSXVqVCvJ6XEtWvXUCwWVVNx3CkhxKNzhm3bvp+IzukorFu3rrLAgmBsbAy3bt3Sopqmuam/v/9iZYQdx/kQwF5VBTbKhoOCd4wbN25o0at7c9Uwl4B9qgqWZaGnp0c1fEFcoVCoTAtN/CmE2EyO42wB8LsOefny5YjH4zqUebGlUglXr17V5nue10+2bb9ARFzcKEN3O6sXDrgng4ge5xF+F8BLym4BrFy5snIFBe8UmUwGPNI6IKJD5Lrul1LKXarEcDiMNWu4C2oPExMT4EsTn/IInwHwkA6xnS2tmuf69evgOkMT37DhH2ebSGVuu1OCjbJhXRDR92xY6w1XTcLbGm9vuuD5y2Z5awuAs2z45Gz3q8WPRCLo7e3llavFC/KWq0lwkhfdUSnlPq2ss8ErVqzAqlXKlShyuRxGRkaCpKpyjvI+vI+IjgZV6e7uRiwWa0kvl8uVqcCfQcEDy4a3EtG3QUW4vGTTPEWagWuHIF1HraZhGFtJSmk6jjNNRMuCmlYpNV3XDSpf4Ukpi0IIq1r8cOG+I4gi93O8Y7RafAFfFLWWKjVx1TC3IJ/oGu7o6AAvvGXL1H4cbpF4WvBnAOwWQhyvGB4eHjYHBwe52aqeOjbV42qNCyAe3SDQNU5EowMDA91E5Ne2SK8DONTMAL8ouJ0P8sJopMvGJycnMT093fS5fd9/I5lMvsZBc4YvXbrUEYvFbAALCl3uMHi/5ZH9P8DThBtTLjsbIGtZVqK3tzc3zzB/sW17DxF9VEtqt27QeUAu6utLztkDwmNVnUYnPycAPFkNWLt2rfKi0jHXKJZHmY8BanBCCMFn0nNYYHh0dLRrcnLyBynlXbyouF5YKtT2ekR0sVQq3bdx48Z57XXDyiWVSm0iojPxeDzOW9dSIp1Ow/f9rGma27itr8+9aKmVTqcH169f//NSmuVc2Wx2Ympq6uFkMnm+Ue6mtWE+n3/Rsqz3ltK053nvh0KhRavHlsVsuVx+jEXC4bDyuUWQBywWi/8Q0c5wOPxLM35Lw1VyLpc7Fg6HnwuFQuEghhbj+L7vF4vF45ZlPa+iq2yYxaSU3fl8/gPTNB+JRCJtvUU8zyuVSqVz0Wh0PxHxmbQStAzXKo6Pj/No741Go3eHQiHloqJUKqXL5fKwZVn8PxTtPj+w4TrzAwAeBLDFNE1hmmaPaZqdhmHEPM/7W0p5wTCM7yKRyG9EpH9GVZPsP4tSI7alLL2bAAAAAElFTkSuQmCC';

@Form.create()
class Profile extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    saving: PropTypes.bool,
    save: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      headIcon: get(user, 'avatar', ''),
    };
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (!isEqual(prevProps.user, user)) {
      this.setState({ headIcon: get(user, 'avatar', '') });
    }
  }

  handlerFormSubmit = () => {
    const { headIcon } = this.state;
    const { form, save, user } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = { id: get(user, 'id'), avatar: headIcon };
      Object.assign(params, omit(formData, ['email']));
      save(params);
    });
  };

  customRequest = option => {
    const formData = new FormData();
    formData.append('files[]', option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = e => {
      if (e && e.target && e.target.result) {
        option.onSuccess();
        this.setState({ headIcon: e.target.result });
      }
    };
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传PNG文件!');
      return false;
    }
    const isLt10K = file.size / 1024 <= 10;
    if (!isLt10K) {
      message.error('图片大小需小于10Kb!');
      return false;
    }
    return isJpgOrPng && isLt10K;
  };

  render() {
    const { headIcon } = this.state;
    const { form, saving, user } = this.props;
    const { getFieldDecorator } = form;
    const uploadProps = {
      customRequest: this.customRequest,
      showUploadList: false, // 不展示文件列表
      beforeUpload: this.beforeUpload,
    };
    return (
      <Card title="个人信息" bordered={false} className={styles['profile-box']}>
        <Form {...formItemLayout}>
          <FormItem label="姓名">
            {getFieldDecorator('userName', {
              initialValue: get(user, 'userName'),
              rules: [
                {
                  required: true,
                  message: '姓名不能为空',
                },
              ],
            })(<Input autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="手机号">
            {getFieldDecorator('phone', {
              initialValue: get(user, 'phone'),
            })(<Input autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="电子邮箱">
            {getFieldDecorator('email', {
              initialValue: get(user, 'email'),
            })(<Input autoComplete="off" disabled style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="头像">
            <div className="head-icon-box horizontal">
              <div className="row-start head-icon">
                <img alt="" src={headIcon || defaultHeadIcon} />
              </div>
              <div className="tool-box vertical">
                <Upload {...uploadProps}>
                  <Button icon="upload">上传头像</Button>
                </Upload>
                <div className="desc">图片为png格式，大小在10Kb以内;</div>
              </div>
            </div>
          </FormItem>
          <Button loading={saving} onClick={this.handlerFormSubmit} type="primary">
            保存
          </Button>
        </Form>
      </Card>
    );
  }
}

export default Profile;
