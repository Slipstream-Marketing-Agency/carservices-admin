/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Row, Card, CardBody, FormGroup, Label, Button, CustomInput } from 'reactstrap';
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
import ReactQuill from 'react-quill';
import moment from 'moment';
import { AvInput } from 'availity-reactstrap-validation';
import { getCurrentUser } from 'helpers/Utils';
import axios from 'axios';
import DropzoneMultipleImages from 'components/common/DropzoneMultipleImages';
import DropzoneImage from 'components/common/DropzoneImage';
import { NotificationManager } from 'components/common/react-notifications';
import { useHistory } from 'react-router-dom';
// src\containers\form-validations\FormikFields.js

const AddWorkshopSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required!'),
    locationName: Yup.string()
        .required('Location is required!'),
    latitude: Yup.number()
        .required('Latitude is required!'),
    longitude: Yup.number()
        .required('Longitude is required!'),
    phoneOne: Yup.string()
        .required('This field is required!'),
    emailOne: Yup.string()
        .email('Invalid email address'),
    emailTwo: Yup.string()
        .email('Invalid email address'),
    about: Yup.string()
        .required('About is required!'),
    address: Yup.string()
        .required('Address is required!'),
    facebook: Yup.string().url(),
    twitter: Yup.string().url(),
    instagram: Yup.string().url(),
    googleRating: Yup.number()
        .required('Google rating is required!'),

});

