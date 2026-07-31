import { after, before, test } from 'node:test'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

const projectId = 'demo-secure-local'
const adminUid = 'mPC74atZr3YqMAbePMdVa3x1PE52'
let testEnv

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
    },
  })
})

after(async () => {
  await testEnv?.cleanup()
})

test('enforces anonymous capability and admin boundaries', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const seedDb = context.firestore()
    await setDoc(doc(seedDb, 'Users', '123456'), {
      id: '123456',
      slug: 'existing user',
      status: 'pending',
    })
    await setDoc(doc(seedDb, 'public', 'dagensdata'), {
      dagenstall: '7',
    })
  })

  const anonymous = testEnv.unauthenticatedContext()
  const otherUser = testEnv.authenticatedContext('not-the-admin')
  const admin = testEnv.authenticatedContext(adminUid)
  const anonymousDb = anonymous.firestore()
  const otherUserDb = otherUser.firestore()
  const adminDb = admin.firestore()

  await assertSucceeds(getDoc(doc(anonymousDb, 'Users', '123456')))
  await assertFails(getDoc(doc(anonymousDb, 'Users', 'not-a-code')))
  await assertFails(getDocs(collection(anonymousDb, 'Users')))
  await assertFails(getDocs(collection(otherUserDb, 'Users')))
  await assertSucceeds(getDocs(collection(adminDb, 'Users')))

  await assertFails(setDoc(doc(anonymousDb, 'Users', '654321'), {
    id: '654321',
    slug: 'attacker',
    status: 'pending',
  }))
  await assertSucceeds(setDoc(doc(adminDb, 'Users', '654321'), {
    id: '654321',
    slug: 'admin-created',
    status: 'pending',
  }))

  await assertSucceeds(updateDoc(doc(anonymousDb, 'Users', '123456'), {
    img: 'https://example.test/image',
    name: 'Test User',
    birthday: '010100',
  }))
  await assertFails(updateDoc(doc(anonymousDb, 'Users', '123456'), {
    status: 'active',
  }))

  await assertSucceeds(getDoc(doc(anonymousDb, 'public', 'dagensdata')))
  await assertFails(updateDoc(doc(anonymousDb, 'public', 'dagensdata'), {
    dagenstall: '9',
  }))
  await assertSucceeds(updateDoc(doc(adminDb, 'public', 'dagensdata'), {
    dagenstall: '9',
  }))

  await assertSucceeds(addDoc(collection(anonymousDb, 'Messages'), {
    email: 'person@example.com',
    message: 'Please help me',
    createdAt: serverTimestamp(),
  }))
  await assertFails(getDocs(collection(anonymousDb, 'Messages')))
  await assertSucceeds(getDocs(collection(adminDb, 'Messages')))

  await assertSucceeds(addDoc(collection(anonymousDb, 'activityLogs'), {
    eventType: 'app_open',
    clientTimestamp: new Date().toISOString(),
    sessionId: 'test-session',
    path: '/',
    url: 'https://example.test/',
    user: { id: '123456', name: 'Test User' },
    device: {
      userAgent: 'rules-test',
      platform: 'node',
      languages: ['en'],
      timezone: 'UTC',
      screen: '0x0',
      viewport: '0x0',
      pixelRatio: 1,
      colorDepth: 24,
      touchPoints: 0,
      online: true,
      cookiesEnabled: false,
    },
    createdAt: serverTimestamp(),
  }))
  await assertFails(getDocs(collection(anonymousDb, 'activityLogs')))
  await assertSucceeds(getDocs(collection(adminDb, 'activityLogs')))

  await assertFails(getDoc(doc(anonymousDb, 'unknown', 'document')))

  const anonymousStorage = testEnv.unauthenticatedContext().storage()
  const validImage = ref(anonymousStorage, '123456/profile.png')
  await assertSucceeds(uploadBytes(
    validImage,
    new Uint8Array([137, 80, 78, 71]),
    { contentType: 'image/png' },
  ))
  await assertFails(uploadBytes(
    ref(anonymousStorage, 'Imgs/unscoped.png'),
    new Uint8Array([137, 80, 78, 71]),
    { contentType: 'image/png' },
  ))

  assert.equal((await getDoc(doc(adminDb, 'Users', '123456'))).exists(), true)
})
