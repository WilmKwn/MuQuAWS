## MuQu: Source+ Queue & Sync

An application used to be able to queue videos or songs and sync it across users in separate "rooms"

## Project Screen Shot(s)

[ PRETEND SCREEN SHOT IS HERE ]

[ PRETEND OTHER SCREEN SHOT IS HERE ]

## Installation and Setup Instructions

Clone down this repository. You will need `node`, `npm`, `aws cli`, and `terraform` installed on your machine.  

# Frontend
Installation:
`npm install`  

To Start Server:
`npm start`  

To Visit App:
`localhost:3000/`  

# Backend

Create an AWS account. Make sure to use AWS CLI to configure the credentials on your system.

go into `/backend`

Deploy backend:
`terraform apply`

Create a `Links.js` file in the ROOT DIRECTORY! (process.env is better but I opted to using a simple js file)
```
export const WEBSOCKET = '/* links websocket URL */';
export const WBSOCKET_PRIVATE = '/* rooms websocket URL */';

export const ENDPOINT = '/* REST api URL */';

export const s3_data = {
    S3_REGION: 'us-east-2', // your region
    S3_NAME: 'muqu_files',
    S3_ACCESS_KEY: '', // your access_key
    S3_SECRET_KEY: '' // your secret_key
};
```
In all the lambda files, make sure to replace all the hardcoded websocket urls with YOUR urls!
