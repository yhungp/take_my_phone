/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { MdFolder } from "react-icons/md";
import { FileIcon, defaultStyles } from 'react-file-icon';

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

export default function MyPhoneFilesManager(props) {
  var formatBytes = props.formatBytes;
  var files = props.files;
  const updateFiles = props.updateFiles;
  const globalPagination = props.globalPagination;
  const setGlobalPagination = props.setGlobalPagination;

  const deviceName = props.deviceName
  const [start, setStart] = useState(true)

  const [filesComponent, setFilesComponent] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pagination, setPagination] = useState(0)

  const changePagination = (pagination) => {
    if (pagination !== globalPagination) {
      setGlobalPagination(pagination)
    }

    setAppsByPagination(pagination)
  }

  const setAppsByPagination = (pagination) => {
    setPagination(pagination)
    setTotalPages(Math.ceil(files.length / pagination))

    var counter = 0

    var appsComponent = files.map((app) => {
      counter += 1
      var type = app[0]
      var name = app[1]
      var size = app[2]



      return <tr key={counter}>
        <td>
          <Col>
            <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
              {
                type === 0 ?
                  <Button color="link" alt={"Add device"} style={{ color: "#ffffff" }} onClick={() => updateFiles(name)}>
                    <Col>
                      <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
                        {
                          name !== ".." ? <MdFolder size={'35px'} /> : <i className="tim-icons icon-minimal-left" />
                        }

                        <p style={{ fontSize: "16px", marginLeft: '10px' }}>

                        </p>
                        {
                          name !== ".." ?
                            <p style={{ fontSize: "16px", marginLeft: '10px' }}>
                              {name}
                            </p>
                            :
                            <p style={{ fontSize: "12px", marginLeft: '5px' }}>
                              back
                            </p>
                        }
                      </Row>
                    </Col>
                  </Button>
                  :
                  <Col>
                    <Row>
                      <div style={{ width: '30px', height: '30px', marginLeft: '15px' }}>
                        <FileIcon extension={getExtention(name)} {...defaultStyles[getExtention(name)]} />
                      </div>
                      <p style={{ fontSize: "16px", marginLeft: '20px' }}>{name}</p>
                    </Row>
                  </Col>
              }
            </Row>
          </Col>
        </td>

        <td className="text-center" style={{ width: '200px' }} >
          {
            type !== 0 ? <p style={{ fontSize: "10px" }}>{formatBytes(size)}</p> : null
          }
        </td>

        <td style={{ width: '100px' }} className="text-center">
          <Button
            className={classNames("btn-simple")}
            style={{ alignItems: "center", marginRight: '10px' }}>
            <i className="tim-icons icon-trash-simple" style={{ color: '#888888' }} />
          </Button>
        </td>
      </tr>
    })

    setFilesComponent(appsComponent)
  }

  function getExtention(name) {
    return name.substr(name.lastIndexOf('.') + 1)
  }

  useEffect(() => {
    if (start) {
      setStart(false)
    }
  }, [deviceName])

  useEffect(() => {
    if (files !== null) {
      changePagination(globalPagination)
    }
  }, [files])

  useEffect(() => {
    if (files !== null) {
      if (currentPage < 0) {
        setCurrentPage(0)
      }
      else if (currentPage === totalPages) {
        setCurrentPage(totalPages - 1)
      }
      else {
        changePagination(pagination)
      }
    }
  }, [currentPage])

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Row style={{ alignItems: "center" }}>
                    <h4 style={{ marginLeft: '20px' }}>File manager</h4>
                    <Col style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                      <Button
                        onClick={() => updateFiles()}
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
                      <th>Name</th>
                      <th className="text-center">Size</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filesComponent !== null ? filesComponent : null
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}