/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import MyPhoneInformation from 'components/Device/MyPhoneInformation';
import MyPhoneFilesManager from 'components/Device/MyPhoneFilesManager';
import MyPhoneApps from 'components/Device/MyPhoneApps';
import SectionButton from 'components/Device/SectionsButtons'
import {
  getRamInfo,
  getStorage,
  getAppsCount
} from 'components/Device/InformationApiCalls'

import {
  callForFiles
} from 'components/Device/FilesApiCalls'

function Devices(props) {
  const [bigChartData, setbigChartData] = React.useState("data0");
  const setBgChartData = (name, index) => {
    setbigChartData(name);
    setCurrentInfo(index);
  };

  const [deviceName, setDeviceName] = useState("Device")

  useEffect(() => {
    setDeviceName(props['match']['path'].replace("/admin/", "Device "))
  }, [bigChartData])

  const [storageStarted, setStorageStarted] = useState(true)
  const [storagesDescription, setStoragesDescription] = useState(null)
  const [storagesValues, setStoragesValues] = useState(null)
  const [storageTotal, setStoragesTotal] = useState(null)
  const [mobileInformation, setMobileInformation] = useState({})
  const [currentInfo, setCurrentInfo] = useState(0)

  const [path, setPath] = useState("/")
  const [listFiles, setListFiles] = useState(null)

  var deviceSerial = props['match']['path'].replace("/admin/", "")

  useEffect(() => {
    if (storageStarted) {
      getStorage(
        deviceSerial,
        setStoragesValues,
        setStoragesTotal,
        setStoragesDescription,
        formatBytes
      )

      getRamInfo(
        deviceSerial, setRamInfo, setRamValue, formatBytes
      )

      getAppsCount(deviceSerial, setMobileInformation)
      setStorageStarted(false)
    }
  }, [storageStarted])

  const [ramInfo, setRamInfo] = useState(null)
  const [ramValue, setRamValue] = useState([0, 0])

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

      case 2:
        var files = <MyPhoneFilesManager
          formatBytes={formatBytes}
          deviceName={props['match']['path'].replace("/admin/", "")}
          files={listFiles}
          updateFiles={updateFiles}
          globalPagination={globalPagination}
          setGlobalPagination={setGlobalPagination}
          path={path}
        />

        if (listFiles == null) {
          callForFiles(setListFiles, props['match']['path'].replace("/admin/", ""), path)
          return null
        }
        else {
          return files
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

  function getAllIndexes(arr, val) {
		var indexes = [], i = -1;
		while ((i = arr.indexOf(val, i+1)) !== -1){
			indexes.push(i);
		}
		return indexes;
	}

  function updateFiles(name) {
    if (path !== "/" && name !== "..") {
      setPath(path + name + '/')
    }
    else if (path !== "/" && name === ".."){
      var indexes = getAllIndexes(path, "/")
      setPath(path.substring(0, indexes[indexes.length - 2] + 1))
    }
    else {
      setPath(path + name + '/')
    }
  }

  useEffect(() => {
    if (currentInfo === 2) {
      callForFiles(setListFiles, props['match']['path'].replace("/admin/", ""), path)
    }
  }, [path])

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
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data0"}
                        id={"0"}
                        index={0}
                        name={"My phone"}
                      />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data1"}
                        id={"1"}
                        index={1}
                        name={"Apps"}
                      />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data2"}
                        id={"2"}
                        index={2}
                        name={"Files"}
                      />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data3"}
                        id={"3"}
                        index={3}
                        name={"Music"}
                      />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data4"}
                        id={"1"}
                        index={4}
                        name={"Video"}
                      />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data5"}
                        id={"5"}
                        index={5}
                        name={"Photos"} />
                      <SectionButton
                        bigChartData={bigChartData}
                        setBgChartData={setBgChartData}
                        data={"data6"}
                        id={"6"}
                        index={6}
                        name={"Tools"} />
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

export default Devices;
