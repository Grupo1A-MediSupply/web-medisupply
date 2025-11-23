#!/bin/bash

# MediSupply Deployment Script
# This script helps with local deployment and testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "Node.js/npm is not installed. Please install it first."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Build the application
build_app() {
    print_status "Building Angular application..."
    npm ci
    npm run build
    print_success "Application built successfully!"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    print_status "Deploying infrastructure with Terraform..."
    
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan the deployment
    terraform plan -var="environment=local" -out=tfplan
    
    # Apply the plan
    terraform apply tfplan
    
    cd ..
    print_success "Infrastructure deployed successfully!"
}

# Deploy application to S3
deploy_app() {
    print_status "Deploying application to S3..."
    
    # Get S3 bucket name from Terraform output
    BUCKET_NAME=$(cd terraform && terraform output -raw s3_bucket_name)
    
    # Sync files to S3
    aws s3 sync dist/ s3://$BUCKET_NAME --delete
    
    print_success "Application deployed to S3!"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    print_status "Invalidating CloudFront cache..."
    
    # Get CloudFront distribution ID from Terraform output
    DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)
    
    # Create invalidation
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    
    print_success "CloudFront cache invalidated!"
}

# Show deployment information
show_info() {
    print_status "Deployment Information:"
    
    cd terraform
    
    echo "S3 Bucket: $(terraform output -raw s3_bucket_name)"
    echo "CloudFront URL: https://$(terraform output -raw cloudfront_domain_name)"
    echo "S3 Website URL: http://$(terraform output -raw s3_bucket_website_endpoint)"
    
    cd ..
}

# Main deployment function
main() {
    print_status "Starting MediSupply deployment..."
    
    check_requirements
    build_app
    deploy_infrastructure
    deploy_app
    invalidate_cloudfront
    show_info
    
    print_success "Deployment completed successfully! 🚀"
}

# Run main function
main "$@"
