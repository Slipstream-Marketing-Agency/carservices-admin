import React from "react";
import "antd/dist/antd.css";
// import "./ImgUpload.css";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import Config from "../../../libs/config";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class ImgUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };

  componentDidMount() {
    if (this.props.image) {
      this.setState({
        fileList: [{
          url: this.props.image,
        }]
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    console.log('fffffff ',fileList);
    if (fileList.length !== 0 && fileList[0].response) {
      this.props.handleImageChange( fileList[0].response.path)
    }else{
      this.props.handleImageChange( null)
    }
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return ( 
      <>
        <Upload
          name="image"
          headers={{ Authorization: "Bearer " + this.props.token }}
          action={process.env.REACT_APP_API_KEY + this.props.actionUrl}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default ImgUpload;