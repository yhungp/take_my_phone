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
import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  Card,
} from "reactstrap";
import routes from "routes";
import Devices from "views/Devices";

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
  };

  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };

  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setModalSearch(!modalSearch);
  };

  const renderListOfUserNames = (devs) => {
    if (devs.length === 0) {
      return (
        <Card key={"fsadfasfdasfda"} style={{ width: '460px', marginTop: '10px', marginLeft: '10px', padding: '10px' }}>
          <Row>
            <p style={{ fontSize: '10px' }}>No new devices to add</p>
          </Row>
        </Card>
      )
    }

    return devs.map(dev =>
      <Card key={dev[0]} style={{ width: '460px', marginTop: '10px', marginLeft: '10px', padding: '10px' }}>
        <Row>
          <Col>
            <p style={{ fontSize: '18px' }}>Model: {dev[3]}</p>
            <p style={{ fontSize: '10px' }}>Manufacturer: {dev[1]}</p>
            <p style={{ fontSize: '10px' }}>Serial: {dev[0]}</p>
            <p style={{ fontSize: '10px' }}>Codename: {dev[2]}</p>
          </Col>
          <Col style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
            <Button onClick={() => addNewRoute(dev)} >Add</Button>
          </Col>
        </Row>
      </Card>
    )
  }

  const addNewRoute = (device) => {
    postNewAddedDevice(device)
  }

  const getDevices = () => {
    fetch("http://localhost:8080/devices")
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            // setCount((count) => 0)
          }
          else {
            var devs = {};

            for (var dev in result) {
              var device = result[dev]
              devs[device[0]] =
                { "manufacturer": device[1], "model": device[1], "codename": device[1] }
            }

            setDevices(result)
          }
        },
        (error) => {
          // setCount((i) => 0)
        }
      )
  }

  async function postNewAddedDevice(device) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: device })
    };
    const response = await fetch('http://localhost:8080/add-device/', requestOptions);
    const data = await response.json();

    if (data === true) {
      routes[routes.length] = {
        path: "/" + device[0],
        name: device[3] + " ( " + device[0] + " )" ,
        rtlName: "لوحة القيادة",
        icon: "tim-icons icon-mobile",
        component: Devices,
        layout: "/admin"
      }

      props.refrechRoutes(routes)
      toggleModalSearch();
    }
    else {
      toggleModalSearch();
    }
  }

  useEffect(() => {
    if (devices.length !== 0) {
      toggleModalSearch()
    }
  }, [devices])

  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <InputGroup className="search-bar">
                <Button color="link" alt={"Add device"} onClick={getDevices}>
                  <i className="tim-icons icon-simple-add" />
                  <span className="d-lg-none d-md-block">Search</span>
                </Button>
              </InputGroup>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-sound-wave" />
                  <p className="d-lg-none">Notifications</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Mike John responded to your email
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      You have 5 more tasks
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Your friend Michael is in town
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Another notification
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Another one
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="photo">
                    <img alt="..." src={require("assets/img/anime3.png")} />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Log out</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Profile</DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Settings</DropdownItem>
                  </NavLink>
                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Log out</DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        // modalClassName="modal-search"
        style={{ padding: '10px', width: '500px' }}
        isOpen={modalSearch}
        toggle={toggleModalSearch}>
        {/* <ListOfDevices devices={devices} addNewRoute={addNewRoute} /> */}

        {renderListOfUserNames(devices)}
      </Modal>
    </>
  );
}

export default AdminNavbar;
