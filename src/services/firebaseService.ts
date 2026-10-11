import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { IdeaSubmission, VisionOption, WorkspaceTask, RecruitmentPost } from '../types';

// Collections
const SUBMISSIONS_COLLECTION = 'submissions';
const VISION_OPTIONS_COLLECTION = 'vision_options';

// ==========================================
// 1. Idea Submissions
// ==========================================
export const subscribeToSubmissions = (callback: (data: IdeaSubmission[]) => void) => {
  const q = query(collection(db, SUBMISSIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const submissions: IdeaSubmission[] = [];
    querySnapshot.forEach((doc) => {
      submissions.push(doc.data() as IdeaSubmission);
    });
    callback(submissions);
  });
};

export const saveSubmission = async (submission: IdeaSubmission) => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
  await setDoc(docRef, submission);
};

export const updateSubmissionInDb = async (id: string, data: Partial<IdeaSubmission>) => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
  await updateDoc(docRef, data);
};

export const deleteSubmissionFromDb = async (id: string) => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
  await deleteDoc(docRef);
};

// ==========================================
// 2. Vision Options (Voting)
// ==========================================
export const subscribeToVisionOptions = (callback: (data: VisionOption[]) => void) => {
  const q = query(collection(db, VISION_OPTIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const options: VisionOption[] = [];
    querySnapshot.forEach((doc) => {
      options.push(doc.data() as VisionOption);
    });
    callback(options);
  });
};

export const saveVisionOption = async (option: VisionOption) => {
  const docRef = doc(db, VISION_OPTIONS_COLLECTION, option.id);
  await setDoc(docRef, option);
};

export const updateVisionOptionInDb = async (id: string, data: Partial<VisionOption>) => {
  const docRef = doc(db, VISION_OPTIONS_COLLECTION, id);
  await updateDoc(docRef, data);
};

export const initializeDefaultData = async (initialSubmissions: IdeaSubmission[], initialVisions: VisionOption[]) => {
  // Only runs once if database is completely empty
  const subSnap = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
  if (subSnap.empty) {
    for (const sub of initialSubmissions) {
      await saveSubmission(sub);
    }
  }

  const visSnap = await getDocs(collection(db, VISION_OPTIONS_COLLECTION));
  if (visSnap.empty) {
    for (const vis of initialVisions) {
      await saveVisionOption(vis);
    }
  }
};

// ==========================================
// 3. Invitations & Role Applications (Firestore Sync)
// ==========================================
const INVITATIONS_COLLECTION = 'invitations';
const APPLICATIONS_COLLECTION = 'role_applications';

export const subscribeToInvitations = (callback: (data: any[]) => void) => {
  const q = query(collection(db, INVITATIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    callback(list);
  }, (err) => {
    console.warn('Firestore invitations subscription skipped/failed:', err);
  });
};

export const saveInvitationToDb = async (invitation: any) => {
  try {
    const docRef = doc(db, INVITATIONS_COLLECTION, invitation.id);
    await setDoc(docRef, invitation);
  } catch (err) {
    console.warn('Firestore invitation save failed:', err);
  }
};

export const subscribeToRoleApplications = (callback: (data: any[]) => void) => {
  const q = query(collection(db, APPLICATIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    callback(list);
  }, (err) => {
    console.warn('Firestore role_applications subscription skipped/failed:', err);
  });
};

export const saveRoleApplicationToDb = async (app: any) => {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, app.id);
    await setDoc(docRef, app);
  } catch (err) {
    console.warn('Firestore role_application save failed:', err);
  }
};

export const updateRoleApplicationInDb = async (id: string, data: any) => {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch (err) {
    console.warn('Firestore role_application update failed:', err);
  }
};

