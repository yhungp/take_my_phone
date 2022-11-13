/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
// react plugin used to create charts
import { MdContactPhone, MdMessage, MdSearch } from "react-icons/md";


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
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
  const [messagesToShow, setMessagesToShow] = useState(null)
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
      setMessagesToShow(messages)
    }
  }, [messages])

  const Contacts = () => {
    setComponent(ContactsGenerator(contacts, showSendMessage, toggleModalSearch))
    setSelected(0)
    setTitle("Contacts")
  }

  const showSendMessage = (name, contacts) => {
    setSelected(3)
    
    if (contacts.length === 1 && name !== contacts[0]) {
      name += " (" + contacts[0] + ")"
    }
    
    setTitle("Send message to " + name)    
    setComponent(SendMessage(deviceName, contacts))
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

  const getName = (phone) => {
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

    return name
  }

  const handleInput = event => {
    let val = event.target.value

    if (val === "" && selected === 0) {
      setComponent(ContactsGenerator(contacts, showSendMessage, toggleModalSearch))
      return
    }

    if (val === "" && selected === 1) {
      setComponent(MessagesByContactGenerator(messages, getInsideChat, contacts))
      return
    }

    var toShow = []
    if (selected === 0) {
      for (let index in contacts) {
        let contact = contacts[index]

        var contact_exist = contact.map((elem) => {
          if (elem.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return false
        })

        if (contact_exist.some(item => item === true)) {
          toShow.push(contact)
        }
      }

      setComponent(ContactsGenerator(toShow, showSendMessage, toggleModalSearch))
      return
    }

    for (let index in messages) {
      let message = messages[index]
      let phone = message['phone']

      var name = getName(phone)

      if (name === "" && phone.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
        toShow.push(message)
        continue
      }

      if (name.toUpperCase().indexOf(val.toUpperCase()) !== -1 || phone.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
        toShow.push(message)
      }
    }

    setComponent(MessagesByContactGenerator(toShow, getInsideChat, contacts))
  };

  const getInsideChat = (phone) => {
    setTitle("Chat " + phone)

    var name = getName(phone)

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
                  {
                    selected === 0 || selected === 1 ?
                      <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1, marginLeft: '0px', marginRight: '35px' }}>
                        <FormGroup >
                          <Input onChange={handleInput} placeholder="Search name/phone" style={{ textAlign: 'center' }} />
                        </FormGroup>
                      </Row>
                      :
                      null
                  }
                </Row>
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <div style={{height:'200px'}}>
                {component}
              </div> */}
              {component}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Tools