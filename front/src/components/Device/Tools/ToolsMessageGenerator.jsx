import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Button
} from "reactstrap";

export const MessagesByContactGenerator = (messages, getInsideChat) => {
  var counter = -1
  var appsComponent = messages.map((message) => {
    counter += 1
    const phone = message['phone']
    const messages = message['messages']

    return <tr key={counter}>
      <td>
        <Col>
          <Button color="link" style={{ color: "#ffffff" }} onClick={() => getInsideChat(phone)}>
            <Col>
              <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
                <i className="tim-icons icon-minimal-right" style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }} />
                <p style={{ fontSize: "16px", marginLeft: '10px' }}>
                  {phone}
                </p>
              </Row>
            </Col>
          </Button>
        </Col>
      </td>
      <td className="text-center" style={{ width: '200px' }} >
        <Col>
          <p style={{ fontSize: "10px", marginLeft: '10px' }}>
            Messages count{" "}({messages.length})
          </p>
        </Col>
      </td>
    </tr>
  })

  return <Table className="tablesorter" responsive>
    <thead className="text-primary">
      <tr>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {appsComponent}
    </tbody>
  </Table>
}

export const MessagesChatGenerator = (chat, name) => {
  // var phone = chat['phone']
  var messages = chat['messages']
  var inbox = chat['inbox']
  // var date = chat['date']

  const listItems = messages.map((message, index) => {
    var inOut = { alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }
    var color = "info"
    var textColor = "#dddddd"

    if (!inbox[index]) {
      inOut = { alignItems: "center", display: 'flex', justifyContent: 'flex-end', flex: 1 }
      color = "light"
      textColor = "#333333"
    }

    return <Row key={index} style={inOut}>
      <Card color={color} style={{ maxWidth: '500px' }}>
        <CardBody>
          <p style={{color:textColor}}>{message}</p>
        </CardBody>
      </Card>
    </Row>
  });

  return <Col>{listItems}</Col>
}