const DB_NAME = "snapxact-offline";
const DB_VERSION = 1;
const STORE_NAME = "photoQueue";

export interface QueuedPhoto {
  id?: number;
  base64: string;
  mimeType: string;
  preview: string;
  buildingId: string;
  buildingName: string;
  roomId: string;
  roomName: string;
  timestamp: number;
  status: "queued" | "processing" | "failed";
  errorMessage?: string;
}

export const MAX_QUEUE_SIZE = 30;
export const WARN_QUEUE_SIZE = 25;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToQueue(
  photo: Omit<QueuedPhoto, "id" | "status" | "timestamp">
): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const entry: Omit<QueuedPhoto, "id"> = {
      ...photo,
      status: "queued",
      timestamp: Date.now(),
    };
    const request = store.add(entry);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getQueuedPhotos(): Promise<QueuedPhoto[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as QueuedPhoto[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getQueueCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function updatePhotoStatus(
  id: number,
  status: QueuedPhoto["status"],
  errorMessage?: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const photo = getReq.result as QueuedPhoto | undefined;
      if (!photo) {
        resolve();
        return;
      }
      photo.status = status;
      if (errorMessage !== undefined) photo.errorMessage = errorMessage;
      store.put(photo);
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function removeFromQueue(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function clearProcessed(): Promise<void> {
  // Remove all photos that were successfully processed (not in queue anymore)
  // This is called externally after successful processing removes items
}

export async function clearAll(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getFailedPhotos(): Promise<QueuedPhoto[]> {
  const photos = await getQueuedPhotos();
  return photos.filter((p) => p.status === "failed");
}

export async function resetFailedToQueued(): Promise<void> {
  const failed = await getFailedPhotos();
  for (const photo of failed) {
    if (photo.id !== undefined) {
      await updatePhotoStatus(photo.id, "queued", undefined);
    }
  }
}
