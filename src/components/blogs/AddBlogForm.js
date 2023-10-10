/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
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
    FormikReactCreatableSelect,
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

const AddBlogForm = () => {
    const dropzone = useRef();
    const router = useHistory();

    const [imageUrl, setImageUrl] = useState(null);
    const [content, setContent] = useState('');
    const [categoriesList, setCategoriesList] = useState(null);
    const [brandList, setBrandList] = useState(null);
    const [serviceList, setServiceList] = useState(null);
    const [tagList, setTagList] = useState(null);
    const [workshopList, setWorkshopList] = useState(null);

    useEffect(() => {
        let user = getCurrentUser();
        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/blog/category?isAll=1`,
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
                let categoriesData = data.categories.map(category => (
                    {
                        value: category.id,
                        label: category.title
                    }
                ))
                setCategoriesList(categoriesData);
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
                let brandsData = data.brands.map(brand => (
                    {
                        value: brand.id,
                        label: brand.name
                    }
                ))
                setBrandList(brandsData);
            });
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
                let servicesData = data.services.map(service => (
                    {
                        value: service.id,
                        label: service.name
                    }
                ))
                setServiceList(servicesData);
            });
        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/blog/tags?isAll=1`,
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
                let tagsData = data.tags.map(tag => (
                    {
                        value: tag.title,
                        label: tag.title
                    }
                ))
                setTagList(tagsData);
            });

        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/workshop/min`,
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
                let workshopsData = data.workshops.map(workshop => (
                    {
                        value: workshop.id,
                        label: workshop.name
                    }
                ))
                setWorkshopList(workshopsData);
            });
    }, []);

    const onSubmit = (values, { setSubmitting }) => {
        values.coverImage = imageUrl;
        values.brands = values.brands.map(brand => brand.value)
        values.services = values.services.map(model => model.value)
        values.categories = values.categories.map(category => category.value)
        values.workshops = values.workshops.map(workshop => workshop.value)
        values.tags = values.tags.map(tag => tag.value)
        values.content = content
        values.type = values.type.value
        console.log('cccc ', content);
        console.log('vvvv ', values);
        // return;
        if (imageUrl) {
            let user = getCurrentUser();
            // console.log("ttttt ", user.token);
            axios.post(`${process.env.REACT_APP_API_KEY}admin/blog`, {
                blog: values
            }, {
                headers: {
                    Authorization: "Bearer " + user.token
                }
            }).then(res => {
                NotificationManager.success("This blog will start to show in website", "Blog Create", 3000, null, null, '');
                router.push("/app/content/blog/list/1");
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
                                        <Colxx xxs="12">
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
                                    <Row >
                                        <Colxx xxs="12" className="mb-3">
                                            <Label>
                                                Content*
                                            </Label>
                                            <ReactQuill
                                                theme="snow"
                                                value={content}
                                                onChange={(val) => setContent(val)}
                                                modules={quillModules}
                                                formats={quillFormats}
                                            />
                                        </Colxx>
                                        <Colxx xxs="12">
                                            <FormGroup className="error-l-100">
                                                <Label>
                                                    Summary*
                                                </Label>
                                                <Field component="textarea" className="form-control" name="summary" rows="3" />
                                                {errors.summary && touched.summary ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.summary}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>
                                                    Meta Title*
                                                </Label>
                                                <Field className="form-control" name="metaTitle" />
                                                {errors.metaTitle && touched.metaTitle ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.metaTitle}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>Category </Label>
                                                <FormikReactSelect
                                                    name="categories"
                                                    id="categories"
                                                    value={values.categories}
                                                    isMulti
                                                    options={categoriesList}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.categories && touched.categories ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.categories}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>Brand </Label>
                                                <FormikReactSelect
                                                    name="brands"
                                                    id="brands"
                                                    value={values.brands}
                                                    isMulti
                                                    options={brandList}
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
                                                <Label>Service </Label>
                                                <FormikReactSelect
                                                    name="services"
                                                    id="services"
                                                    value={values.services}
                                                    isMulti
                                                    options={serviceList}
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
                                                <Label>Tag </Label>
                                                <FormikReactCreatableSelect
                                                    name="tags"
                                                    id="tags"
                                                    value={values.tags}
                                                    isMulti
                                                    options={tagList}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.tags && touched.tags ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.tags}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>Workshop </Label>
                                                <FormikReactSelect
                                                    name="workshops"
                                                    id="workshops"
                                                    value={values.workshops}
                                                    isMulti
                                                    options={workshopList}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.tags && touched.tags ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.tags}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <FormGroup className="error-l-100">
                                                <Label>Type* </Label>
                                                <FormikReactSelect
                                                    name="type"
                                                    id="type"
                                                    value={values.type}
                                                    isMulti
                                                    options={[
                                                        { value: "news", label: "News" },
                                                        { value: "review", label: "Review" }
                                                    ]}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.type && touched.type ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.type}
                                                    </div>
                                                ) : null}
                                            </FormGroup>
                                        </Colxx>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Colxx xxs="6">
                                            <Label>Cover Image </Label>
                                            <DropzoneImage ref={dropzone} path="img/blog" setFile={setImageUrl} />
                                        </Colxx>
                                        <Colxx xxs="3">
                                            <FormGroup className="mb-0 error-l-100">
                                                <Label className="d-block">
                                                    Publish Now
                                                </Label>
                                                <FormikSwitch
                                                    name="published"
                                                    className="custom-switch custom-switch-primary"
                                                    // value={values.isOpenMonday}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.published && touched.published ? (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.published}
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
export default AddBlogForm;
