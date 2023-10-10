/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Row, Card, CardBody, FormGroup, Label, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import {
    FormikReactSelect,
    FormikCheckboxGroup,
    FormikCheckbox,
    FormikRadioButtonGroup,
    FormikCustomCheckbox,
    FormikCustomCheckboxGroup,
    FormikCustomRadioGroup,
    FormikTagsInput,
    FormikSwitch,
    FormikDatePicker,
} from '../../containers/form-validations/FormikFields';
import DropzoneImage from 'components/common/DropzoneImage';
import axios from 'axios';
import { NotificationManager } from 'components/common/react-notifications';
import { getCurrentUser } from 'helpers/Utils';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
// src\containers\form-validations\FormikFields.js

import 'react-quill/dist/quill.snow.css';

const BlogSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required!'),
});

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']                                         // remove formatting button
    ],
};

const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
];

const AddBlogCategoryForm = () => {
    const dropzone = useRef();
    const router = useHistory();

    const [imageUrl, setImageUrl] = useState(null);
    const [content, setContent] = useState('');

    const onSubmit = (values, { setSubmitting }) => {
        let user = getCurrentUser();
        axios.post(`${process.env.REACT_APP_API_KEY}admin/blog/category`, {
            category: values
        }, {
            headers: {
                Authorization: "Bearer " + user.token
            }
        }).then(res => {
            NotificationManager.success(values.title + " can be used in the blogs", "Blog Category Create", 3000, null, null, '');
            router.push("/app/content/blog-category/list");
        }).catch(err => {
            NotificationManager.warning(err, 'Something Went Wrong!', 3000, null, null, '');
        })
    };

    return (
        <Row className="mb-4">
            <Colxx xxs="12">
                <Card>
                    <CardBody>
                        {/* <h6 className="mb-4">Custom Components and Layouts with Yup</h6> */}
                        <Formik
                            initialValues={{
                                title: '',
                            }}
                            validationSchema={BlogSchema}
                            onSubmit={onSubmit}
                        >
                            {({
                                handleSubmit,
                                setFieldValue,
                                setFieldTouched,
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                touched,
                                isSubmitting,
                            }) => (
                                <Form className="av-tooltip tooltip-label-right">
                                    <Row>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>
                                                    Title*
                                                </Label>
                                                <Field className="form-control" name="title" />
                                                {errors.title && touched.title ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.title}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>

                                    </Row>

                                    <Button color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Colxx>
        </Row>
    );
};
export default AddBlogCategoryForm;
