// Higher-order component for user authorization

import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import AuthUserContext from './context'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        // Use a Firebase listener to trigger a callback when the authenticated user changes
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                },
                () => this.props.history.push(ROUTES.SIGN_IN)
            )
        }

        componentWillUnmount() {
            this.listener()
        }

        // Make sure the protected component is not displayed for unauthorized users
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            )
        }
    }

    return compose(
        withRouter,
        withFirebase
    )(WithAuthorization)
}

export default withAuthorization