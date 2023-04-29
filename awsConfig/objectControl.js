const s3 = require("./credential");
const {
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

//It returns a list of object from the provided input folder
const listAllObject = async (input) => {
    const command = new ListObjectsV2Command(input);
    const output = await s3.send(command);
    return output.Contents;
};

//It returns signed-url of provided folder object-key
const getObject = async (input) => {
    const command = new GetObjectCommand(input);
    return await getSignedUrl(s3, command, { expiresIn: 36000 });
};

//It inserts single file in provided input bucket's folder
const putObject = async (input) => {
    const command = new PutObjectCommand(input);
    return await s3.send(command);
};

//It inserts multiple file in provided input bucket's folder
const putObjects = async (inputs) => {
    return await Promise.all(
        inputs.map((input) => s3.send(new PutObjectCommand(input)))
    );
};

module.exports = {
    listAllObject,
    putObject,
    putObjects,
    getObject,
};
