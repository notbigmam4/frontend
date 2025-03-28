
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import {db, imgdb} from './firebaseConfig'
import { getStorage, ref, deleteObject, listAll, uploadBytes, getDownloadURL } from "firebase/storage";
import { ChangeEvent } from "react";
import { nanoid } from 'nanoid';
import { UserType } from "../types/User";
import { generateRandomId16 } from "../utils";
async function deleteImages(folder:string) {

    const storage = getStorage();
    // Create a reference under which you want to list
    const listRef = ref(storage, folder);

    // Find all the prefixes and items.
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            deleteObject(itemRef).then(() => {
                    console.log('success')
                }).catch((error) => {
                console.error(error)
                });
        });
    }).catch((error) => {
        console.error(error)
    });

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
async function createUser (slug:string,inp:string) {
    function generateRandomCode() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    const randomCode = generateRandomCode();

    const userref = collection(db, "Users");

    await setDoc(doc(userref, randomCode.toString()), {
        slug,
        plug:inp,
        status:'pending',
        id:randomCode.toString()
    });
    return randomCode.toString()
    
}
async function addDataUser (id:string,img:string,name:string,birthday:string) {
    

    const userref = collection(db, "Users");
    const prevdataraw = await getUser(id)
    const prevdata = prevdataraw?.data
    try {
        await updateDoc(doc(userref, id), {
            ...prevdata,
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
    const prevdataraw = await getUser(id)
    const prevdata = prevdataraw?.data
    const newname = name?name:prevdata?.name
    const newbirthday = birthday?birthday:prevdata?.birthday
    try {
        await updateDoc(doc(userref, id), {
            ...prevdata,
            name:newname,
            birthday:newbirthday
        });
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

async function createPaymentID (email:string):Promise<{ data: any; error: number|false; }> {
    const usersref = doc(db, 'paymentIDs',email.toString())
    try {
        const initid = await getDoc(usersref)

        if (initid.data()) {
            return {data:initid.data(),error:false}
        } 
        const newid = generateRandomId16()

        try {
            await setDoc(usersref,{
                paymentId:newid
            })
            return {data:{paymentId:newid},error:false}

        } catch (error) {
            return {error:2,data:false}
        }


    } catch (error) {
        console.log(error)
        return {error:1,data:false}
    }
    

    
}
async function AddMessageUser (email:string | undefined,msg:string | undefined) {
    

    const userref = collection(db, "Messages");
    const docref = doc(userref,email)
    const prevmsgs = await getDoc(docref)
    console.log(prevmsgs?.data())
    const id = nanoid()
    if (prevmsgs?.data()) {
        console.log(JSON.stringify({[id]:msg}))
        await setDoc(doc(userref, email), {
            ...prevmsgs.data(),
            [id]:msg
        });
    } else {
        await setDoc(docref, {
            email,
            [id]:msg
        });
    }
    
        
    
}

async function GetMessages () {
    

    const userref = collection(db, "Messages");
    
    
    const messagesraw = await getDocs(userref)
    const messages = messagesraw.docs as unknown
    return messages as {data:Function}[]
    
    
}


export {getUser, createUser,getDagenstall,addDataUser, deleteImages, uploadImage, setDagenstall, 
    getUsers, deleteUser, updateDataUser, createPaymentID, AddMessageUser, GetMessages}