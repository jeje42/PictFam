import React, {Component} from "react"
import {AppState} from "../store";
import {logoutAction} from "../store/auth-profile/actions";
import {connect} from "react-redux";

interface CheckTokenValidComponentState {
    intervalId: any
}

interface CheckTokenValidComponentProps {
    isAuthenticated: boolean,
    expirationDate?: Date,
    logoutAction: typeof logoutAction,
}

class CheckTokenValidComponent extends Component<CheckTokenValidComponentProps, CheckTokenValidComponentState> {
    componentDidMount () {
        let intervalId = setInterval(this.timer.bind(this), 2000)
        this.setState({intervalId: intervalId})
    }

    componentWillUnmount () {
        clearInterval(this.state.intervalId)
    }

    timer() {
        let mustLogout = this.props.isAuthenticated && this.props.expirationDate === undefined

        mustLogout = mustLogout || (this.props.expirationDate !== undefined && new Date(Date.now()) > this.props.expirationDate)

        if (mustLogout) {
            this.props.logoutAction()
        }
    }

    render() {
        return (
            <>
            </>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
        isAuthenticated: state.auth.isAuthenticated,
        expirationDate: state.auth.expirationDate,
    })

export default connect(mapStateToProps, {
    logoutAction,
})(CheckTokenValidComponent)