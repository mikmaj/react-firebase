import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Get confidential information from environment variables
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
}

class Firebase {
    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
        this.db = app.database()
        // Enable Google login
        this.googleProvider = new app.auth.GoogleAuthProvider()
        this.facebookProvider = new app.auth.FacebookAuthProvider()
    }

    // ### Auth API ###
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider)

    diSignInWithFacebook = () =>
        this.auth.signInWithPopup(this.facebookProvider)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

    // ### Merge Auth and DB User API ###
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
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
                            ...dbUser,
                        }

                        next(authUser)
                    })
            } else {
                fallback()
            }
        })

    // ### User API ###
    // Get a single user from the Firebase real-time db
    user = uid => this.db.ref(`users/${uid}`)
    // Get all users
    users = () => this.db.ref('users')
}

export default Firebase