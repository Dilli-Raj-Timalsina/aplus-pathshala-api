const s3 = require("./credential");
const {
    ListBucketsCommand,
    CreateBucketCommand,
    DeleteBucketCommand,
    GetBucketLocationCommand,
    HeadBucketCommand,
} = require("@aws-sdk/client-s3");

const {
    ListObjectsCommand,
    DeleteObjectsCommand,
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

const existBucket = async (input) => {
    const command = new HeadBucketCommand(input);
    return await s3.send(command);
};

const deleteAllBucketAtOnce = async (req, res, next) => {
    //first delete all objects inside the bucket:

    //then only bucket deletion tasks starts:
    const buckets = await listBuckets({});
    buckets.Buckets.forEach(async (bucket) => {
        //get an array of keys
        const command1 = new ListObjectsCommand({
            Bucket: bucket.Name,
        });
        // console.log("hi" + bucket.Name);
        const keysArray = await s3.send(command1);

        //extract all key and make array of inputs
        if (keysArray.Contents) {
            const inputs = keysArray.Contents.map((keyfile) => {
                return {
                    Key: keyfile.Key,
                };
            });
            // delete all keys based on array of inputs
            const params = {
                Bucket: bucket.Name,
                Delete: {
                    Objects: inputs,
                    Quiet: false,
                },
            };

            // deletion command executed
            const command2 = new DeleteObjectsCommand(params);
            await s3.send(command2);
        }
        const input = {
            Bucket: bucket.Name,
        };
        await deleteBucket(input);
    });
    res.status(204).json({
        status: "success",
        message: "successfully deleted",
    });
};
////////////////////////Bucket Tasks Done/////////////////////

module.exports = {
    createBucket,
    listBuckets,
    deleteBucket,
    getBucketLocation,
    existBucket,
    deleteAllBucketAtOnce,
};
