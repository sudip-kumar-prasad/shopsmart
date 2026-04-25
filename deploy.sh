#!/bin/bash

# Configuration
REGION="us-east-1"
REPO_NAME="shopsmart-app"

# 1. Initialize Terraform
echo "Initializing Terraform..."
cd terraform
terraform init

# 2. Get Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ $? -ne 0 ]; then
    echo "Error: Failed to get AWS account ID. Is AWS CLI configured?"
    exit 1
fi

ECR_URL="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# 3. Create ECR Repo if it doesn't exist (via Terraform)
echo "Creating ECR repository..."
terraform apply -target=aws_ecr_repository.app -auto-approve

# 4. Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_URL}

# 5. Build and Push Docker Image
echo "Building and pushing Docker image..."
cd ..
docker build -t ${REPO_NAME} .
docker tag ${REPO_NAME}:latest ${ECR_URL}/${REPO_NAME}:latest
docker push ${ECR_URL}/${REPO_NAME}:latest

# 6. Apply remaining infrastructure
echo "Applying full infrastructure..."
cd terraform
terraform apply -auto-approve

# 7. Get Output
ALB_DNS=$(terraform output -raw alb_dns_name)
echo "------------------------------------------------"
echo "Deployment Complete!"
echo "Access your app at: http://${ALB_DNS}"
echo "------------------------------------------------"
