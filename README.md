# igda-qr
> Project repository for a web-based QR-Code reader for event check-ins. The repository includes both backend and frontend for the web application, with the backend running on Node.js and utilizing the GraphQL API with MongoDB for the database of choice.  

## Table of Contents 
 * [Getting Started](#getting-started)  
  * [Prerequisites](#prerequisites)
  * [Installing](#installing)
 * [Build](#build)
 * [Features](#features)
 * [GraphQL](#graphql)  
 
 ## Getting Started  
 ### Prerequisites
 This web application was designed to run on mobile devices, and/or an electronic device with a camera or a webcam.
 - Node.js
 >https://nodejs.org/en/  
 - MongoDB
 >https://www.mongodb.com/download-center/community?jmp=docs  
 
 ### Installing  
 Clone the repository to your local machine.  
 `git clone https://github.com/geonhuiy/igda-qr.git`  
 Navigate to the project root directory on a CLI and run `npm i` to install the necessary Node.js packages.  
 In the project folder, create a file named `.env` which will contain the environment variables used in the project. The content      of the `.env` file is as follows:  
 `HTTP_PORT=port number here  
  HTTPS_PORT=port number here  
  DB_URL=url to MongoDB database here  `  
  
 
