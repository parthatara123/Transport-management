import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: "ap-south-1"
});


export const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { // this function will upload file to aws and return the link
        let s3 = new AWS.S3({apiVersion: "2006-03-01"}); // we will be using s3 service of aws

        const uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "LodingImages/" + file.originalname,
            Body: file.buffer
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({error: err});
            }
            console.log(" file uploaded successfully ");
            return resolve(data.Location);
        });
    });
};
