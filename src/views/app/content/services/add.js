import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import AddServiceForm from 'components/services/AddServiceForm';


const ServiceAddPage = ({ match }) => {

  return <>
    <div className="disable-text-selection">
      <Row>
        <Colxx xxs="12">
          <h3>Add Service</h3>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <AddServiceForm />
    </div>
  </>;
};

export default ServiceAddPage;
