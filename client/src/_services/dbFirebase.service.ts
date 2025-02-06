import { ref, set, remove, get } from "firebase/database";
import { auth, db } from "../_config/firebaseConfig";
import { sanitizeKey } from "../_helpers/helpers";

class DbFirebaseService {

  constructor() {
  }

  linkCardById = async (setId: string, cardId: string): Promise<void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const safeCardId = sanitizeKey(cardId);
    const cardRef = ref(db, `users/${auth.currentUser?.uid}/sets/${safeSetId}/cards/${safeCardId}`);
    await set(cardRef, true);
  };


  unLinkCardById = async (setId: string, cardId: string): Promise<void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const safeCardId = sanitizeKey(cardId);
    const cardRef = ref(db, `users/${auth.currentUser?.uid}/sets/${safeSetId}/cards/${safeCardId}`);
    await remove(cardRef);
  };


  getMyCards = async (setId: string): Promise<string[] | void> => {
    if (!auth.currentUser?.uid) return;
    const safeSetId = sanitizeKey(setId);
    const listRef = ref(db, `users/${auth.currentUser.uid}/sets/${safeSetId}/cards`);
    const snapshot = await get(listRef);

    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  }
};

export const dbFirebaseServie = new DbFirebaseService();