import { doc, collection, getDoc, writeBatch } from 'firebase/firestore'
import db from '../../firebase'

export const saveFlushKardzToDatabase = async (user, handName, flushKardz) => {
  if (!handName.trim()) {
    throw new Error('Please enter a name for your flushKard set.')
  }

  try {
    const userDocRef = doc(collection(db, 'users'), user.id)
    const userDocSnap = await getDoc(userDocRef)

    const batch = writeBatch(db)
    const updatedHands = [...(userDocSnap.data()?.flushKardHands || []), { name: handName }]

    userDocSnap.exists()
      ? batch.update(userDocRef, { flushKardHands: updatedHands })
      : batch.set(userDocRef, { flushKardHands: [{ name: handName }] })

    const setDocRef = doc(collection(userDocRef, 'flushKardHands'), handName)
    batch.set(setDocRef, { flushKardz })

    await batch.commit()
  } catch (error) {
    console.error('Error saving flushKardz:', error)
    throw error
  }
}
