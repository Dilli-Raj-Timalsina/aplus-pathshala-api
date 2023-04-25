const {
    ListBucketsCommand,
    CreateBucketCommand,
    DeleteBucketCommand,
    GetBucketLocationCommand,
    DeleteObjectCommand,
    ListObjectsCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3, params } = require("./credentialConfig");

//Bucket tasks starts over here
const inputCreate = {
    Bucket: "thistednewket--111",
    CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1",
    },
};
const inputDelete = {
    Bucket: "thisiscreatednewket--111",
};

const sendCommandExecutionRequestToAWS = async (command) => {
    const responce = await s3.send(command);
    return responce;
};

const createBucket = async (input) => {
    const command = new CreateBucketCommand(input);
    const responce = await sendCommandExecutionRequestToAWS(command);
    return responce;
};

const deleteBucket = async (input) => {
    const command = new DeleteBucketCommand(input);
    const responce = await sendCommandExecutionRequestToAWS(command);
    return responce;
};

const listBuckets = async () => {
    const input = {};
    const command = new ListBucketsCommand(input);
    const responce = await sendCommandExecutionRequestToAWS(command);
    console.log(responce);
};

const getBucketLocation = async () => {
    const input = {
        Bucket: "thisiscreatednewbucket--111",
    };
    const command = new GetBucketLocationCommand(input);
    const response = await sendCommandExecutionRequestToAWS(command);
    console.log(response);
};

////////////////////////Bucket Tasks Done/////////////////////
// getBucketLocation();
//////////////////////////Object Tasks Starts Here////////////////////////

const deleteObject = async () => {
    const input = {
        // DeleteObjectRequest
        Bucket: "thisiscreatednewbucket--111",
        Key: "keys.txt",
    };
    const command = new DeleteObjectCommand(input);
    await sendCommandExecutionRequestToAWS(command);
};

const listAllObject = async () => {
    const input = {
        Bucket: "thisiscreatednewbucket--111",
    };
    const command = new ListObjectsCommand(input);
    const responce = await sendCommandExecutionRequestToAWS(command);
    return responce;
};

const getObject = async () => {
    const input = {
        // GetObjectRequest
        Bucket: "thisiscreatednewbucket--111",
        Key: "textfile.txt",
    };
    const command = new GetObjectCommand(input);
    const responce = await sendCommandExecutionRequestToAWS(command);
    console.log(responce);
};

getObject();
