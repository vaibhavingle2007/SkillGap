import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";

console.log(" Firestore db instance:", db);

export interface UserSkill {
  name: string;
  level: number;
}

export interface UserAnalysis {
  id?: string;
  userId: string;
  targetRole: string;
  skills: UserSkill[];
  matchPercentage: number;
  missingSkills: string[];
  matchedSkills: string[];
  createdAt: Date;
}

export interface RoadmapProgress {
  id?: string;
  userId: string;
  skillName: string;
  completedSteps: string[];
  currentStep: number;
  updatedAt: Date;
}

// Save a new skill analysis
export async function saveUserAnalysis(
  user: User,
  data: Omit<UserAnalysis, "id" | "userId" | "createdAt">
): Promise<string> {
  console.log("Attempting to save to Firestore...", { userId: user.uid, data });

  if (!db) {
    console.error(" Firestore not initialized - db is undefined");
    throw new Error("Firestore not initialized. Check Firebase configuration.");
  }

  try {
    const userRef = doc(collection(db, "users"), user.uid);
    const analysisRef = doc(collection(userRef, "analyses"));

    await setDoc(analysisRef, {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    });

    console.log(" Successfully saved to Firestore:", analysisRef.id);
    return analysisRef.id;
  } catch (error) {
    console.error(" Firestore save error:", error);
    throw error;
  }
}

// Get all analyses for a user
export async function getUserAnalyses(user: User): Promise<UserAnalysis[]> {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(collection(db, "users"), user.uid);
  const analysesRef = collection(userRef, "analyses");
  const q = query(analysesRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as UserAnalysis;
  });
}

// Get the most recent analysis
export async function getLatestAnalysis(user: User): Promise<UserAnalysis | null> {
  const analyses = await getUserAnalyses(user);
  return analyses.length > 0 ? analyses[0] : null;
}

// Save roadmap progress for a skill
export async function saveRoadmapProgress(
  user: User,
  skillName: string,
  completedSteps: string[],
  currentStep: number
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(collection(db, "users"), user.uid);
  const progressRef = doc(userRef, "roadmapProgress", skillName);

  await setDoc(progressRef, {
    userId: user.uid,
    skillName,
    completedSteps,
    currentStep,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// Get all roadmap progress
export async function getRoadmapProgress(user: User): Promise<RoadmapProgress[]> {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(collection(db, "users"), user.uid);
  const progressRef = collection(userRef, "roadmapProgress");

  const snapshot = await getDocs(progressRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as RoadmapProgress;
  });
}

// Delete an analysis
export async function deleteAnalysis(user: User, analysisId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(collection(db, "users"), user.uid);
  const analysisRef = doc(collection(userRef, "analyses"), analysisId);

  await deleteDoc(analysisRef);
}