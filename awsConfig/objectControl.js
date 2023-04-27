const s3 = require("./credentialConfig");
const {
    DeleteObjectCommand,
    ListObjectsCommand,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

//It is used to give user the access to read object for certain time via secure link:
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const deleteObject = async (input) => {
    const command = new DeleteObjectCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const listAllObject = async (input) => {
    const command = new ListObjectsCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const getObject = async (input) => {
    const command = new GetObjectCommand(input);
    const responce = await s3.send(command);
    return responce;

    //  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    //  console.log(url);
};

const putObject = async (input, file) => {
    const command = new PutObjectCommand(input);
    const responce = await s3.send(command);
    return responce;
};

const putObjects = async (input, files) => {
    const inputs = files.map((file) => {
        return {
            // Bucket: "thisiscreatednewbucket--111",
            // Key: `thisisimagebject${count}.jpg`,
            // Body: file.buffer,
            // ContentType: file.mimetype,
        };
    });

    return await Promise.all(
        inputs.map((input) => s3.send(new PutObjectCommand(input)))
    );
};

module.exports = { putObject, putObjects };
