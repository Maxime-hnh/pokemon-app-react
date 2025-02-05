import { ref, set, remove, get } from "firebase/database";
import { auth, db } from "../_config/firebaseConfig";

class DbFirebaseService {

  constructor() {
  }

  addFavorite = async (userUid: string, pokemonId: string): Promise<void> => {
    const favRef = ref(db, `users/${userUid}/favorites/${pokemonId}`);
    await set(favRef, true);
  };


  deleteFavorite = async (userUid: string, pokemonId: string): Promise<void> => {
    const favRef = ref(db, `users/${userUid}/favorites/${pokemonId}`);
    await remove(favRef);
  };


  getFavorites = async (userUid: string): Promise<string[] | void> => {
    const favRef = ref(db, `users/${userUid}/favorites`);
    const snapshot = await get(favRef);

    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  }
};

export const dbFirebaseServie = new DbFirebaseService();