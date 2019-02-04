import React from 'react'

// Use React's Context API to provide a Firebase instance once at the top-level of the component hierarchy
const FirebaseContext = React.createContext(null)

// Use a higher order component to pass the firebase instance to components
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
)

export default FirebaseContext