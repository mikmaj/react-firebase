// Higher-order component for session handling for the authenticated user

import React from 'react'

import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props)

            // Store the authenticated user in global state so it can be passed to other components
            this.state = {
                authUser: null
            }
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (authUser) {
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
                                    ...dbUser
                                }

                                this.setState({ authUser })
                            })
                    } else {
                        this.setState({ authUser: null })
                    }
                })
        }

        // Clean up the listener to avoid memory leaks
        componentWillUnmount() {
            this.listener()
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(WithAuthentication)
}

export default withAuthentication