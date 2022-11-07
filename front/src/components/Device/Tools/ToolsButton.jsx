const { default: classNames } = require("classnames")
const { Button, Row } = require("reactstrap")

const ToolsButton = (props) => {
  var icon = props.icon
  var tool_func = props.tool_func
  var name = props.name
  
  return <div style={{ alignItems: "flex-start", width: '100%', flex: 1 }}>
    <Button
      onClick={() => tool_func()}
      className={classNames("btn-simple")}
      style={{ alignItems: "flex-start", marginRight: '50px', width: '100%', flex: 1 }}>
      <Row style={{ marginLeft: '10px', alignItems: "center", display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
        {icon}
        <p>{name}</p>
      </Row>
    </Button>
  </div>
}

export default ToolsButton