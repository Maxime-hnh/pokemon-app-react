import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from "firebase/auth";
import { auth, db } from "../_config/firebaseConfig";
import { notifications } from "@mantine/notifications";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { UserProps } from "../_interfaces/user.interface";

class AuthFirebaseService {

  constructor() {
  }

  handleSignupWithEmailAndPassword = async (values: UserProps): Promise<UserCredential | void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password || "fezfzedz"
      );
      const user = userCredential.user;
      if (user) {
        const userRef = ref(db, 'users/' + user.uid);
        await set(userRef, {
          email: values.email,
          createdAt: new Date(),
        })
      }
      return;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        await this.handleSignInWithEmailAndPassword(values)
      } else {
        notifications.show({ message: error.toString(), color: "red" })
      }
    }
  }

  handleSignInWithEmailAndPassword = async (values: any): Promise<User | void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      return userCredential.user
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