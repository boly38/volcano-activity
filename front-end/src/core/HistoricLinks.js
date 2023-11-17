import React, {Component} from "react";
import ApiV0 from "../service/ApiV0";

const DEBUG = false;
export default class HistoricLinks extends Component {
    goTo(page, volcanoId) {
        ApiV0.showPage(page, volcanoId)
    }

    historicEntry(index, historic, isLast) {
        const { page, volcanoId } = historic
        const title = ApiV0.isSet(volcanoId) ? volcanoId : page;
        return (<>
            <button key={index}
                    onClick={() => this.goTo(page, volcanoId)}
                    className="histoLink"
                    title={title}>{title}</button>
            {!isLast && (<>&#160;◾&#160;</>)}
        </>);
    }

    render() {
        const {historic} = this.props;
        if (historic === undefined || historic.length < 1) {
            return null;
        }
        return (<div className="histoLinks">Historic :
            {DEBUG && JSON.stringify(historic)}
            {historic.map((h, i) => this.historicEntry(i, h, i === historic.length - 1))}
        </div>)
    }
}