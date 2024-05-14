import admin from "firebase-admin";

// Examples
export async function exampleRead(id: string): Promise<string> {
  const db = admin.database();
  const snapshot = await db.ref("databaseName").child(id).get();
  return snapshot.val().value;
}

export async function exampleUpdate(id: string, value: string): Promise<void> {
  const db = admin.database();
  await db.ref("databaseName").child(id).update({ value });
}

export async function exampleWrite(id: string, value: string): Promise<string> {
  const db = admin.database();
  const data = { id, value };
  await db.ref("databaseName").child(id).set(data);
  return value;
}
