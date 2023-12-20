# MongoDB FSI Payments Demo

This project is built to facilitate a MongoDB payments solution based on our MongoDB for Payments vision:


The Stack is :
- Node JS microservices server/s
- MongoDB Atlas/Enterprise
- Kafka streams
- AWS KMS

### Features Covered

**Cross Microservices** 
- Indexing and Scalability
- JSON Schema Validation
- Permission and Data Segregation
- Auditing 


**User & Account Microservices***:
- Document Model : Flexible user and account structure for different accounts and user profiles 
- Kafka Streaming Sink : Data being streamed from external sources
- Transactions (User to Account references) : Keeping account and user data ACID compliant
- In-Use Encryption


**Transactions & Payments Microservices**
- Change Streams: Payments are event driven by transactions
- Time Series for transaction history :Transaction history is built in a time series collection
- In-Use Encryption

**Notification Microservices**
- Kafka source : Notifications are being downstreamed to external systems and users via kafka
- Full text search : Notifications are searchable for analysts via full text search.

**Reports**
- Materialized Views : Materialized views are built to preprocess and clear sensitive data for reporting
- Charts


## Getting Started

- Setup Atlas Cluster 7.0+
    - Setup users:
    - user_management
    - account_management 
    - transaction_management
    - payment_management
- Setup KMS
- Setup Kafka Confluent

### Install

Clone the repo:
```
git clone https://github.com/mongodb-developer/FSIDemo-Payments.git
```

Install the repo:
```
npm install
```

Setup the .env file:
```
## Encrytion

SHARED_LIB_PATH="<FULL_PATH_TO_LIB>"

# AWS Credentials

AWS_ACCESS_KEY_ID="<Your AWS access key ID>"
AWS_SECRET_ACCESS_KEY="<Your AWS secret access key>"
AWS_KEY_REGION="<Your AWS key region>"
AWS_KEY_ARN="<Your AWS key ARN>"


# Microservices

USER_MANAGEMENT_USR=...
USER_MANAGEMENT_PWD=...

ACCOUNT_MANAGEMENT_USR=...
ACCOUNT_MANAGEMENT_PWD=...


TRANSACTION_MANAGEMENT_USR=...
TRANSACTION_MANAGEMENT_PWD=...


PAYMENT_MANAGEMENT_USR=...
PAYMENT_MANAGEMENT_PWD=...

```

Setup database configuration under `config/dev.js`:
```
module.exports = {
    dbCluster : '<YOUR_CLUSTER_HOST>',
    dbName : 'FSI'
}

```

### Start the application

Start the application
```
npm  start
```


### Test using postman:
 
Download the following postman project and run the sequence.

## Desclaimer

**This product is not a MongoDB official product. Use at your own risk!**
