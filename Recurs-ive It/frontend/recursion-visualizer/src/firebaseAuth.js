import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase config


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Function to sign in with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential; 
  } catch (error) {
    throw error; 
  }
};
