/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import 'dropzone/dist/min/dropzone.min.css';
import axios from 'axios';
import { getCurrentUser } from 'helpers/Utils';

const ReactDOMServer = require('react-dom/server');

const dropzoneConfig = {
    autoProcessQueue: false,
    thumbnailHeight: 400,
    maxFilesize: 2,
    previewTemplate: ReactDOMServer.renderToStaticMarkup(
        <div className="dz-preview dz-file-preview mb-3">
            <div className="d-flex flex-row ">
                <div className="p-0 w-30 position-relative">
                    <div className="dz-error-mark">
                        <span>
                            <i />{' '}
                        </span>
                    </div>
                    <div className="dz-success-mark">
                        <span>
                            <i />
                        </span>
                    </div>
                    <div className="preview-container">
                        {/*  eslint-disable-next-line jsx-a11y/alt-text */}
                        <img data-dz-thumbnail className="img-thumbnail border-0" />
                        <i className="simple-icon-doc preview-icon" />
                    </div>
                </div>
                <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div>
                        {' '}
                        <span data-dz-name />{' '}
                    </div>
                    <div className="text-primary text-extra-small" data-dz-size />
                    <div className="dz-progress">
                        <span className="dz-upload" data-dz-uploadprogress />
                    </div>
                    <div className="dz-error-message">
                        <span data-dz-errormessage />
                    </div>
                </div>
            </div>
            <a href="#/" className="remove" data-dz-remove>
                {' '}
                <i className="glyph-icon simple-icon-trash" />{' '}
            </a>
        </div>
    ),
    headers: { 'My-Awesome-Header': 'header value' },
};

export default class DropzoneMultipleImages extends Component {
    clear() {
        this.myDropzone.removeAllFiles(true);
    }

    render() {
        return (
            <DropzoneComponent
                config={{ postUrl: 'no-url' }}
                djsConfig={dropzoneConfig}
                eventHandlers={{
                    init: (dropzone) => {
                        this.myDropzone = dropzone;
                    },
                    addedfile: (file) => {
                        let data = new FormData();
                        data.append('image', file);
                        let user = getCurrentUser();
                        // console.log('toke ', user.token);
                        axios.post(process.env.REACT_APP_API_KEY + 'admin/upload?path=' + this.props.path, data, {
                            headers: {
                                Authorization: 'Bearer ' + user.token
                            }
                        }).then(res => {
                            let files = this.props.files;
                            files.push({
                                path: res.data.path,
                                file: file
                            })
                            this.props.setFiles(files);
                        })
                        // axios.post()
                    },
                    removedfile: (file) => {
                        let files = this.props.files;
                        console.log(file.name);
                        files = files.filter((fileItem) => {
                            return fileItem.file.name !== file.name
                        });
                        this.props.setFiles(files);
                    }
                }}
            />
        );
    }
}
