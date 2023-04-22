const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const  {Credentials}  = require("@aws-sdk/types");


const params = {
    Bucket: "mybucketforapluspathshala", // The name of the bucket. For example, 'sample-bucket-101'.
    Key: "textfile.txt", // The name of the object. For example, 'sample_upload.txt'.
    Body: "Hello world", // The content of the object. For example, 'Hello world!".
  };
  

  // Set the AWS Region.
const REGION = ""; //e.g. "us-east-1"
  const ACCESS_KEY_ID = "";
  const SECRET_ACCESS_KEY = "";
 
  
  const s3 = new S3Client({
      region: REGION,
      credentials: {accessKeyId:ACCESS_KEY_ID, secretAccessKey:SECRET_ACCESS_KEY}
  });



const run = async () => {
    // Create an Amazon S3 bucket.
    try {
        console.log("first");
        const command=new PutObjectCommand(params);
        console.log("second");
       const data=await s3.send(command);
       console.log("third");
      console.log(data);
      console.log("Successfully created a bucket called ");
    } catch (err) {
      console.log("Error", err);
    }
}
  run();