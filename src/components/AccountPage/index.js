import React from 'react'

import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { AuthUserContext } from '../Session'

const AccountPage = () => (
    <div>
        <h1>Account Page</h1>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <div><PasswordForgetForm /><PasswordChangeForm /></div>
                    : <h4>Please Sign In To View This Page</h4>
            }
        </AuthUserContext.Consumer>

    </div>
);


export default AccountPage;