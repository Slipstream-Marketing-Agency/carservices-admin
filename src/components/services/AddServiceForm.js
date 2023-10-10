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
// src\containers\form-validations\FormikFields.js

const ServiceSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required!'),
});

const AddServiceForm = () => {
    const dropzone = useRef();
    const router = useHistory();

    const [imageUrl, setImageUrl] = useState(null);

    const onSubmit = (values, { setSubmitting }) => {
        console.log('vvvv ', values);
        console.log('dropzone', imageUrl);
        values.image = imageUrl;
        if (imageUrl) {
            let user = getCurrentUser();
            console.log("ttttt ", user.token);
            axios.post(`${process.env.REACT_APP_API_KEY}admin/service`, {
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
                            initialValues={{
                                name: '',
                                content: ''
                            }}
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

                                    </Row>
                                    <Row>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>
                                                    {/* <IntlMessages id="forms.email" /> */}
                                                    Content*
                                                </Label>
                                                {/* <AvInput type="textarea" className="form-control" name="about" id="about" required /> */}
                                                <Field component="textarea" className="form-control" name="content" />
                                                {errors.content && touched.content ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.content}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Colxx xxs="6">
                                            <DropzoneImage ref={dropzone} path="img/service" setFile={setImageUrl} />
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
export default AddServiceForm;
