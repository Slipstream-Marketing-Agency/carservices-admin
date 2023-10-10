/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
    Row,
    Card,
    CardBody,
    Badge,
    PaginationItem,
    PaginationLink,
    Button,
} from 'reactstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { Separator, Colxx } from 'components/common/CustomBootstrap';
import { blogData } from 'data/blog';
import { getCurrentUser } from 'helpers/Utils';
import axios from 'axios';
import Pagination from 'containers/pages/Pagination';
import { adminRoot } from 'constants/defaultValues';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const BlogList = ({ match }) => {

    const router = useHistory();

    const [blogs, setBlogs] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [blogCount, setBlogCount] = useState(0);

    useEffect(() => {
        async function fetchData() {

            console.log("match.params.id ", match);

            let user = getCurrentUser();
            axios
                .get(
                    `${process.env.REACT_APP_API_KEY}admin/blog?pageSize=${8}&currentPage=${match.params.page}&search=${""}`,
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
                    setBlogs(data.blogs)
                    setPageCount(data.totalPage);
                    setBlogCount(data.blogsCount);
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
    }, [match.params.page]);

    return (
        <>
            <Row>
                <Colxx xxs="12" className="d-flex justify-content-between">
                    <div className='w-50'>
                        <Breadcrumb heading="Blog List" match={match} />
                    </div>
                    <div className='d-flex justify-content-end w-50'>
                        <Link to="/app/content/blog/add">
                            <Button color="primary" className="m-0" type="submit">
                                Add Blog
                            </Button>
                        </Link>
                    </div>


                </Colxx>
                <Colxx xxs="12">
                    <Separator className="mb-5" />
                </Colxx>
                {blogs.map((blogItem, index) => {
                    return (
                        <Colxx xxs="12" lg="6" className="mb-5" key={`blogItem_${index}`}>
                            <Card className="flex-row listing-card-container">
                                <div className="w-40 position-relative">
                                    <NavLink to={`../detail/${blogItem.id}`}>
                                        <img
                                            className="card-img-left"
                                            src={process.env.REACT_APP_S3_URL + blogItem.coverImage}
                                            alt="Card cap"
                                        />
                                        {blogItem.badge && (
                                            <Badge
                                                color="primary"
                                                pill
                                                className="position-absolute badge-top-left"
                                            >
                                                {blogItem.badge}
                                            </Badge>
                                        )}
                                    </NavLink>
                                </div>
                                <div className="w-60 d-flex align-items-center">
                                    <CardBody>
                                        <NavLink to={`../detail/${blogItem.id}`}>
                                            <ResponsiveEllipsis
                                                className="mb-3 listing-heading"
                                                text={blogItem.title}
                                                maxLine="2"
                                                trimRight
                                                basedOn="words"
                                                component="h5"
                                            />
                                        </NavLink>
                                        <ResponsiveEllipsis
                                            className="listing-desc text-muted"
                                            text={blogItem.description}
                                            maxLine="3"
                                            trimRight
                                            basedOn="words"
                                            component="p"
                                        />
                                    </CardBody>
                                </div>
                            </Card>
                        </Colxx>
                    );
                })}
            </Row>
            <Pagination
                totalPage={pageCount}
                currentPage={match.params.page}
                numberLimit={5}
                onChangePage={(page) => router.push(`${adminRoot}/content/blog/list/${page}`)}

            // itemsPerPage={10}
            // totalItems={blogCount}
            // currentPage={match.params.page}
            // paginate={(number) => console.log("page ", number)}
            />

        </>
    );
};

export default BlogList;
