/* eslint-disable react-hooks/exhaustive-deps */
/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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

import MyPhoneInformation from 'components/Device/MyPhoneInformation';
import MyPhoneApps from 'components/Device/MyPhoneApps';

function Dashboard(props) {
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name, index) => {
    setbigChartData(name);
    setCurrentInfo(index);
  };

  const [deviceName, setDeviceName] = useState("Device")

  useEffect(() => {
    setDeviceName(props['match']['path'].replace("/admin/", "Device "))
  }, [bigChartData])

  var [storageStarted, setStorageStarted] = useState(true)
  var [storagesDescription, setStoragesDescription] = useState(null)
  var [storagesValues, setStoragesValues] = useState(null)
  var [storageTotal, setStoragesTotal] = useState(null)
  var [mobileInformation, setMobileInformation] = useState({})
  var [currentInfo, setCurrentInfo] = useState(0)

  var deviceSerial = props['match']['path'].replace("/admin/", "")

  useEffect(() => {
    if (storageStarted) {
      getStorage()
      getRamInfo()
      getAppsCount()
      setStorageStarted(false)
    }
  }, [storageStarted])

  function getAppsCount() {
    fetch("http://localhost:8080/device-info/" + deviceSerial)
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            // setCount((count) => 0)
          }
          else {
            if (result !== "device offline") {
              setMobileInformation(result)
            }
          }
        },
        (error) => {
          // setCount((i) => 0)
        }
      )
  }

  const getStorage = () => {
    fetch("http://localhost:8080/device-space/" + deviceSerial)
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            // setCount((count) => 0)
          }
          else {
            if (result !== "device offline") {
              setStoragesValues(result)
              setStoragesTotal(result['used'] + result['free'])

              setStoragesDescription(
                <div>
                  <div style={{ height: '150px' }}>
                    <PieChart
                      animate
                      animationDuration={500}
                      animationEasing="ease-out"
                      data={[
                        { title: 'Used', value: result['used'], color: '#1E1E8F' },
                        { title: 'Free', value: result['free'], color: '#1E8BF8' },
                      ]}
                    />
                  </div>

                  <Row>
                    <Col style={{ marginLeft: '20px', marginTop: '20px' }}>
                      <Row>
                        <div style={{
                          marginTop: '5px',
                          marginRight: '10px',
                          height: '10px',
                          width: '10px',
                          backgroundColor: "#1E1E8F",
                          borderRadius: '50%',
                        }} ></div>
                        <p>Used {formatBytes(result['used'])}</p>
                      </Row>

                      <Row>
                        <div style={{
                          marginTop: '5px',
                          marginRight: '10px',
                          height: '10px',
                          width: '10px',
                          backgroundColor: "#1E8BF8",
                          borderRadius: '50%',
                        }} ></div>
                        <p>Free {formatBytes(result['free'])}</p>
                      </Row>
                    </Col>

                    <Col style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                      <Button
                        className={classNames("btn-simple")}
                        onClick={() => getStorage()}
                        style={{ alignItems: "center", marginRight: '10px' }}>
                        <i className="tim-icons icon-refresh-01" style={{ color: '#888888' }} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              )
            }
          }
        },
        (error) => {
          // setCount((i) => 0)
        }
      )
  }

  const [ramInfo, setRamInfo] = useState(null)
  const [ramValue, setRamValue] = useState([0, 0])

  const getRamInfo = () => {
    fetch(`http://localhost:8080/device-ram/` + deviceSerial)
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            // setCount((count) => 0)
          }
          else {
            if (result !== "device offline") {
              setRamValue(result)

              setRamInfo(
                <div>
                  <div style={{ height: '150px' }}>
                    <PieChart
                      animate
                      animationDuration={500}
                      animationEasing="ease-out"
                      data={[
                        { title: 'Used', value: result['total'] - result['available'], color: '#1E1E8F' },
                        { title: 'Free', value: result['available'], color: '#1E8BF8' },
                      ]}
                    />
                  </div>

                  <Row>
                    <Col style={{ marginLeft: '20px', marginTop: '20px' }}>
                      <Row>
                        <div style={{
                          marginTop: '5px',
                          marginRight: '10px',
                          height: '10px',
                          width: '10px',
                          backgroundColor: "#1E1E8F",
                          borderRadius: '50%',
                        }} ></div>

                        <p>Used {formatBytes((result['total'] - result['available']) * 1000)}</p>
                      </Row>

                      <Row>
                        <div style={{
                          marginTop: '5px',
                          marginRight: '10px',
                          height: '10px',
                          width: '10px',
                          backgroundColor: "#1E8BF8",
                          borderRadius: '50%',
                        }} ></div>
                        <p>Free {formatBytes(result['available'] * 1000)}</p>
                      </Row>
                    </Col>

                    <Col style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                      <Button
                        className={classNames("btn-simple")}
                        onClick={() => getRamInfo()}
                        style={{ alignItems: "center", marginRight: '10px' }}>
                        <i className="tim-icons icon-refresh-01" style={{ color: '#888888' }} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              )
            }
          }
        },
        (error) => {
          // setCount((i) => 0)
        }
      )
  }

  function formatBytes(kilo_bytes, decimals = 2) {
    if (!+kilo_bytes) return '0 KB'

    const k = 1000
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["B", 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(kilo_bytes) / Math.log(k))

    return `${parseFloat((kilo_bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  function setInfoCards() {
    switch (currentInfo) {
      case 0:
        return <MyPhoneInformation
          storagesDescription={storagesDescription}
          formatBytes={formatBytes}
          storageTotal={storageTotal}
          storagesValues={storagesValues}
          ramInfo={ramInfo}
          mobileInformation={mobileInformation}
          ramValue={ramValue}
        />
      case 1:
        var phoneApps = <MyPhoneApps
          formatBytes={formatBytes}
          deviceName={props['match']['path'].replace("/admin/", "")}
          myApps={apps}
          updateApps={updateApps}
          globalPagination={globalPagination}
          setGlobalPagination={setGlobalPagination}
        />

        if (apps == null) {
          callForApps()
          return null
        }
        else {
          return phoneApps
        }

      default:
        return <MyPhoneInformation
          storagesDescription={storagesDescription}
          formatBytes={formatBytes}
          storageTotal={storageTotal}
          storagesValues={storagesValues}
          ramInfo={ramInfo}
          mobileInformation={mobileInformation}
          ramValue={ramValue}
        />
    }
  }

  const [apps, setApps] = useState(null)
  const [globalPagination, setGlobalPagination] = useState(10)

  const callForApps = () => {
    var dev = props['match']['path'].replace("/admin/", "")
    fetch("http://localhost:8080/device-apps/" + dev)
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            // setCount((count) => 0)
          }
          else {
            setApps(result)
          }
        },
        (error) => {
          // setCount((i) => 0)
        }
      )
  }

  const updateApps = () => {
    callForApps()
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <CardTitle tag="h2">{deviceName}</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1"
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1", 0)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          My phone
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2"
                        })}
                        onClick={() => setBgChartData("data2", 1)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Apps
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3"
                        })}
                        onClick={() => setBgChartData("data3", 2)}>
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Files
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data4"
                        })}
                        onClick={() => setBgChartData("data4")}>
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Music
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data5"
                        })}
                        onClick={() => setBgChartData("data5")}>
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Video
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data6"
                        })}
                        onClick={() => setBgChartData("data6")}>
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Photos
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {
          setInfoCards()
        }

      </div>
    </>
  );
}

export default Dashboard;
