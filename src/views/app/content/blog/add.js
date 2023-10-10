import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import AddBlogForm from 'components/blogs/AddBlogForm';



const BlogAddPage = ({ match }) => {


  return <>
    <div className="disable-text-selection">
      <Row>
        <Colxx xxs="12">
          <h3>Add Blog</h3>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <AddBlogForm />
    </div>
  </>;
};

export default BlogAddPage;
