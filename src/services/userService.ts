/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

const COLLECTION_NAME = 'users';

export const userService = {
  subscribeToUsers(callback: (users: UserProfile[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
      callback(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async updateUserRole(uid: string, role: UserProfile['role']) {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      await updateDoc(docRef, { role });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${uid}`);
    }
  }
};