const AddWorkshopForm = () => {
    const [about, setAbout] = useState();
    const [servicesList, setServicesList] = useState(null);
    const [brandsList, setBrandsList] = useState(null)
    const [imagesUrl, setImagesUrl] = useState([]);
    const [logoUrl, setLogoUrl] = useState(null);
    const router = useHistory();

    // const { values, submitForm } = useFormikContext();

    useEffect(() => {
        let user = getCurrentUser();
        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/service?isAll=1`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token
                    }
                }
            )
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                console.log('dddd ', data);
                let serviceData = data.services.map(service => (
                    {
                        value: service.id,
                        label: service.name
                    }
                ))
                setServicesList(serviceData);
            });
        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/brand?isAll=1`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token
                    }
                }
            )
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                console.log('dddd ', data);
                let brandData = data.brands.map(brand => (
                    {
                        value: brand.id,
                        label: brand.name
                    }
                ))
                setBrandsList(brandData);
            });

    }, []);

    const onSubmit = (values, { setSubmitting }) => {
        console.log("sssssssss", values);
        console.log('images', imagesUrl, logoUrl);
        if (imagesUrl.length == 0) {
            NotificationManager.error('Upload images in drop zone', 'Image is required!', 3000, null, null, '');
            return;
        }
        if (!logoUrl) {
            NotificationManager.error('Upload logo in drop zone', 'Logo is required!', 3000, null, null, '');
            return;
        }
        values.logo = logoUrl;
        values.gallery = imagesUrl.map(image => image.path);
        values.services = values.services.map(service => service.value)
        values.brands = values.brands.map(brand => brand.value)
        values.timing = [
            {
                day: "Monday",
                isOpen: values.mondayIsOpen,
                openingTime: moment(values?.mondayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.mondayClosingTime, ["HH:mm"]).format("h:mm A"),
            }
            , {
                day: "Tuesday",
                isOpen: values.tuesdayIsOpen,
                openingTime: moment(values?.tuesdayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.tuesdayClosingTime, ["HH:mm"]).format("h:mm A"),
            }, {
                day: "Wednesday",
                isOpen: values.wednesdayIsOpen,
                openingTime: moment(values?.wednesdayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.wednesdayClosingTime, ["HH:mm"]).format("h:mm A"),
            }, {
                day: "Thursday",
                isOpen: values.thursdayIsOpen,
                openingTime: moment(values?.thursdayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.thursdayClosingTime, ["HH:mm"]).format("h:mm A"),
            }, {
                day: "Friday",
                isOpen: values.fridayIsOpen,
                openingTime: moment(values?.fridayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.fridayClosingTime, ["HH:mm"]).format("h:mm A"),
            }, {
                day: "Saturday",
                isOpen: values.saturdayIsOpen,
                openingTime: moment(values?.saturdayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.saturdayClosingTime, ["HH:mm"]).format("h:mm A"),
            }, {
                day: "Sunday",
                isOpen: values.sundayIsOpen,
                openingTime: moment(values?.sundayOpeningTime, ["HH:mm"]).format("h:mm A"),
                closingTime: moment(values?.sundayClosingTime, ["HH:mm"]).format("h:mm A"),
            }
        ]
        console.log("final ", values);
        // return ;
        let user = getCurrentUser();
        console.log("ttttt ", user.token);
        axios.post(`${process.env.REACT_APP_API_KEY}admin/workshop`, {
            workshop: values
        }, {
            headers: {
                Authorization: "Bearer " + user.token
            }
        }).then(res => {
            NotificationManager.success(values.name + " will start to show in website", "Workshop Create", 3000, null, null, '');
            router.push("/app/content/workshop/list");
        }).catch(err => {
            NotificationManager.warning(err, 'Something Went Wrong!', 3000, null, null, '');
        })
    };

    return (
        <>
            <Row className="mb-4">
                <Colxx xxs="12">
                    <Card>
                        <CardBody>
                            {/* <h6 className="mb-4">Custom Components and Layouts with Yup</h6> */}
                            <Formik
                                initialValues={{
                                    name: '',
                                    locationName: '',
                                    latitude: '',
                                    longitude: '',
                                    phoneOne: "",
                                    phoneTwo: "",
                                    emailOne: "",
                                    emailTwo: "",
                                    website: "",
                                    facebook: "",
                                    twitter: "",
                                    instagram: "",
                                    about: "",
                                    address: "",
                                    googleRating: "",
                                    services: [],
                                    brands: [],
                                    mondayIsOpen: false,
                                    tuesdayIsOpen: false,
                                    wednesdayIsOpen: false,
                                    thursdayIsOpen: false,
                                    fridayIsOpen: false,
                                    saturdayIsOpen: false,
                                    sundayIsOpen: false,
                                }}
                                validationSchema={AddWorkshopSchema}
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
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Location*
                                                    </Label>
                                                    <Field className="form-control" name="locationName" />
                                                    {errors.locationName && touched.locationName ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.locationName}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-125">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Location Latitude*
                                                    </Label>
                                                    <Field className="form-control" name="latitude" />
                                                    {errors.latitude && touched.latitude ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.latitude}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-125">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Location Longitude*
                                                    </Label>
                                                    <Field className="form-control" name="longitude" />
                                                    {errors.longitude && touched.longitude ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.longitude}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-75">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Phone*
                                                    </Label>
                                                    <Field className="form-control" name="phoneOne" />
                                                    {errors.phoneOne && touched.phoneOne ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.phoneOne}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Alternative Phone
                                                    </Label>
                                                    <Field className="form-control" name="phoneTwo" />
                                                    {errors.phoneTwo && touched.phoneTwo ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.phoneTwo}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Email
                                                    </Label>
                                                    <Field className="form-control" name="emailOne" />
                                                    {errors.emailOne && touched.emailOne ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.emailOne}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Alternative Email
                                                    </Label>
                                                    <Field className="form-control" name="emailTwo" />
                                                    {errors.emailTwo && touched.emailTwo ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.emailTwo}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Website
                                                    </Label>
                                                    <Field className="form-control" name="website" />
                                                    {errors.website && touched.website ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.website}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Facebook
                                                    </Label>
                                                    <Field className="form-control" name="facebook" />
                                                    {errors.facebook && touched.facebook ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.facebook}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Twitter
                                                    </Label>
                                                    <Field className="form-control" name="twitter" />
                                                    {errors.twitter && touched.twitter ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.twitter}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>

                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Instagram
                                                    </Label>
                                                    <Field className="form-control" name="instagram" />
                                                    {errors.instagram && touched.instagram ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.instagram}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        About*
                                                    </Label>
                                                    {/* <AvInput type="textarea" className="form-control" name="about" id="about" required /> */}
                                                    <Field component="textarea" className="form-control" name="about" />
                                                    {errors.about && touched.about ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.about}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Address*
                                                    </Label>
                                                    {/* <AvInput type="textarea" className="form-control" name="about" id="about" required /> */}
                                                    <Field component="textarea" className="form-control" name="address" />
                                                    {errors.address && touched.address ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.address}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>Services </Label>
                                                    <FormikReactSelect
                                                        name="services"
                                                        id="services"
                                                        value={values.services}
                                                        isMulti
                                                        options={servicesList}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                    />
                                                    {errors.services && touched.services ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.services}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>Brands </Label>
                                                    <FormikReactSelect
                                                        name="brands"
                                                        id="brands"
                                                        value={values.brands}
                                                        isMulti
                                                        options={brandsList}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                    />
                                                    {errors.brands && touched.brands ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.brands}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <FormGroup className="error-l-100">
                                                    <Label>
                                                        {/* <IntlMessages id="forms.email" /> */}
                                                        Google Rating
                                                    </Label>
                                                    <Field className="form-control" name="googleRating" />
                                                    {errors.googleRating && touched.googleRating ? (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.googleRating}
                                                        </div>
                                                    ) : null}
                                                </FormGroup>
                                            </Colxx>
                                        </Row>

                                        <Row className='mb-2'>
                                            <Colxx xxs="6">
                                                <Label>Logo </Label>
                                                <DropzoneImage path="img/workshop/logo" setFile={setLogoUrl} />
                                            </Colxx>
                                        </Row>

                                        <Row className='mb-2'>
                                            <Colxx xxs="12">
                                                <Label>Images </Label>
                                                <DropzoneMultipleImages path="img/workshop/gallery" files={imagesUrl} setFiles={setImagesUrl} />
                                            </Colxx>
                                        </Row>

                                        <Row className='mb-2 mt-3'>
                                            <Colxx xxs="12">
                                                <h5>Working Time</h5>
                                            </Colxx>
                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Monday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="mondayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.mondayIsOpen && touched.mondayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.mondayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.mondayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="mondayOpeningTime" />
                                                                            {errors.mondayOpeningTime && touched.mondayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.mondayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="mondayClosingTime" />
                                                                            {errors.mondayClosingTime && touched.mondayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.mondayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>
                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Tuesday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="tuesdayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.tuesdayIsOpen && touched.tuesdayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.tuesdayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.tuesdayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="tuesdayOpeningTime" />
                                                                            {errors.tuesdayOpeningTime && touched.tuesdayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.tuesdayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="tuesdayClosingTime" />
                                                                            {errors.tuesdayClosingTime && touched.tuesdayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.tuesdayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>
                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Wednesday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="wednesdayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.wednesdayIsOpen && touched.wednesdayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.wednesdayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.wednesdayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="wednesdayOpeningTime" />
                                                                            {errors.wednesdayOpeningTime && touched.wednesdayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.wednesdayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="wednesdayClosingTime" />
                                                                            {errors.wednesdayClosingTime && touched.wednesdayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.wednesdayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>

                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Thursday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="thursdayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.thursdayIsOpen && touched.thursdayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.thursdayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.thursdayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="thursdayOpeningTime" />
                                                                            {errors.thursdayOpeningTime && touched.thursdayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.thursdayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="thursdayClosingTime" />
                                                                            {errors.thursdayClosingTime && touched.thursdayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.thursdayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>

                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Friday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="fridayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.fridayIsOpen && touched.fridayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.fridayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.fridayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="fridayOpeningTime" />
                                                                            {errors.fridayOpeningTime && touched.fridayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.fridayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="fridayClosingTime" />
                                                                            {errors.fridayClosingTime && touched.fridayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.fridayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>

                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Saturday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="saturdayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.saturdayIsOpen && touched.saturdayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.saturdayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.saturdayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="saturdayOpeningTime" />
                                                                            {errors.saturdayOpeningTime && touched.saturdayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.saturdayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="saturdayClosingTime" />
                                                                            {errors.saturdayClosingTime && touched.saturdayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.saturdayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
                                            </Colxx>

                                            <Colxx xxs="12" className="mb-2">
                                                <Card

                                                >
                                                    <div className="pl-2 d-flex">
                                                        <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-start min-width-zero align-items-lg-center">
                                                            <p className="list-item-heading mb-1 truncate" style={{ width: 100 }}>
                                                                Sunday
                                                            </p>
                                                            <FormGroup className="ml-5 mb-0 error-l-100">
                                                                <Label className="d-block">
                                                                    Open/Closed
                                                                </Label>
                                                                <FormikSwitch
                                                                    name="sundayIsOpen"
                                                                    className="custom-switch custom-switch-primary"
                                                                    // value={values.isOpenMonday}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                />
                                                                {errors.sundayIsOpen && touched.sundayIsOpen ? (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors.sundayIsOpen}
                                                                    </div>
                                                                ) : null}
                                                            </FormGroup>
                                                            {
                                                                values.sundayIsOpen && (
                                                                    <>
                                                                        <FormGroup className="ml-5 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Opening Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="sundayOpeningTime" />
                                                                            {errors.sundayOpeningTime && touched.sundayOpeningTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.sundayOpeningTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                        <FormGroup className="ml-3 mb-0 error-l-100">
                                                                            <Label>
                                                                                {/* <IntlMessages id="forms.email" /> */}
                                                                                Closing Time
                                                                            </Label>
                                                                            <Field className="form-control" type="time" name="sundayClosingTime" />
                                                                            {errors.sundayClosingTime && touched.sundayClosingTime ? (
                                                                                <div className="invalid-feedback d-block">
                                                                                    {errors.sundayClosingTime}
                                                                                </div>
                                                                            ) : null}
                                                                        </FormGroup>
                                                                    </>
                                                                )
                                                            }

                                                        </div>

                                                    </div>
                                                </Card>
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
        </>
    );
};
export default AddWorkshopForm;
