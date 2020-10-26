# Cloudproject1- Virtualbucket
#### University Name: http://www.sjsu.edu/
#### Course: Cloud Technologies 
#### Pofessor:Sanjay Garje
#### ISA:Indrayani Bhalerao
#### Student: Pranjali kotgire
#### Application Url:www.cloudprojectsolutions.net 
#### Demo:https://www.youtube.com/watch?v=PtbpeejDFJ4&feature=youtu.be

## AWS services that I used in this project:
virtual Bucket application is a simple cloud-based web application which would be used for uploading, deleting and downloading the files on the cloud platform. This application leverages different cloud services including Route53, EC2, Cloud Watch, RDS, CloudFront, S3, SNS, load balancing and auto scaling.
## Pre-requisites to run this application:
#### 1.Create AWS account
#### 2.Create S3 bucket to store files uploaded by users.
#### 3.create IAM user with security policy.
#### 4.create MYsql RDS instance and update application.
## Instructions to run project:
#### 1.softwares:Node.js,MySql workbench
#### 2.Clone the code from git
#### 3.Run npm install e NodeJS project to install all the dependencies.
#### 4.Create the .env file with AWS access key and secret in NodeJS project
#### 5.Run the NodeJS API using DEBUG=myapp:* npm start command.

## Architecture Diagram:
![](https://github.com/kotgirep/cloudproject1/blob/main/clouddiagram.png?raw=true "Title")

## Project Screenshots:
#### 1. LogIn page:
![]()
#### 2. Register Page:
![]()
#### 3. User Page:
![]()
#### 4. Admin Page:
![]()



EC2: I have deployed my application on EC2 instance.

AutoScaling Group: Configure the auto scaling policy to make the system highly-available and application that can scale to configured max instances with a desired instance . 2. You can change these configs anytime in the autoscaling policy based on the Params like CPU Util, network in out, data rates etc.

Classic Load Balancer: Load balancer transfer request in the round robin fashion to multiple EC2 instances spawned under the target groups.

S3: This will be used to store and manage the files uploaded by user. The storage of this bucket will be Standard S3.

S3 - Standard Infrequent Access: S3 allows to specify the lifecycle rules for given s3 bucket, I have configured it max duration for given objects in bucket to stay in this storage class for 75 days.

Transfer Acceleration for S3 Bucket: This allows fast and secure file transfer between client and s3 bucket.Due to this service file transfer would become easy.
AWS Glacier for S3 bucket: Glacier is a storage class in S3. I have set an lifecycle rule so that file will move to Glacier after 365 days.

RDS: I have created a RDS instance and used Mysql as a database engine.RDS multi-AZ deployment offers better availability and durability of RDS instance.

CloudFront: I have created ClouFront distribution for sake of sercurely delivering data and it pits content near to user. Here, I set TTL to minimum 30 sec which will reload the cache.

Route 53: It is DNS  which is used to resolve the IP address of the application domain.I have choose simple routing policy.

CloudWatch: This will be used to create monitoring for the auto scaling, ec2, the CPU utilization of ec2 instances will reach at high or low threshold and sends the notification via SNS.

Lambda: on any update,delete and upload this will invoke lambda function and this lambda function will invoke SNS to send text messages regarding any action in S3 bucket.
SNS: It is the Simple Notification Service for AWS resources which sends text messages to the user for events when user upload and delete object from S3 bucket.
