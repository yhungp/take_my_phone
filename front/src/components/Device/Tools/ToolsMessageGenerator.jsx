import classNames from "classnames";
import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Button
} from "reactstrap";

export const MessagesByContactGenerator = (messages, getInsideChat, contacts) => {
  var counter = -1

  var appsComponent = messages.map((message) => {
    counter += 1
    const phone = message['phone']
    const messages = message['messages']
    // var date = message['date']
    // var inbox = message['inbox']

    // getInsideChat(phone)

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

    return <tr key={counter}>
      <td>
        <Button
          color="link"
          onClick={() => getInsideChat(phone)}
          className={classNames("btn-simple")}
          style={{ alignItems: "flex-start", marginRight: '50px', flex: 1 }}>
          <Row style={{ marginLeft: '10px', alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
            <i className="tim-icons icon-minimal-right" color="#ffffff" />
            <Col>
              <p style={{ textAlign: 'justify' }} >{name}</p>
              <p style={{ textAlign: 'justify' }} >{phone}</p>
            </Col>
          </Row>
        </Button>
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
          <p style={{ color: textColor }}>{message}</p>
        </CardBody>
      </Card>
    </Row>
  });

  return <Col>{listItems}</Col>
}