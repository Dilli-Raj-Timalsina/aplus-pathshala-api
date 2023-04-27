const s3 = require("./credentialConfig");
const {
    ListBucketsCommand,
    CreateBucketCommand,
    DeleteBucketCommand,
    GetBucketLocationCommand,
} = require("@aws-sdk/client-s3");

//All bucket related operations : CRUD operations,
//All the below Methods takes input parameter which defines the input format and sends request to s3
const createBucket = async (input) => {
    const command = new CreateBucketCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const deleteBucket = async (input) => {
    const command = new DeleteBucketCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const listBuckets = async (input) => {
    const command = new ListBucketsCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const getBucketLocation = async (input) => {
    const command = new GetBucketLocationCommand(input);
    const responce = await s3.send(command);
    return responce;
};

////////////////////////Bucket Tasks Done/////////////////////

module.exports = { createBucket, listBuckets, deleteBucket, getBucketLocation };
