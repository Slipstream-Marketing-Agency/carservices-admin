import React, { useState, useEffect } from 'react';

import { Breadcrumb, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import axios from 'axios';
import { getCurrentUser } from 'helpers/Utils';
import EditServiceForm from 'components/services/EditServiceForm';



const ServiceEditPage = ({ match }) => {

    const [serviceInfo, setServiceInfo] = useState(null);

    useEffect(() => {
        let user = getCurrentUser();

        axios
            .get(
                `${process.env.REACT_APP_API_KEY}admin/service/by-id/${match.params.id}`,
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
                setServiceInfo(data.service);
            });

    }, []);


  return <>
    <div className="disable-text-selection">
      <Row>
        <Colxx xxs="12">
          <h3>Edit Service</h3>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      {serviceInfo && (
        <EditServiceForm data={serviceInfo} />
      )}
      
    </div>
  </>;
};

export default ServiceEditPage;
