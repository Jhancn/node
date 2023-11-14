const AWS = require('aws-sdk');
const express = require('express');

// Configure AWS SDK with access keys
AWS.config.update({
  accessKeyId: 'AKIAVNDXJWTJXVYXTQOY',
  secretAccessKey: '+SPVKHm02PGVXvMk9BHchRiAdR+W1vyXLCOBWXl4',
  region: 'us-east-1' // Replace with your AWS region
});

// Create an S3 instance
const s3 = new AWS.S3();

const app = express();

app.get('/', (req,res) => {
    res.send("Welcome to CG");
});
// Define an endpoint to get pre-signed URLs for all objects in the bucket
app.get('/get-all-objects', (req, res) => {
  const bucketName = 'cg2.0'; // Replace with your bucket name

  const params = {
    Bucket: bucketName,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error("Error listing objects:", err);
      res.status(500).send("Error fetching objects");
    } else {
      const objectURLs = data.Contents.map((object) => {
        const objectParams = {
          Bucket: bucketName,
          Key: object.Key,
          Expires: 3600 // URL expiration time in seconds (e.g., 1 hour)
        };
        return {
          objectKey: object.Key,
          url: s3.getSignedUrl('getObject', objectParams)
        };
      });
      res.json(objectURLs);
    }
  });
});

const port = process.env.port ||3000;
app.listen(port, ()=>{
    console.log('listening');
});
