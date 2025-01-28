import { UserSignupPros } from "../_interfaces/user.interface";
import { createUserWithEmailAndPassword, GoogleAuthProvider, linkWithPopup, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from "firebase/auth";
import { auth } from "../_config/firebaseConfig";

class AuthFirebaseService {

  constructor() {
  }

  handleSignupWithEmailAndPassword = async (values: UserSignupPros): Promise<UserCredential | void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password!
      );
      return userCredential
    } catch (error) {
      console.error(error)
    }
  }

  handleSignInWithEmailAndPassword = async (values: any): Promise<UserCredential | void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      return userCredential
    } catch (error) {
      console.error(error)
    }
  }

  handleSignInWithProvider = async (provider: any, providerName: string, closeModal: () => void) => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (e) {
      console.error(e)
    } finally {
      closeModal()
    }
  }
}

export const authFirebaseService = new AuthFirebaseService();