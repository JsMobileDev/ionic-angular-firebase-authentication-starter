import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user';
import { doc, DocumentData, DocumentReference, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { User, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private userProfileReference: DocumentReference<DocumentData>;
  private currentUser: User;
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async getUserProfileReference(): Promise<DocumentReference<DocumentData>> {
    const user: User = await this.authService.getUser();
    this.currentUser = user;
    console.log(user);
    return doc(this.firestore, `users/${user.uid}`);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const userProfileReference = await this.getUserProfileReference();
    const userProfile = await getDoc(userProfileReference);
    return userProfile.exists() ? (userProfile.data() as UserProfile) : null;
  }

  async updateName(fullName: string): Promise<void> {
    const userProfileReference = await this.getUserProfileReference();
    return setDoc(userProfileReference, { fullName });
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    const userProfile = await this.getUserProfile();
    const credential = EmailAuthProvider.credential(userProfile.email, password);

    try {
      const user = await this.authService.getUser();
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      const userProfileReference = await this.getUserProfileReference();
      return setDoc(userProfileReference, { email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
    const userProfile = await this.getUserProfile();
    const credential = EmailAuthProvider.credential(userProfile.email, oldPassword);

    try {
      const user = await this.authService.getUser();
      await reauthenticateWithCredential(user, credential);
      return await updatePassword(user, newPassword);
    } catch (error) {
      console.error(error);
    }
  }
}
