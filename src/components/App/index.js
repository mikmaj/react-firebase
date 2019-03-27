import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from '../Navigation'
import LandingPage from '../LandingPage'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../HomePage'
import AccountPage from '../AccountPage'
import AdminPage from '../AdminPage'

import * as ROUTES from '../../constants/routes'
import { withAuthentication } from '../Session'

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Navigation />

                    <hr />

                    <Route exact path={ROUTES.LANDING} component={LandingPage} />
                    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                    <Route path={ROUTES.HOME} component={HomePage} />
                    <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                    <Route path={ROUTES.ADMIN} component={AdminPage} />
                </div>
            </Router>
        );
    }
};

export default withAuthentication(App);