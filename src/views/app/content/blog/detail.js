/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Row, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { Separator, Colxx } from 'components/common/CustomBootstrap';
import SingleLightbox from 'components/pages/SingleLightbox';
import VideoPlayer from 'components/common/VideoPlayer';
import { blogData, blogCategories } from 'data/blog';
import IntlMessages from 'helpers/IntlMessages';
import { getCurrentUser } from 'helpers/Utils';
import axios from 'axios';
import moment from 'moment';
// import "../../../../assets/css/style.css"

const recentPosts = blogData.slice(0, 4);
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const BlogDetail = ({ match }) => {

    const [blogData, setBlogData] = useState();
    const [recentBlogs, setRecentBlogs] = useState([]);

    useEffect(() => {
        async function fetchData() {

            console.log("match.params.id ", match);

            let user = getCurrentUser();
            axios
                .get(
                    `${process.env.REACT_APP_API_KEY}admin/blog/by-id/${match.params.id}`,
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
                    setBlogData(data.blog)
                    //   setTotalPage(data.totalPage);
                    //   setItems(
                    //     data.brands.map((x) => {
                    //       return {...x, title: x.name, img: process.env.REACT_APP_S3_URL + x.image};
                    //       return { ...x, img: x.img.replace('img/', 'img/products/') };
                    //     })
                    //   );
                    //   setSelectedItems([]);
                    //   setTotalItemCount(data.brandsCount);
                    //   setIsLoaded(true);
                });
            axios
                .get(
                    `${process.env.REACT_APP_API_KEY}admin/blog?pageSize=${6}&currentPage=${1}`,
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
                    setRecentBlogs(data.blogs)
                    //   setTotalPage(data.totalPage);
                    //   setItems(
                    //     data.brands.map((x) => {
                    //       return {...x, title: x.name, img: process.env.REACT_APP_S3_URL + x.image};
                    //       return { ...x, img: x.img.replace('img/', 'img/products/') };
                    //     })
                    //   );
                    //   setSelectedItems([]);
                    //   setTotalItemCount(data.brandsCount);
                    //   setIsLoaded(true);
                });

            
        }
        fetchData();
    }, [match.params.id])

    if (!blogData) {
        return <></>
    }

    return (
        <>
            <Row>
            <Colxx xxs="12" className="d-flex justify-content-between">
                    <div className='w-50'>
                        <Breadcrumb heading="Blog List" match={match} />
                    </div>
                    <div className='d-flex justify-content-end w-50'>
                        <Link to={`/app/content/blog/update/${blogData.id}`}>
                            <Button color="warning" className="m-0" type="submit">
                                Edit Blog
                            </Button>
                        </Link>
                    </div>


                </Colxx>
                <Colxx xxs="12">
                    <Separator className="mb-5" />
                </Colxx>
            </Row>

            <Row>
                <Colxx xxs="12" md="12" xl="8" className="col-left">
                    <Card className="mb-4">
                        <SingleLightbox
                            thumb={process.env.REACT_APP_S3_URL + blogData?.coverImage}
                            large={process.env.REACT_APP_S3_URL + blogData?.coverImage}
                            className="responsive border-0 card-img-top mb-3"
                        />
                        <CardBody>
                            <h2>{blogData?.title}</h2>
                            <p>Created at {moment(blogData?.createdAt).calendar() } 
                                {blogData?.published && (
                                    <span className='ml-1'>| Published at {moment(blogData?.publishedAt).calendar()}</span>
                                )}
                            </p>
                            <div id='blogContent' dangerouslySetInnerHTML={{ __html: blogData?.content }} >

                            </div>
                        </CardBody>
                    </Card>
                </Colxx>

                <Colxx xxs="12" md="12" xl="4" className="col-left">

                    <Card className="mb-4">
                        <CardBody>
                            <CardTitle>
                                <IntlMessages id="pages.recent-posts" />
                            </CardTitle>
                            {recentBlogs.map((blogItem, index) => {
                                return (
                                    <div
                                        className={`d-flex flex-row ${index === recentBlogs.length - 1 ? '' : 'mb-3'
                                            }`}
                                        key={index}
                                    >
                                        <div>
                                            <NavLink to="#" location={{}}>
                                                <img
                                                    src={process.env.REACT_APP_S3_URL + blogItem.coverImage}
                                                    alt="img caption"
                                                    className="list-thumbnail border-0"
                                                />
                                            </NavLink>
                                        </div>
                                        <div className="pl-3 pt-2 list-item-heading-container">
                                            <NavLink to={`../detail/${blogItem.id}`}>
                                                <ResponsiveEllipsis
                                                    className="list-item-heading"
                                                    text={blogItem.title}
                                                    maxLine="3"
                                                    trimRight
                                                    basedOn="words"
                                                    component="h5"
                                                />
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardBody>
                    </Card>
                    {/* <Card className="mb-4">
                        <CardBody>
                            <CardTitle>
                                <IntlMessages id="todo.categories" />
                            </CardTitle>
                            {blogCategories.map((categoryItem, index) => {
                                return (
                                    <div
                                        className="d-flex flex-row align-items-center mb-3"
                                        key={`blogItem${index}`}
                                    >
                                        <NavLink to={categoryItem.link}>
                                            <i
                                                className={`large-icon initial-height ${categoryItem.icon}`}
                                            />
                                        </NavLink>
                                        <div className="pl-3 pt-2 pr-2 pb-2">
                                            <NavLink to={categoryItem.link}>
                                                <p className="list-item-heading mb-1">
                                                    {categoryItem.title}
                                                </p>
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardBody>
                    </Card> */}
                </Colxx>
            </Row>
        </>
    );
};

export default BlogDetail;
