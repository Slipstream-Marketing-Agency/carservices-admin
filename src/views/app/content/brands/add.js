import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import AddBrandForm from 'components/brands/AddBrandForm';



const ServiceAddPage = ({ match }) => {


  return <>
    <div className="disable-text-selection">
      <Row>
        <Colxx xxs="12">
          <h3>Add Brand</h3>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <AddBrandForm />
    </div>
  </>;
};

export default ServiceAddPage;
