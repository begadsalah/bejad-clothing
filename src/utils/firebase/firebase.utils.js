//this whole file is just a particualr style google just wants from us no logic needed to be understand
// how to sign in with google accoutn
// how to store that google user inside of our fire store database
// sigining in with redirect --> learning other auth methods google provids through firebase
//onAuthStateChanged: observable listener: way to hook into some kind of stream of events, wether these events are sign-in events or sign-out we are actually able to trigger somthing based on these changes

import { initializeApp } from "firebase/app"; // CRUD service
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"; //authentication service

//diff service/ doc-retireve documents inside of our firestore db, getDoc-access data inside document, setDoc- set data inside document
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRJD8rdsvSsRDxpwbEjH7jOA9bdPQYEWo",
  authDomain: "bejad-clothing-db.firebaseapp.com",
  projectId: "bejad-clothing-db",
  storageBucket: "bejad-clothing-db.appspot.com",
  messagingSenderId: "1058860968823",
  appId: "1:1058860968823:web:d47cf148d650e6779e8f72",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// there are differnet provider you can use (google-facebook-github-etc)
const googleProvider = new GoogleAuthProvider(); // use google auth initialize a provider

googleProvider.setCustomParameters({
  // some Particular configuration the google wants
  prompt: "select_account",
});

export const auth = getAuth();
//the provider given here is google provider
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider); // now we need to laverage this

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider); // now we need to laverage this

// instantiate a Db instantiate our fireStore
export const db = getFirestore(); // tell when wanna get a doc set or access, points to database

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q); //async ability to fetch those doc snapshots
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

//methode , async func receives some user auth object
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid); // we wanna know if  there is a existing doc refernce,takes 3 arguments (db,Collections,identifier(unique ID))

  //kinda the data
  const userSnapshot = await getDoc(userDocRef);
  // to check inside of our db does that ref and data relates to the ref even exists? empty collection ?, usage: if we have data or not if not create for me

  //let's laverage that piece of information dat we have
  //if user data doesn't exists, creating a user documents to our database(firebase) in a handy way
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  //if the user data exists
  return userDocRef;
};

// we are making here is a authenticated user inside of our firebase authentication tab
// async func - cause we are gonna set some value asynchronously inside of our firebase
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

// whenever you instatiate this function you have to give me a callback
//it's an open listener : the moment you set it ,this thing is always waiting to see whether or not auth states(signin/out) when it does it will auto callback a function
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// main idea is just that these are the tools that google has determined to use faster in order to best actually store things inside a firestore
