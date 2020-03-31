import {
  AnonymousCredential,
  RemoteMongoClient,
  Stitch
} from "mongodb-stitch-browser-sdk";

let currentClient = undefined;
let currentClientAppId = undefined;

const initStitchAndGetServiceClient = async clientAppId => {
  if (!currentClientAppId || clientAppId !== currentClientAppId) {
    if (!currentClientAppId) {
      console.log(
        `No Stitch client available -> initializing with '${clientAppId}'`
      );
    } else {
      console.log(
        `Stitch client changed from '${currentClientAppId}' to '${clientAppId}' -> re-initializing with '${clientAppId}'`
      );
    }

    currentClientAppId = clientAppId;
    currentClient = Stitch.initializeDefaultAppClient(clientAppId);
    await currentClient.auth.loginWithCredential(new AnonymousCredential());
  }

  return currentClient.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
  );
};

export const initStitch = async (
  clientAppId,
  databaseA,
  collectionA,
  databaseB,
  collectionB
) => {
  const serviceClient = await initStitchAndGetServiceClient(clientAppId);

  const dbA = serviceClient.db(databaseA);
  const collA = dbA.collection(collectionA);

  const ret = { databaseA: dbA, collectionA: collA };

  if (databaseB && collectionB) {
    const dbB = serviceClient.db(databaseB);
    const collB = dbB.collection(collectionB);
    ret.databaseB = dbB;
    ret.collectionB = collB;
  }

  return ret;
};
