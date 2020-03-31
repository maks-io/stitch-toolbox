import _ from "lodash";
import { message } from "antd";
import { initStitch } from "./init";
import {
  ALLOWED_NUMBER_OF_DELETION_TRIES,
  DATA_CHUNK_SIZE,
  DISAPPEARING_MESSAGE_DURATION
} from "../constants";

const getDocuments = async (collection1, options) => {
  console.log(
    `Getting documents from collection '${collection1.namespace}'...`
  );

  const fetchedDocuments = await collection1.find({}).toArray();
  console.log(`...done (fetched ${fetchedDocuments.length} documents)`);

  if (options.keepIds) {
    return fetchedDocuments;
  }

  return fetchedDocuments.map(({ _id, ...remainingAttrs }) => remainingAttrs);
};

const postDocuments = async (collection, documents) => {
  console.log(
    `\tPosting ${documents.length} documents to collection '${collection.namespace}'...`
  );

  const chunks = _.chunk(documents, DATA_CHUNK_SIZE);
  console.log(`\t\t(Split documents into ${chunks.length} chunks)`);

  for (let i = 0; i < chunks.length; ++i) {
    const currentChunk = chunks[i];
    console.log(`\t\tProcessing chunk ${i + 1}/${chunks.length}...`);

    await collection.insertMany(currentChunk);
    console.log(`\t\t...done`);
  }

  console.log(`\t...done (posted ${documents.length} documents)`);
};

const deleteAllDocuments = async (collection, options) => {
  console.log(
    `\tDeleting all documents from collection '${collection.namespace}'...`,
    collection
  );

  let numberOfDeletionTries = 0;

  let errorOccurred = true;
  while (
    errorOccurred &&
    numberOfDeletionTries < ALLOWED_NUMBER_OF_DELETION_TRIES
  ) {
    try {
      numberOfDeletionTries++;
      console.log(`\t\tDeletion try #${numberOfDeletionTries} start...`);

      errorOccurred = false;
      await collection.deleteMany({});

      console.log(
        `\t\t...deletion try #${numberOfDeletionTries} completed the deletion.`
      );
    } catch (error) {
      console.log(`\t\t...deletion try #${numberOfDeletionTries} failed.`);

      errorOccurred = true;
    }
  }

  if (numberOfDeletionTries >= ALLOWED_NUMBER_OF_DELETION_TRIES) {
    console.error(`\t...error - could not complete deletion, too many tries.`);
  } else {
    console.log(`\t...done (deleted all documents)`);
  }
};

const copyDocuments = async (collection1, collection2, options) => {
  const fetchedDocuments = await getDocuments(collection1, options);
  await postDocuments(collection2, fetchedDocuments);
};

const moveDocuments = async (collection1, collection2, options) => {
  await copyDocuments(collection1, collection2, options);
  await deleteAllDocuments(collection1, options);
};

export const doAction = async (
  actionName,
  stitchClientAppId,
  dataA,
  dataB,
  options = {}
) => {
  const { collectionA, collectionB } = await initStitch(
    stitchClientAppId,
    dataA.database,
    dataA.collection,
    dataB.database,
    dataB.collection
  );

  const selectedAction = {
    deleteAllDocuments: deleteAllDocuments,
    moveDocuments: moveDocuments,
    copyDocuments: copyDocuments,
    // swapDocuments: null TODO
  }[actionName];

  const namespaceA = collectionA.namespace;
  const namespaceB = collectionB ? collectionB.namespace : null;

  const startMessage = `[ACTION] '${actionName}' with '${namespaceA}' ${
    Boolean(namespaceB) ? `and '${namespaceB}'` : ""
  }- start...`;
  console.log(startMessage);
  message.info(startMessage, DISAPPEARING_MESSAGE_DURATION);

  try {
    await selectedAction(collectionA, collectionB, options);

    const successMessage = `[ACTION] '${actionName}' ...done!`;
    console.log(successMessage);
    message.success(successMessage, DISAPPEARING_MESSAGE_DURATION);
  } catch (error) {
    const errorMessage = `[ACTION] '${actionName}' ...some error occurred!`;
    console.error(errorMessage);
    message.error(errorMessage, DISAPPEARING_MESSAGE_DURATION);
  }
};
