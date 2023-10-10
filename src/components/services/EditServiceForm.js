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
import ImgUpload from 'components/antd/ImgUpload';
// src\containers\form-validations\FormikFields.js

const ServiceSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required!'),
});

const EditServiceForm = ({ data }) => {
    const dropzone = useRef();
    const router = useHistory();

    const [imageUrl, setImageUrl] = useState(data.image);

    const onSubmit = (values, { setSubmitting }) => {
        console.log('vvvv ', values);
        console.log('dropzone', imageUrl);
        values.image = imageUrl;
        if (imageUrl) {
            let user = getCurrentUser();
            axios.put(`${process.env.REACT_APP_API_KEY}admin/service/by-id/${data.id}`, {
                service: values
            }, {
                headers: {
                    Authorization: "Bearer " + user.token
                }
            }).then(res => {
                NotificationManager.success(values.name + " will start to show in website", "Service Create", 3000, null, null, '');
                router.push("/app/content/services/list");
            }).catch(err => {
                NotificationManager.warning(err, 'Something Went Wrong!', 3000, null, null, '');
            })
        } else {
            NotificationManager.error('Upload an image in drop zone', 'Image is required!', 3000, null, null, '');
        }
    };

    return (
        <Row className="mb-4">
            <Colxx xxs="12">
                <Card>
                <CardBody>
                        {/* <h6 className="mb-4">Custom Components and Layouts with Yup</h6> */}
                        <Formik
                            initialValues={data}
                            validationSchema={ServiceSchema}
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
                                                    Name*
                                                </Label>
                                                <Field className="form-control" name="name" />
                                                {errors.name && touched.name ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.name}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>
                                                    Slug*
                                                </Label>
                                                <Field className="form-control" name="slug" />
                                                {errors.name && touched.name ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.name}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Colxx xxs="6">
                                            <Label>
                                                Icon*
                                            </Label>
                                            <ImgUpload
                                                name={"image"}
                                                token={getCurrentUser().token}
                                                actionUrl={"admin/upload?path=" + "img/service"}
                                                handleImageChange={setImageUrl}
                                                image={process.env.REACT_APP_S3_URL + data.image}
                                            />
                                            {/* <DropzoneImage ref={dropzone} path="img/brand" setFile={setImageUrl} /> */}
                                        </Colxx>
                                    </Row>

                                    <Button color="primary" type="submit">
                                        Update
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
export default EditServiceForm;
