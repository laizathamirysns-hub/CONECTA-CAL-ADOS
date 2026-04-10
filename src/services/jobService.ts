/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Job, JobApplication } from '../types';

const COLLECTION_NAME = 'jobs';
const APPLICATIONS_COLLECTION = 'job_applications';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  subscribeToJobs(callback: (jobs: Job[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      callback(jobs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async addJob(job: Omit<Job, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...job,
        createdAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return '';
    }
  },

  async applyForJob(application: Omit<JobApplication, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...application,
        createdAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, APPLICATIONS_COLLECTION);
      return '';
    }
  },

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION), 
        where('jobId', '==', jobId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, APPLICATIONS_COLLECTION);
      return [];
    }
  }
};
