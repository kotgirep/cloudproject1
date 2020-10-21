# Cloudproject1- Virtualbucket
#### University Name: http://www.sjsu.edu/
#### course: Cloud Technologies 
#### Pofessor:Sanjay Garje
#### ISA:Indrayani Bhalerao
#### Student: Pranjali kotgire

## AWS services that I used in this project:
virtual Bucket application is a simple cloud-based web application which would be used for uploading, deleting and downloading the files on the cloud platform. This application leverages different cloud services including Route53, EC2, Cloud Watch, RDS, CloudFront, S3, SNS, load balancing and auto scaling.
## Pre-requisites to run this application:
1.Create AWS account
2.Create S3 bucket to store files uploaded by users.
3.create IAM user with security policy.
4.create MYsql RDS instance and update application.
## Instructions to run project:
softwares:Node.js,MySql workbench
Clone the code from git
Run npm install e NodeJS project to install all the dependencies.
Create the .env file with AWS access key and secret in NodeJS project
Run the NodeJS API using DEBUG=myapp:* npm start command.

EC2: 

AutoScaling Group: Configure the auto scaling policy to make the system highly-available and application that can scale to configured max instances with a desired instance of 1 and max instance of 2. You can change these configs anytime in the autoscaling policy based on the Params like CPU Util, network in out, data rates etc.

Classic Load Balancer: Load balancer transfer request in the round robin fashion to multiple EC2 instances spawned under the target groups.

S3: This will be used to store and manage the files uploaded by user. The storage of this bucket will be Standard S3.

S3 - Standard Infrequent Access: S3 allows to specify the lifecycle rules for given s3 bucket, I have configured it max duration for given objects in bucket to stay in this storage class for 75 days.

Transfer Acceleration for S3 Bucket: This allows the bucket for secure and accelerated transfer in terms of the data rates for files.

AWS Glacier for S3 bucket: Glacier storage class is the cold storage and I have configured the files to move here after 365 days.

DynamoDB: Create a DynamoDB instance for keeping track of the files uploaded by the user and their respective params like description, created and updated time etc.

CloudFront: Create a CloudFront (CDN), which will be configured for download of files and setup minimum TTL as 30 sec which will reload the cache.

Route 53: This is the Domain Name Server which is used to resolve the IP address of the application domain.

CloudWatch: This will be used to create monitoring for the auto scaling, ec2, dynamodb etc when the CPU utilization of ec2 instances will reach at high or low threshold and sends the notification via SNS.

Lambda: On any delete events in S3 bucket, it invoked the Lambda function created in nodeJS which will further invoke SNS topic to send notification via email.

SNS: It is the Simple Notification Service for AWS resources which sends email and text messages on the particular top gets the configured events.

Amazon Cognito: Create the userpool for users to sign up or sign in to the application using custom login/signup and social identity providers like google and facebook.
