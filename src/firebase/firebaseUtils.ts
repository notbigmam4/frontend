
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    updateDoc,
} from "firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import {db, imgdb} from './firebaseConfig'
import { ref, deleteObject, listAll, uploadBytes, getDownloadURL } from "firebase/storage";
import type { ChangeEvent } from "react";
import { nanoid } from 'nanoid';
import { UserType } from "../types/User";
import type { ActivityLog, ActivityLogInput } from "../types/ActivityLog";
import { generateRandomId16 } from "../utils";

type SupportMessage = {
    id:string
    email:string
    message:string
    createdAt?:Timestamp | null
}

async function deleteImages(folder:string) {
    const listRef = ref(imgdb, folder);
    const result = await listAll(listRef)
    await Promise.all(result.items.map((itemRef)=>deleteObject(itemRef)))
}

async function uploadImage(folder:string | undefined,e:ChangeEvent<HTMLInputElement> | undefined) {

    if (!e?.target?.files) return {error:true}
    const imgid = nanoid()

    const imgs = ref(imgdb,`${folder}/${imgid}`)
    const data = await uploadBytes(imgs,e.target.files[0])
    
    const imgURL = await getDownloadURL(data.ref)

       
    return {imgURL}

    

}


async function getUser (id:string) {
    //console.log(uid, updatedName)
    const docRef = doc(db, 'Users',id.toString())
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {data:docSnap.data()}
    } else {
    // docSnap.data() will be undefined in this case
        return {error:'Ugyldig kode'}
    }
    
}
async function getDagenstall () {
    //console.log(uid, updatedName)
    const docRef = doc(db, 'public','dagensdata')
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {data:docSnap.data()}
    } else {
    // docSnap.data() will be undefined in this case
        return {error:'Ugyldig kode'}
    }
    
}
async function setDagenstall (inp:string) {
    //console.log(uid, updatedName)
    const col = collection(db, 'public')
    await setDoc(doc(col, 'dagensdata'), {
        dagenstall:inp
    });

    
    
}
async function createUser (slug:string) {
    function generateRandomCode() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    const randomCode = generateRandomCode();

    const userref = collection(db, "Users");

    await setDoc(doc(userref, randomCode.toString()), {
        slug,
        status:'pending',
        id:randomCode.toString()
    });
    return randomCode.toString()
    
}
async function addDataUser (id:string,img:string,name:string,birthday:string) {
    const userref = collection(db, "Users");
    try {
        await updateDoc(doc(userref, id), {
            img,
            name,
            birthday
        });
        return {}
    } catch (error) {
        return {error}
    }
    
}
async function updateDataUser (id:string,name:string | undefined,birthday:string | undefined) {
    const userref = collection(db, "Users");
    try {
        const updates:Record<string, string> = {}
        if (name) updates.name = name
        if (birthday) updates.birthday = birthday
        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(userref, id), updates);
        }
        return {}
    } catch (error) {
        return {error}
    }
    
}
async function getUsers () {
    

    
    const usersref = collection(db, 'Users')
    const users = await getDocs(usersref)
    const res = [] as UserType[]

    users.forEach((element) => {
        res.push(element.data() as UserType)
    });
    return res as UserType[]
    
}
async function deleteUser (id:string) {
    const usersref = doc(db, 'Users',id.toString())
    await deleteDoc(usersref)
}

async function createPaymentID (email:string):Promise<{ data: {paymentId:string} | false; error: number|false; }> {
    const usersref = doc(db, 'paymentIDs',email.toString())
    try {
        const initid = await getDoc(usersref)
        const existingData = initid.data()

        if (typeof existingData?.paymentId === 'string') {
            return {data:{paymentId:existingData.paymentId},error:false}
        } 
        const newid = generateRandomId16()

        try {
            await setDoc(usersref,{
                paymentId:newid
            })
            return {data:{paymentId:newid},error:false}

        } catch {
            return {error:2,data:false}
        }


    } catch (error) {
        console.log(error)
        return {error:1,data:false}
    }
    

    
}
async function AddMessageUser (email:string | undefined,msg:string | undefined) {
    const normalizedEmail = email?.trim()
    const normalizedMessage = msg?.trim()
    if (!normalizedEmail || !normalizedMessage) {
        throw new Error('Email and message are required')
    }

    await addDoc(collection(db, "Messages"), {
        email:normalizedEmail,
        message:normalizedMessage,
        createdAt:serverTimestamp()
    })
}

async function GetMessages ():Promise<SupportMessage[]> {
    const snapshot = await getDocs(collection(db, "Messages"))
    return snapshot.docs.flatMap((messageDoc)=>{
        const data = messageDoc.data()
        if (typeof data.email !== 'string') return []
        if (typeof data.message === 'string') {
            return [{
                id:messageDoc.id,
                email:data.email,
                message:data.message,
                createdAt:data.createdAt as Timestamp | undefined
            }]
        }

        return Object.entries(data)
            .filter(([key, value])=>key !== 'email' && typeof value === 'string')
            .map(([key, message])=>({
                id:`${messageDoc.id}-${key}`,
                email:data.email as string,
                message:message as string
            }))
    })
}

type ActivityLogCursor = QueryDocumentSnapshot<DocumentData>

async function addActivityLog (activity:ActivityLogInput) {
    await addDoc(collection(db, "activityLogs"), {
        ...activity,
        createdAt:serverTimestamp()
    })
}

async function getActivityLogsPage (
    pageSize = 50,
    cursor?:ActivityLogCursor
) {
    const activityCollection = collection(db, "activityLogs")
    const activityQuery = cursor
        ? query(activityCollection, orderBy("createdAt", "desc"), startAfter(cursor), limit(pageSize))
        : query(activityCollection, orderBy("createdAt", "desc"), limit(pageSize))
    const snapshot = await getDocs(activityQuery)
    const logs = snapshot.docs.map((activityDoc)=>({
        id:activityDoc.id,
        ...activityDoc.data()
    })) as ActivityLog[]

    return {
        logs,
        lastDoc:snapshot.docs[snapshot.docs.length - 1],
        hasMore:snapshot.docs.length === pageSize
    }
}


export {getUser, createUser,getDagenstall,addDataUser, deleteImages, uploadImage, setDagenstall, 
    getUsers, deleteUser, updateDataUser, createPaymentID, AddMessageUser, GetMessages,
    addActivityLog, getActivityLogsPage}
export type {ActivityLogCursor, SupportMessage}