import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

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
    error: null
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props)

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = e => {
        const { username, email, password } = this.state

        // Call the sign up function defined in the firebase class
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            // Create a new user in the db
            .then(authUser => {
                return this.props.firebase.user(authUser.user.uid).set({
                    username,
                    email
                })
            })
            .then(() => {
                // If the request resolves successfully, reset the state to empty the input fields
                this.setState({ ...INITIAL_STATE })
                // Redirect to the home page after a successful sign up
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                // If the request doesn't resolve correctly, catch the error to show the error message on the page
                this.setState({ error })
            })

        // Prevent a browser reload on submit
        e.preventDefault()
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        // Destructure the state object
        const {
            username,
            email,
            password,
            passwordConfirm,
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
const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase)

export default SignUpPage;

export { SignUpForm, SignUpLink }