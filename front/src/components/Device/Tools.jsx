/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
// react plugin used to create charts
import { MdContactPhone, MdMessage } from "react-icons/md";


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";


import ToolsButton from "components/Device/Tools/ToolsButton"
import ContactsGenerator from "components/Device/Tools/ToolsContactGenerator"
import callForContacts from "components/Device/Tools/ToolsApiCalls"
import { callForMessages } from "components/Device/Tools/ToolsApiCalls";

const Tools = (props) => {
  var devname = props.devname

  const [start, setStart] = useState(true)
  const [contacts, setContacts] = useState(null)
  const [messages, setMessages] = useState(null)
  const [component, setComponent] = useState(null)

  useEffect(() => {
    if (start) {
      callForContacts(setContacts, devname)
      setStart(false)
    }
  }, [start])

  useEffect(() => {
    if (contacts !== null) {
      setComponent(ContactsGenerator(contacts))
    }
  }, [contacts])

  const Contacts = () => {
    setComponent(ContactsGenerator(contacts))
  }

  const Messages = () => {
    if (messages !== null){

    } else {
      callForMessages(setMessages, devname)
    }
  }

  return (
    <div className="content">
      <Row>
        <Col lg="3">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h3">
                <i className="tim-icons icon-settings text-info" />{"  Tools: "}
              </CardTitle>
            </CardHeader>
            <CardBody style={{ padding: '10px' }}>

              <ToolsButton
                icon={<MdContactPhone size={'35px'} style={{ marginRight: '10px' }} />}
                tool_func={Contacts}
                name={"Contacts"}
              />

              <ToolsButton
                icon={<MdMessage size={'35px'} style={{ marginRight: '10px' }} />}
                tool_func={Messages}
                name={"Messages"}
              />

            </CardBody>
          </Card>
        </Col>
        <Col lg="9">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Simple Table</CardTitle>
            </CardHeader>
            <CardBody>
              {component}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* <Col lg="2" /> */}

      </Row>
    </div>
  )
}

export default Tools