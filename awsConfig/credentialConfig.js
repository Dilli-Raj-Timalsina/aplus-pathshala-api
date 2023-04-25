const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config({ path: __dirname + "/../.env" });

//object defination:
const params = {
    Bucket: "mybucketforapluspathshala", // The name of the bucket.
    Key: "textfile.txt", // The name of the object.
    Body: "Hello world", // The content of the object.
};

//AWS Credentials:
const REGION = process.env.REGION;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

module.exports = { s3, params };
