import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import EditBlogForm from 'components/blogs/EditBlogForm';
import { getCurrentUser } from 'helpers/Utils';
import axios from 'axios';


const BlogEditPage = ({ match }) => {

    const [blogInfo, setBlogInfo] = useState(null);

    useEffect(() => {
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
                console.log('dddd ', data);
                setBlogInfo(data.blog);
            });

    }, []);

    console.log("blogInfo ", blogInfo);

    return <>
        <div className="disable-text-selection">
            <Row>
                <Colxx xxs="12">
                    <h3>Edit Blog</h3>
                    <Separator className="mb-5" />
                </Colxx>
            </Row>
            {blogInfo && (
                <EditBlogForm data={blogInfo} match={match} />
            )}
            
        </div>
    </>;
};

export default BlogEditPage;
