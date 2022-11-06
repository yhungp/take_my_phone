/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import classNames from "classnames";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";

export default function MyPhoneApps(props) {
  var formatBytes = props.formatBytes;
  var apps = props.myApps;
  const updateApps = props.updateApps;
  const globalPagination = props.globalPagination;
  const setGlobalPagination = props.setGlobalPagination;

  const deviceName = props.deviceName
  const [start, setStart] = useState(true)

  const [appsComponent, setAppsComponent] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pagination, setPagination] = useState(0)

  const changePagination = (pagination) => {
    if (pagination !== globalPagination){
      setGlobalPagination(pagination)
    }
    
    setAppsByPagination(pagination)
  }

  const setAppsByPagination = (pagination) => {
    setPagination(pagination)
    setTotalPages(Math.ceil(apps.length / pagination))

    var index = currentPage * pagination
    var appsComponent = apps.slice(index, index + pagination).map((app) => {
      var app_id = app[0]
      var name = app[1]
      var size = app[2]
      var data_size = app[3]
      var cache = app[4]
      var version = app[5]

      return <tr key={app_id}>
        <td>
          <Col>
            <p style={{ fontSize: "18px" }}>{name}</p>
            <p style={{ fontSize: "10px", color: '#9494A3' }}>{app_id}</p>
          </Col>
        </td>
        <td className="text-center" style={{ width: '200px' }} >
          <Col>
            <p style={{ fontSize: "12px" }}>App: {formatBytes(size)}</p>
            <p style={{ fontSize: "12px" }}>Data: {formatBytes(data_size)}</p>
            <p style={{ fontSize: "12px" }}>Cache: {formatBytes(cache)}</p>
          </Col>
        </td>
        <td alt={version} style={{ width: '100px' }} >{trunc(version)}</td>
        <td style={{ width: '100px' }} className="text-center">
          <Button
            className={classNames("btn-simple")}
            style={{ alignItems: "center", marginRight: '10px' }}>
            <i className="tim-icons icon-trash-simple" style={{ color: '#888888' }} />
          </Button>
        </td>
      </tr>
    })

    setAppsComponent(appsComponent)
  }

  useEffect(() => {
    if (start) {
      setStart(false)
    }
  }, [deviceName])

  useEffect(() => {
    if (apps !== null) {
      changePagination(globalPagination)
    }
  }, [apps])

  useEffect(() => {
    if (apps !== null) {
      if (currentPage < 0){
        setCurrentPage(0)
      }
      else if (currentPage == totalPages){
        setCurrentPage(totalPages - 1)
      }
      else {
        changePagination(pagination)
      }
    }
  }, [currentPage])

  function trunc(text) {
    return text.length > 10 ? `${text.substring(0, 10)}...` : text;
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Row style={{ alignItems: "center" }}>
                    <h4 style={{ marginLeft: '20px' }}>Phone apps</h4>
                    <Col style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                      <Button onClick={() => changePagination(10)} className={classNames("btn-simple")} style={{ width: '80px' }}>10</Button>
                      <Button onClick={() => changePagination(20)} className={classNames("btn-simple")} style={{ width: '80px' }}>20</Button>
                      <Button onClick={() => changePagination(50)} className={classNames("btn-simple")} style={{ width: '80px' }}>50</Button>
                      <Button onClick={() => changePagination(100)} className={classNames("btn-simple")} style={{ width: '80px' }}>100</Button>
                      <Button onClick={() => changePagination(200)} className={classNames("btn-simple")} style={{ width: '80px' }}>200</Button>
                      <Button
                        onClick={() => updateApps()}
                        className={classNames("btn-simple")}
                        style={{ alignItems: "center", marginRight: '10px' }}>
                        <i className="tim-icons icon-refresh-01" style={{ color: '#888888' }} />
                      </Button>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>App name</th>
                      <th className="text-center">Size</th>
                      <th>Version</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      appsComponent !== null ? appsComponent : null
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <>
          {
            apps !== null ?
              <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'center', flex: 1 }}>
                <Button onClick={() => setCurrentPage(currentPage - 1)} className={classNames("btn-simple")} style={{ width: '80px' }}>
                  <i className="tim-icons icon-minimal-left" style={{ color: '#888888' }} />
                </Button>
                <p style={{ margin: '10px' }}>{currentPage + 1}</p>
                <p style={{ margin: '10px' }}>/</p>
                <p style={{ margin: '10px' }}>{totalPages}</p>
                <Button onClick={() => setCurrentPage(currentPage + 1)} className={classNames("btn-simple")} style={{ width: '80px' }}>
                  <i className="tim-icons icon-minimal-right" style={{ color: '#888888' }} />
                </Button>
              </Row> : null
          }
        </>
      </div>
    </>
  )
}