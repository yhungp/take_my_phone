import classNames from "classnames";
import { Button } from "reactstrap";

export default function sectionButton(props) {
    var bigChartData = props.bigChartData
    var setBgChartData = props.setBgChartData
    var data = props.data
    var id = props.id
    var name = props.name
    var index = props.index

    return <Button
        tag="label"
        className={classNames("btn-simple", {
            active: bigChartData === data
        })}
        color="info"
        id={id}
        size="sm"
        onClick={() => setBgChartData(data, index)}
        >

        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
            {name}
        </span>
        <span className="d-block d-sm-none">
            <i className="tim-icons icon-single-02" />
        </span>
    </Button>
}