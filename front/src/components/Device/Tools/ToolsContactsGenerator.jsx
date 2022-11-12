import { MdMessage } from "react-icons/md";

import {
  Row,
  Col,
  Table,
  Button
} from "reactstrap";

export const ContactsGenerator = (contacts, showSendMessage, toggleModalSearch) => {

  var counter = -1
  var contactComponent = contacts.map((contact) => {
    counter += 1
    var name = contact[0]
    var contacts = contact.slice(1)

    return <tr key={counter}>
      <td>
        <Col>
          <p style={{ fontSize: "16px" }}>{name}</p>
        </Col>
      </td>
      <td className="text-center" style={{ width: '200px' }} >
        <Col>
          {
            contacts.map((contact, index) => {
              return (
                <p key={index} style={{ fontSize: "12px", margin: '10px' }}>{contact}</p>
              )
            })
          }
        </Col>
      </td>
      <td style={{ width: '100px' }} className="text-center">
        <Button color="link" alt={"Add device"} style={{ color: "#ffffff" }} onClick={() => {
          showSendMessage(name, contacts)
        }}>
          <Col>
            <Row style={{ alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
              <MdMessage size={'20px'}/>
            </Row>
          </Col>
        </Button>
      </td>
    </tr>
  })

  return <Table className="tablesorter" responsive>
    <thead className="text-primary">
      <tr>
        <th>Name</th>
        <th className="text-center">Phones</th>
        <th className="text-center">Send message</th>
      </tr>
    </thead>
    <tbody>
      {contactComponent}
    </tbody>
  </Table>
}
