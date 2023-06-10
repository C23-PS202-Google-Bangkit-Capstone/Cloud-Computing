# Cloud Computing

Welcome to the cloud computing repository. This repository contains the code dan deployment for the cloud computing capstone project. The project is written in Node.js using Express framework. The project is then deployed on the Google Cloud Platform and uses the Google Cloud Storage, MySQL, and Google Cloud Run services.

## Project Description

We will integrate all the three learning paths (Machine Learning, Cloud Computing, and Mobile Development) using Google Cloud Platform

### API Features:
- Authentication (Login & Register):  
  Implement user authentication functionality to allow users to register and log in to the application safely.
- Upload and download images:  
  Enable users to upload images to the application and download images from the system.
- Search bar:  
  Implement a search functionality that allows users to search for specific content or items within the application.
- Connect to MySQL:  
  Establish a connection to a MySQL database for storing and retrieving data as needed.
- More features coming soon!  
  Stay tuned for additional features that will be added to enhance the functionality and user experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#Contact) 
- [Acknowledgments](#Acknowledgments)

## Installation
### Run Locally

Clone the project
```bash
git clone https://github.com/C23-PS202-Google-Bangkit-Capstone/Cloud-Computing
```

Go to the project directory
```bash
cd Cloud-Computing
```

Install dependencies
```bash
npm install
```

Start the server
```bash
npm start
```

*Feel free to modify the code to suit your requirements and needs*

### Run on cloud (GCP)

Clone the project
```bash
git clone https://github.com/C23-PS202-Google-Bangkit-Capstone/Cloud-Computing
```

Go to the project directory
```bash
cd Cloud-Computing
```

Give execute permission
```bash
chmod +x ./run.sh
```
Run the script
```bash
./run.sh
```

*Feel free to modify the code to suit your requirements and needs*

## Usage

Once you successfully deployed it into Cloud Run in Google Cloud Platform. You need to test it via postman or any other tools.

#### Get Recipe Data

```http
  GET /api/getRecipeData
```

| Parameter (query) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `integer` | **Optional / default = 1**. Pagination purpose |

#### Get Additional Data / Intermezzo

```http
  GET /api/getAdditionalData
```

| Parameter (query) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fruit_id` | `integer` | **Required**. Specific item |

#### Get Recipe Infos Based on User's Location

```http
  GET /api/DisplayRecipe
```

| Parameter (query) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `integer` | **Optional / default = 1**. Pagination purpose |
| `location` | `string` | **Required**. Specific location |

#### Get Search Recipe (Search Bar)

```http
  GET /api/search
```

| Parameter (query) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `recipe_name` | `string` | **Required**. Search recipe's name |

#### Upload Image to GCS (Bucket)

```http
  POST /storage/upload
```

| Parameter (body) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image` | `image/png` | **Required**. Image file |

#### Register User

```http
  POST /api/register
```

| Parameter (body) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Must be 4 or more characters |
| `email` | `string` | **Required**. @gmail |
| `password` | `string` | **Required**. Must be 6 or more characters |
| `phone_number` | `string` | **Required**. Max 12 |
| `location` | `string` | **Required**. Province |

#### User Login

```http
  POST /api/login
```

| Parameter (body) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. @gmail |
| `password` | `string` | **Required**. Must be 6 or more characters |

## License

Apache License 2.0

## Contact

Frico Simon - [LinkedIn](https://www.linkedin.com/in/fricosimon/)  
Ignatius Joshua - [LinkedIn](https://www.linkedin.com/in/ignatius-joshua/)

## Acknowledgments

We would like to acknowledge the following resources that have been instrumental in the development of this project:

- [Deploy MySQL API to GCP](https://billmartin.io/blog/how-to-build-and-deploy-a-nodejs-api-on-google-cloud#connect-to-the-db-with-a-client) by Bill Martin: This article provided valuable insights on deploying a Node.js API on Google Cloud Platform and connecting to a MySQL database.
- [Upload File from Node.js](https://dev.to/kamalhossain/upload-file-to-google-cloud-storage-from-nodejs-server-5cdg) by Kamal Hossain: This article guided us through the process of uploading files from a Node.js server to Google Cloud Storage.
- And many more contributors who have provided valuable resources and support for this project.
We express our gratitude to these authors for their contributions and for sharing their knowledge and expertise.

