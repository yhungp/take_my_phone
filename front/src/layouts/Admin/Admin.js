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
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import logo from "assets/img/react-logo.png";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import Devices from "views/Devices.js";
import Dashboard from "views/Dashboard";
import Icons from "views/Icons";

// import Icons from "views/Icons.js";
// import Dashboard from "views/Dashboard";

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);

  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };

  const [myRoutes, setMyRoutes] = useState(routes)

  const [start, setStart] = useState(true)

  useEffect(() => {
    if (start){
      getListAddedDevices()
    }
  }, [start])

  const getListAddedDevices = () => {
    fetch("http://localhost:8080/list-added-devices")
    .then(res => res.json())
    .then(
      (result) => {
        if (result == null) {
          // setCount((count) => 0)
        }
        else {
          for (var i = 0; i < routes.length; i ++){
            routes.pop(i)
          }

          routes[0] = {
            path: "/dashboard",
            name: "Dashboard",
            rtlName: "???????? ??????????????",
            icon: "tim-icons icon-chart-pie-36",
            component: Dashboard,
            layout: "/admin"
          }

          routes[1] = {
            path: "/icons",
            name: "Icons",
            rtlName: "????????????",
            icon: "tim-icons icon-atom",
            component: Icons,
            layout: "/admin"
          }

          for (var r in result){
            var device = result[r]['id']
            routes[routes.length] = {
              path: "/" + device[0],
              name: device[3] + " ( " + device[0] + " )" ,
              rtlName: "???????? ??????????????",
              icon: "tim-icons icon-mobile",
              component: Devices,
              layout: "/admin"
            }
          }

          console.log(routes)

          refrechRoutes(routes)
          setStart(false)
        }
      },
      (error) => {
        // setCount((i) => 0)
      }
    )
  }

  function refrechRoutes(r) {
    setMyRoutes(r)
    setSwitchRoutes(
      <Switch>
        {getRoutes(myRoutes)}
        {/* <Redirect from="*" to="/admin/dashboard" /> */}
      </Switch>
    )
  }

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };


  const [switchRoutes, setSwitchRoutes] = useState(
    <Switch>
      {getRoutes(myRoutes)}
      <Redirect from="*" to="/admin/dashboard" />
    </Switch>
  )

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            <Sidebar
              routes={routes}
              logo={{
                outterLink: "https://www.creative-tim.com/",
                text: "Creative Tim",
                imgSrc: logo
              }}
              toggleSidebar={toggleSidebar}
            />
            <div className="main-panel" ref={mainPanelRef} data={color}>
              <AdminNavbar
                brandText={getBrandText(location.pathname)}
                toggleSidebar={toggleSidebar}
                sidebarOpened={sidebarOpened}
                refrechRoutes={refrechRoutes}
              />
              { switchRoutes }
              {
                // we don't want the Footer to be rendered on map page
                location.pathname === "/admin/maps" ? null : <Footer fluid />
              }
            </div>
          </div>
          <FixedPlugin bgColor={color} handleBgClick={changeColor} />
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Admin;
