import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC3QxgxlFG82L1e4pjUTH2LgH248rVLKsk",
    authDomain: "cardgame-4f5eb.firebaseapp.com",
    projectId: "cardgame-4f5eb",
    storageBucket: "cardgame-4f5eb.firebasestorage.app",
    messagingSenderId: "749698438326",
    appId: "1:749698438326:web:59a9dde55c97d0958d0217"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
