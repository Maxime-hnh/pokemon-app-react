interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAINE: string;
  readonly VITE_FIREBASE_PROJECTID: string;
  readonly VITE_FIREBASE_STORAGEBUCKET: string;
  readonly VITE_FIREBASE_MESSAGINGSENDERID: string;
  readonly VITE_FIREBASE_APPID: string;
  readonly VITE_FIREBASE_MESUREMENTID: string;
  readonly VITE_EBAY_SEARCHITEMS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}