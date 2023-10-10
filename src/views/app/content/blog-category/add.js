import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import AddBlogCategoryForm from 'components/blogs/AddBlogCategoryForm';



const BlogCategoryAddPage = ({ match }) => {


  return <>
    <div className="disable-text-selection">
      <Row>
        <Colxx xxs="12">
          <h3>Add Blog Category</h3>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <AddBlogCategoryForm />
    </div>
  </>;
};

export default BlogCategoryAddPage;
