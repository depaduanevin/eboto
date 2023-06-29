import { Injectable } from '@angular/core';
import {
  collection,
  collectionSnapshots,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  votersData: Array<any> = [];
  constructor(private fireStore: Firestore) {}

  getVotersData(): Observable<any> {
    const dbInstance = collection(this.fireStore, 'voters_information');

    getDocs(dbInstance)
      .then((res: any) => {
        this.votersData = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
      })
      .catch((err: any) => {
        console.log(err);
      });
    return <any>this.votersData;
  }

  getVotesResult(): Observable<any> {
    const dbInstance = collection(this.fireStore, 'votes');

    return from(collectionSnapshots(dbInstance)).pipe(
      map((res) => {
        return res.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
      })
    );
  }
}
