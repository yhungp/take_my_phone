const { default: classNames } = require("classnames")
const { PieChart } = require("react-minimal-pie-chart")
const { Row, Col, Button } = require("reactstrap")

export function getRamInfo(
  deviceSerial, setRamInfo, setRamValue, formatBytes) {

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

export function getStorage(
  deviceSerial,
  setStoragesValues,
  setStoragesTotal,
  setStoragesDescription,
  formatBytes
) {

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

export function getAppsCount(deviceSerial, setMobileInformation) {
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