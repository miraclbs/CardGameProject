import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export async function register(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function getCurrentUser() {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  }
  return null;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    } else {
      callback(null);
    }
  });
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'Bu email adresi zaten kullanımda.',
    'auth/invalid-email': 'Geçersiz email adresi.',
    'auth/operation-not-allowed': 'Email/şifre girişi etkin değil.',
    'auth/weak-password': 'Şifre çok zayıf. En az 6 karakter olmalı.',
    'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
    'auth/user-not-found': 'Bu email ile kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password': 'Şifre yanlış.',
    'auth/invalid-credential': 'Email veya şifre hatalı.',
    'auth/too-many-requests': 'Çok fazla deneme yaptınız. Lütfen biraz bekleyin.',
  };

  return errorMessages[errorCode] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

const authManager = {
  register,
  login,
  logout,
  getCurrentUser,
  onAuthChange
};

export default authManager;
