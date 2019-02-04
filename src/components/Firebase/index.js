import FirebaseContext, { withFirebase } from './context';
import Firebase from './firebase'

// Export a firebase module with context for firebase consumer and provider components
export default Firebase;

export { FirebaseContext, withFirebase }