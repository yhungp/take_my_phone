
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import { PieChart } from 'react-minimal-pie-chart';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import {
  generateDetailedStorage
} from "variables/dynamic_chart.js";

export default function MyPhoneInformation(props) {
  var storagesDescription = props.storagesDescription
  var formatBytes = props.formatBytes
  var storageTotal = props.storageTotal
  var storagesValues = props.storagesValues
  var ramInfo = props.ramInfo
  var mobileInformation = props.mobileInformation
  var ramValue = props.ramValue

  return (
    <>
      <Row>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">User storage</h5>
              <CardTitle tag="h3">
                <i className="tim-icons icon-chart-pie-36 text-info" />{"  Total: "}{formatBytes(storageTotal)}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                {storagesDescription}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Detailed storage</h5>
              <CardTitle tag="h3">
                <i className="tim-icons icon-coins text-success" />
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                {
                  storagesValues != null ?
                    <Bar
                      data={generateDetailedStorage(storagesValues).data}
                      options={generateDetailedStorage(storagesValues).options}
                    /> : null
                }
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">RAM consumption</h5>
              <CardTitle tag="h3">
                <i className="tim-icons icon-chart-bar-32 text-info" />{"  Total: "}{formatBytes(ramValue['total'] * 1000)}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                {ramInfo}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg="2" />
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <Row style={{ marginLeft: '0px' }}>
                <i style={{ marginRight: '10px' }} className="tim-icons icon-mobile text-info" />
                <h5 className="card-category">Mobile information</h5>
              </Row>
              <CardBody>
                <Col>
                  <p style={{ fontSize: '20px' }}>{"  "}{mobileInformation['model']}</p>
                  <p>{"  "}{mobileInformation['brand']}</p>
                  <p>{"  "}{mobileInformation['device']}</p>
                </Col>
              </CardBody>
            </CardHeader>
          </Card>
        </Col>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <Row style={{ marginLeft: '0px' }}>
                <i style={{ marginRight: '10px' }} className="tim-icons icon-settings-gear-63 text-info" />
                <p className="card-category">Other information</p>
              </Row>
              <CardBody>
                <Col>
                  <p>{"  Android version: "}{mobileInformation['android']}</p>
                  <p>{"  Board:  "}{mobileInformation['board']}</p>
                  <p>{"  App count:  "}{mobileInformation['app_count']}</p>
                </Col>
              </CardBody>
            </CardHeader>
          </Card>
        </Col>
        <Col lg="2" />
      </Row>
    </>
  )
}