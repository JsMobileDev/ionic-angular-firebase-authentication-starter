import { Injectable } from '@angular/core';
import { doc, DocumentData, DocumentReference, Firestore, getDoc, setDoc, docData } from '@angular/fire/firestore';
import { User, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user';
import { map, catchError, switchMap, tap, concatMap, first } from 'rxjs/operators';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private currentUser: User;
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getUserProfileReference(): Observable<DocumentReference<DocumentData>> {
    return this.authService.getUser().pipe(
      map(user => {
        this.currentUser = user;
        return doc(this.firestore, `users/${user.uid}`);
      }),
      catchError(() => EMPTY)
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.getUserProfileReference().pipe(
      switchMap(userProfileReference => {
        return docData(userProfileReference) as Observable<UserProfile>;
      }),
      catchError(() => EMPTY)
    );
  }

  updateName(fullName: string): Observable<DocumentReference<DocumentData>> {
    return this.getUserProfileReference().pipe(
      tap({
        next: userProfileReference => setDoc(userProfileReference, { fullName }, { merge: true }),
        error: error => console.error(error),
      }),
      catchError(() => EMPTY)
    );
  }

  updateEmail(newEmail: string, password: string): Observable<unknown> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
      this.getUserProfileReference().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user, userProfileReference]) => {
        const credential = EmailAuthProvider.credential(userProfile.email, password);
        return from(reauthenticateWithCredential(user, credential)).pipe(
          tap({
            next: () =>
              from(
                updateEmail(user, newEmail).then(() =>
                  setDoc(userProfileReference, { email: newEmail }, { merge: true })
                )
              ),
            error: error => console.error(error),
          })
        );
      })
    );
  }

  updatePassword(newPassword: string, oldPassword: string): Observable<unknown> {
    return forkJoin([this.getUserProfile().pipe(first()), this.authService.getUser().pipe(first())]).pipe(
      concatMap(([userProfile, user]) => {
        const credential = EmailAuthProvider.credential(userProfile.email, oldPassword);
        return from(reauthenticateWithCredential(user, credential)).pipe(
          tap({
            next: () => {
              return from(updatePassword(user, newPassword));
            },
            error: error => console.error(error),
          })
        );
      })
    );
  }
}
