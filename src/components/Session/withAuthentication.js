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
                authUser: JSON.parse(localStorage.getItem('authUser'))
            }
        }

        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    // Store the user to the local storage too so don't need to wait for Firebase to check it
                    localStorage.setItem('authuser', JSON.stringify(authUser))
                    this.setState({ authUser })
                },
                () => {
                    localStorage.removeItem('authuser')
                    this.setState({ authUser: null })
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