import React, { Component } from 'react';
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'
import * as ROLES from '../../constants/roles'

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            users: []
        }
    }

    // Fetch the list of registered users on component load
    componentDidMount() {
        this.setState({ loading: true })
        // The 'on' listener triggers every time something in the database has changed
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val()
            // Map the user objects into the users array
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key
            }))
            this.setState({
                users: usersList,
                loading: false
            })
        })
    }

    // Remove the listener to avoid memory leaks
    componentWillUnmount() {
        this.props.firebase.users().off()
    }

    render() {
        const { users, loading } = this.state
        return (
            <div>
                <h1>Admin</h1>
                <p>
                    The Admin Page is accessible by every signed in admin user.
                </p>
                {loading && <div>Loading ...</div>}
                <UserList users={users} />
            </div>
        )
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>ID:</strong> {user.uid}
                </span>
                <span>
                    <strong>Email:</strong> {user.email}
                </span>
                <span>
                    <strong>Username:</strong> {user.username}
                </span>
            </li>
        ))}
    </ul>
)

const condition = authUser => 
            authUser && authUser.roles.includes(ROLES.ADMIN)

export default compose(
    withAuthorization(condition),    
    withFirebase,
    )(AdminPage);