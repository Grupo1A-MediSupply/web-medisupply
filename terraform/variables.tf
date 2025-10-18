# Variables for MediSupply Terraform configuration

variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "medisupply.com"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "medisupply"
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "MediSupply"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}
