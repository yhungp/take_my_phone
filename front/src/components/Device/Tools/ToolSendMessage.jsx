import { MdSend } from "react-icons/md"
import { Button, Col, FormGroup, Input, Row } from "reactstrap"

import classNames from "classnames"
import { CallSendMessage } from 'components/Device/Tools/ToolsApiCalls'

export const SendMessage = (dev) => {
    var msg = ""

    const handleInput = event => {
        msg = event.target.value
    };

    return <FormGroup row style={{ padding: '10px' }}>
        <Input
            id="exampleEmail2"
            name="email"
            placeholder="Message"
            type="email"
            onChange={handleInput}
        />
        <Col>
            <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                <Button className={classNames("btn-simple")} style={{ color: "#ffffff", marginTop: '10px' }}
                    onClick={() => CallSendMessage(dev, msg, "+5358182481")}>
                    Send message {" "} <MdSend size={'20px'} />
                </Button>
            </Row>
        </Col>
    </FormGroup>
}