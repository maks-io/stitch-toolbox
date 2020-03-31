# Stitch Toolbox

This is a small helping tool I've built for [MongoDb Stitch](https://www.mongodb.com/cloud/stitch).

If you need to move, copy or delete data from/between collections via a very simple UI, you can use this.

## Usage

1. Setup your database(s) and collection(s) on [MongoDb Atlas](https://www.mongodb.com/cloud/atlas) accordingly. Don't forget to configure appropriate **permissions** and [collection rules](https://docs.mongodb.com/stitch/mongodb/#collection-rules).
2. Clone this repository and `cd` into the root folder.
3. Install dependencies of this [Stitch Toolbox](https://github.com/maks-io/stitch-toolbox) via `npm` or `yarn`.
4. Run it via `npm run start` / `yarn start`.
5. Access the app via your browser at `localhost:{PORT}`.
6. Enter appropriate values in the input fields. Don't forget the stitch client app id (more details [here](https://docs.mongodb.com/stitch/procedures/init-stitchclient/)).
   You can also pass these initial values via the query string, see section [Query Params](#query-params).
7. Action!

## Features

It currently allows you to easily **copy** or **move** data between two data collections (from same or different databases).
I had quite a lot of request failures happening when moving large amounts of data at once - that's why I decided to split the data into multiple chunks and move them sequentially. It may take a little longer - but it's more bulletproof, at least for my use case.
Maybe it is helpful for anyone else too.
You can change the chunk size via the `DATA_CHUNK_SIZE` constant in `src/constants/index.js`.

Furthermore this tool allows you to **delete** all data of a given collection.
It does not drop (!) a collection.
Instead, it deletes the individual documents - which is a rather slow process.
Again I kept getting api request failures, this is why I decided to include a continuation mechanism to keep deleting documents in a given collection, even when errors occur.
You can control how many times to continue the deletion process (to avoid endless loops), via the `ALLOWED_NUMBER_OF_DELETION_TRIES` constant in `src/constants/index.js`.

## Query Params

The app currently supports the following query parameters:

- `stitchClientAppId={YOUR_STITCH_CLIENT_APP_ID}`
- `databaseA={YOUR_DATABASE_A}`
- `collectionA={YOUR_COLLECTION_A}`
- `databaseB={YOUR_DATABASE_B}`
- `collectionB={YOUR_COLLECTION_B}`

You can pass them when accessing the web app in your browser.
This way you can bookmark the web app with appropriate initial values.

Example:

`http://localhost:{PORT}?stitchClientAppId={SOME_VALUE}&databaseA={SOME_VALUE}&collectionA={SOME_VALUE}&databaseB={SOME_VALUE}&collectionB={SOME_VALUE}`

## Disclaimer

I am not responsible for your data or how this tool transforms/manipulates any data.
It is supposed to help anyone who might need it - but be careful, it may delete/overwrite important data.
Also, this tool contains bugs - I haven't found any currently, but it does ;)

Use this tool at your own risk and always make sure you know what you are doing!

And in general: never lead a life without data backups.
