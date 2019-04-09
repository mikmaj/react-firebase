import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
)

const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    isAdmin: false,
    error: null
}

// Custom error messages for users trying to use multiple accounts with same email
const ERROR_CODE_ACCOUNT_EXISTS =
    'auth/email-already-in-use'

const ERROR_MSG_ACCOUNT_EXISTS = `
    An account with this Email address already exists. 
    Try to login with this account instead. If you think the
    account is already used from one of the social logins, try
    to sign-in with one of them. Afterward, associate your accounts
    on your personal account page.
`

class SignUpFormBase extends Component {
    constructor(props) {
        super(props)

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = e => {
        const { username, email, password, isAdmin } = this.state

        const roles = []

        if (isAdmin) {
            roles.push(ROLES.ADMIN)
        }

        // Call the sign up function defined in the firebase class
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            // Create a new user in the db
            .then(authUser => {
                this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                    })
                    .then(() => {
                        // If the request resolves successfully, reset the state to empty the input fields
                        this.setState({ ...INITIAL_STATE })
                        // Redirect to the home page after a successful sign up
                        this.props.history.push(ROUTES.HOME)
                    })
                    .catch(error => {
                        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                            error.message = ERROR_MSG_ACCOUNT_EXISTS
                        }
                        // If the request doesn't resolve correctly, catch the error to show the error message on the page
                        this.setState({ error })
                    })
            })
            .catch(error => {
                // If the request doesn't resolve correctly, catch the error to show the error message on the page
                this.setState({ error })
            })

        // Prevent a browser reload on submit
        e.preventDefault()
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked })
    }

    render() {
        // Destructure the state object
        const {
            username,
            email,
            password,
            passwordConfirm,
            isAdmin,
            error
        } = this.state

        // Validation with booleans. If any condition returns true, disable the submit button
        const isInvalid =
            password !== passwordConfirm ||
            password === '' ||
            email === '' ||
            username === ''

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name" />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address" />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password" />
                <input
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password" />
                <label>
                    Admin:
                    <input
                        name="isAdmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={this.onChangeCheckbox}
                    />
                </label>
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                {/* If an error happens, render the error message */}
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
)

// Use recompose to organize higher-order components and use them to pass instances to the sign up form
const SignUpForm = withRouter(withFirebase(SignUpFormBase))

export default SignUpPage;

export { SignUpForm, SignUpLink }