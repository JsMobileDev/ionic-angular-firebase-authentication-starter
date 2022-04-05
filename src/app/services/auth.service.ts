import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userId: string;
  constructor(private auth: Auth, private firestore: Firestore) {}

  getUser(): Promise<User> {
    return authState(this.auth).pipe(first()).toPromise();
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signup(email: string, password: string): Promise<User> {
    try {
      const newUserCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userReference = doc(this.firestore, `userProfile/${newUserCredential.user.uid}`);
      await setDoc(userReference, { email });
      return newUserCredential.user;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
