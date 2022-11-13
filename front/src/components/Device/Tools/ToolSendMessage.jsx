import { MdSend } from "react-icons/md"
import { Alert, Button, Col, FormGroup, Input, Label, Row } from "reactstrap"

import classNames from "classnames"
import { CallSendMessage } from 'components/Device/Tools/ToolsApiCalls'

export const SendMessage = (dev, contacts) => {
    var msg = ""
    var phone = contacts[0]

    const handleInput = event => {
        msg = event.target.value
    };

    const onChangeValue = event => {
        phone = event.target.value
    }

    return <FormGroup style={{ padding: '10px' }}>
        <Alert color="info">
            The message sent will not be reflected in the messaging application.
        </Alert>

        {
            contacts.length <= 1 ? null :
                <div style={{ marginBottom: '10px', marginLeft:'15px' }} onChange={onChangeValue} >
                    {
                        contacts.map((contact, index) => {
                            if (index === 0) {
                                return <FormGroup key={index} check>
                                    <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
                                        <input type="radio" defaultChecked='true' value={contact} name={contact} style={{ color: 'white' }} />
                                        <p style={{ color: 'white', marginLeft:'10px', marginTop:'5px' }}>{contact}</p>
                                    </Row>
                                </FormGroup>
                            }

                            return <FormGroup key={index} check>
                                <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
                                    <input type="radio" value={contact} name={contact} />
                                    <p style={{ color: 'white', marginLeft:'10px', marginTop:'5px' }}>{contact}</p>
                                </Row>
                            </FormGroup>
                        })
                    }
                </div>
        }

        <Input id="exampleEmail2" name="email" placeholder="Message" type="email" onChange={handleInput} />
        <Col>
            <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                <Button className={classNames("btn-simple")} style={{ color: "#ffffff", marginTop: '10px' }}
                    onClick={() => {
                        CallSendMessage(dev, msg, phone)
                    }}>
                    Send message {" "} <MdSend size={'20px'} />
                </Button>
            </Row>
        </Col>
    </FormGroup>
}