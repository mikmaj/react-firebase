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
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (authUser) {
                        // If an authenticated user is found, get the user from the db with uid
                        this.props.firebase
                            .user(authUser.uid)
                            .once('value')
                            .then(snapshot => {
                                const dbUser = snapshot.val()

                                // Default empty roles
                                if (!dbUser.roles) {
                                    dbUser.roles = []
                                }

                                // Merge auth and db user
                                authUser = {
                                    uid: authUser.uid,
                                    email: authUser.email,
                                    ...dbUser,
                                }

                                // If authorization fails, redirect to the sign in page. Otherwise render the passed component
                                if (!condition(authUser)) {
                                    this.props.history.push(ROUTES.SIGN_IN)
                                }
                            })
                    } else {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                }
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