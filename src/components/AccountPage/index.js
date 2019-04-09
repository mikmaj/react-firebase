import React, { Component } from 'react'

import { PasswordForgetForm } from '../PasswordForget'
import { withFirebase } from '../Firebase'
import PasswordChangeForm from '../PasswordChange'
import { AuthUserContext, withAuthorization } from '../Session'

const SIGN_IN_METHODS = [
    {
        id: 'password',
        provider: null,
    },
    {
        id: 'google.com',
        provider: 'googleProvider'
    }
]

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Account: {authUser.email}</h1>
                <PasswordForgetForm />
                <PasswordChangeForm />
                <LoginManagement authUser={authUser} />
            </div>
        )}
    </AuthUserContext.Consumer>
)

class LoginManagementBase extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeSignInMethods: [],
            error: null,
        }
    }

    componentDidMount() {
        this.props.firebase.auth
            // Fetch all active sign in methods for the users email address
            .fetchSignInMethodsForEmail(this.props.authUser.email)
            .then(activeSignInMethods =>
                this.setState({ activeSignInMethods, error: null }),
            )
            .catch(error => this.setState({ error }))
    }

    render() {
        const { activeSignInMethods, error } = this.state

        return (
            <div>
                Sign In Methods:
                <ul>
                    {SIGN_IN_METHODS.map(signInMethod => {
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        )

                        return (
                            <li key={signInMethod.id}>
                                {isEnabled ? (
                                    <button type="button" onClick={() => { }}>
                                        Deactivate {signInMethod.id}
                                    </button>
                                ) : (
                                        <button type="button" onClick={() => { }}>
                                            Link {signInMethod.id}
                                        </button>
                                    )}
                            </li>
                        )
                    })}
                </ul>
                {error && error.message}
            </div>
        )
    }
}

const LoginManagement = withFirebase(LoginManagementBase)

// Only show the page for authorized users
const condition = authUser => !!authUser

export default withAuthorization(condition)(AccountPage);