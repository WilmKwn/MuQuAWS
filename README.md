## MuQu: Source+ Queue & Sync

An application used to be able to queue videos or songs and sync it across users in separate "rooms"

* Login / Sign Up
* Create rooms (password or no-password)
* Enter rooms
* Queue videos (YouTube, Twitch, custom files)

## Project Screen Shot(s)

<img src="https://github.com/user-attachments/assets/f6f37a79-1cf4-4ea2-bda8-04777825b2da" width="300" height="auto">
<img src="https://github.com/user-attachments/assets/685f0687-83e4-4f4b-8007-cd8676b1dd77" width="300" height="auto">
<img src="https://github.com/user-attachments/assets/ef30df88-3324-46af-b782-f63fc91f50e3" width="600" height="auto">

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
1. go into `/backend/lambda`
2. run `function_zip.ps1`
3. go back to `/backend`
4. run `terraform apply`

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

Run the deploy steps 1-4 again
