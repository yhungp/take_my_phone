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
  Button,
} from "reactstrap";


import ToolsButton from "components/Device/Tools/ToolsButton"
import {
  ContactsGenerator,
} from "components/Device/Tools/ToolsContactsGenerator"

import {
  MessagesByContactGenerator,
  MessagesChatGenerator
} from "components/Device/Tools/ToolsMessageGenerator"

import {
  listMessages,
  updateMessages,
  listContacts,
  updateContacts
} from "components/Device/Tools/ToolsApiCalls";

import { SendMessage } from 'components/Device/Tools/ToolSendMessage'

const Tools = (props) => {
  var deviceName = props.devname

  const [start, setStart] = useState(true)
  const [contacts, setContacts] = useState(null)
  const [messages, setMessages] = useState(null)
  const [component, setComponent] = useState(null)
  const [title, setTitle] = useState(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (start) {
      listContacts(setContacts, deviceName)
      setTitle("Contacts")
      setStart(false)
      updateContacts(contactsUpdater, deviceName)
    }
  }, [start])

  useEffect(() => {
    if (contacts !== null && selected === 0) {
      setComponent(ContactsGenerator(contacts, showSendMessage, toggleModalSearch))
    }
  }, [contacts])

  useEffect(() => {
    if (messages !== null && selected === 1) {
      setComponent(MessagesByContactGenerator(messages, getInsideChat, contacts))
    }
  }, [messages])

  const Contacts = () => {
    setComponent(ContactsGenerator(contacts, showSendMessage, toggleModalSearch))
    setSelected(0)
    setTitle("Contacts")
  }

  const showSendMessage = (name, contacts) => {
    setSelected(3)
    setTitle("Send message to " + name)

    console.log(deviceName)
    setComponent(SendMessage(deviceName))
  }

  const contactsUpdater = (contacts) => {
    setContacts(contacts)
  }

  const Messages = () => {
    setTitle("Messages")
    setSelected(1)

    if (messages !== null) {
      setComponent(MessagesByContactGenerator(messages, getInsideChat, contacts))
    } else {
      listMessages(setMessages, deviceName)
      updateMessages(setMessages, deviceName)
      setComponent(null)
    }
  }

  const getInsideChat = (phone) => {
    setTitle("Chat " + phone)

    var name = ""
    for (var j in contacts) {
      var contact = contacts[j]
      var numbers = contact.slice(1,)
      var flag = false

      for (var i in numbers) {
        var number = numbers[i].replaceAll(" ", "")

        if (phone.indexOf(number) !== -1) {
          name = contact[0]
          flag = true
          break
        }
      }

      if (flag) {
        break
      }
    }

    for (var index in messages) {
      var chat = messages[index]

      if (chat['phone'] === phone) {
        setComponent(MessagesChatGenerator(chat, name))
        var tag = name !== "" ? name + " (" + phone + ")" : "" + phone
        setTitle("Chat with " + tag)
        setSelected(2)
        break
      }
    }

  }

  const [modalSearch, setModalSearch] = React.useState(false);

  const toggleModalSearch = () => {
    console.log("test")
    setModalSearch(!modalSearch);
  };

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
              <CardTitle tag="h4">
                <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1, marginLeft: '0px' }}>
                  {
                    (selected !== 2) ? null :
                      <Button color="link" style={{ color: "#ffffff" }} onClick={Messages}>
                        <i className="tim-icons icon-simple-remove" style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }} />
                      </Button>
                  }

                  {
                    selected !== 3 ? null :
                      <Button color="link" style={{ color: "#ffffff" }} onClick={Contacts}>
                        <i className="tim-icons icon-simple-remove" style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }} />
                      </Button>
                  }
                  {title}
                </Row>
              </CardTitle>
            </CardHeader>
            <CardBody>
              {component}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Tools