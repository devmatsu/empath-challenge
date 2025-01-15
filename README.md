# Empath - SST Node.js Serverless Application Challenge
This repository contains the solution to the **Empath SST Node.js Serverless Application Challenge**.  

The challenge involves building a serverless application using **Serverless Stack (SST)**, integrating AWS services like DynamoDB, and optionally extending functionality with RDS. 

## Contents
1. [Challenge](#challenge)
2. [Deliverables](#deliverables)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#steps-to-run-locally)
5. [API Endpoints](#api-endpoints)
6. [Deployment](#deployment)
7. [API Usage Examples](#api-usage-examples-deployed)


## Challenge
You can find the full challenge details [here](./CHALLENGE.md).

## Deliverables
  
* [A fully functional **Node.js-based** SST application, including DynamoDB integration](https://github.com/devmatsu/empath-challenge/milestone/1):
	* [Create `/random` Endpoint](https://github.com/devmatsu/empath-challenge/issues/2)
 	* [Integrate DynamoDB Logging](https://github.com/devmatsu/empath-challenge/issues/3)
	* [Create `/random/logs` Endpoint](https://github.com/devmatsu/empath-challenge/issues/4) 
* [Unit tests for Lambda functions using a Node.js testing framework.](https://github.com/devmatsu/empath-challenge/issues/6)
* [Documentation in the `README.md` file with setup, deployment, and endpoint details.](https://github.com/devmatsu/empath-challenge/issues/5)
* [Deploy the application to AWS, providing deployment details and API URLs.](https://github.com/devmatsu/empath-challenge/issues/8)
*  *(Bonus)* [Add `/data` route with AWS RDS integration for JSON storage.](https://github.com/devmatsu/empath-challenge/issues/7)

---

## Prerequisites
- **Node.js** (LTS version recommended)
- [AWS CLI](https://aws.amazon.com/cli/) and AWS account with sufficient permissions
- [SST CLI](https://sst.dev)

## Steps to run locally
1. Ensure AWS credentials are configured:
```bash
  aws configure
```

2. Clone the repository:
```bash
  git clone https://github.com/devmatsu/empath-challenge
  cd empath-challenge
```

3. Install dependencies:
```bash
  npm install
```

4. Start the SST development environment:
```bash
  sst dev
```

If everything is correct it should return something like this:
```bash
✓  Complete
  MyApi: https://ab1cde23fg.execute-api.sa-east-1.amazonaws.com
	---
  table: empath-challenge-stage-GeneratedNumbersTable
  url: https://ab1cde23fg.execute-api.sa-east-1.amazonaws.com
```

## API Endpoints
### 1. Generate Random Number  
Endpoint: GET `/random`  
Description: Generates and returns a random number. The number is also stored in DynamoDB with a timestamp.
Example request:
```
  curl -X GET http://<your-api-url>/random
```
Example response:
```json
  {
    "randomNumber": 1234
  }
```

### 2. Retrieve Last 5 Generated Numbers (Logs)
Endpoint: GET `/random/logs`  
Description: Retrieves the last 5 random numbers stored in DynamoDB.
Example request:
```
  curl -X GET http://<your-api-url>/random/logs
```
Example response:
```json
  [
	  {
	   	"timestamp": "2025-01-15T22:58:32.911Z",
	   	"randomNumber": 4353
	  },
	  {
	   	"timestamp": "2025-01-15T22:58:32.776Z",
	   	"randomNumber": 5332
	  }
  ]
```

## Deployment
### Deploy the stack:
```bash
  sst deploy --stage prod
```

## API Usage Examples (Deployed)
### 1. Generate Random Number
```bash
  curl -X GET https://api.devmatsu.com/random
```

### 2. Retrieve Last 5 Generated Numbers (Logs)
```bash
  curl -X GET https://api.devmatsu.com/random/logs
```
