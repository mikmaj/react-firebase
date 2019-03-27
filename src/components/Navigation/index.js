import React from 'react';
import { Link } from 'react-router-dom'

import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'
import { AuthUserContext } from '../Session'
import './Navigation.scss'

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
)

// Links to show if a user is authenticated
const NavigationAuth = () => (
    <ul>
        {/* Get navigation routes from constants/routes.js */}
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul>
)

// Links to show if a user is not authenticated
const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
)

export default Navigation;