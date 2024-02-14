# Stock Data Management System

## Overview

The Stock Data Management System is a full-stack application designed to provide users with up-to-date insights into their stock portfolio. It combines a robust Spring Boot backend with a dynamic React frontend, secured PostgreSQL database, and full AWS integration for deployment and service management. This system allows users to track their investments by entering the positions they hold, fetching the latest stock prices, and calculating the profit or loss on their portfolio in real time.

## Features

- **RESTful API Backend**: Developed with Spring Boot, offering efficient handling of stock data through RESTful services.
- **Dynamic React Frontend**: Provides a user-friendly interface for interactive engagement with stock data and portfolio management.
- **Secure PostgreSQL Database**: Ensures reliable storage and management of user data, including portfolio positions.
- **AWS Integration**: Utilizes Elastic Beanstalk for backend deployment, RDS for database management, and S3 with CloudFront for serving frontend assets efficiently.
- **Real-time Portfolio Tracking**: Users can enter their stock positions, and the system automatically fetches the latest prices to calculate and display the profit or loss.

## Technologies Used

- Backend: Spring Boot
- Frontend: React
- Database: PostgreSQL
- Cloud Deployment: AWS (Elastic Beanstalk, RDS, S3, CloudFront)

## Getting Started

### Prerequisites

- Java Development Kit (JDK) for backend development
- Node.js and npm for frontend development
- PostgreSQL for the database
- AWS account for deployment and service management

### Setup Instructions

#### Backend

1. Install JDK and set up `JAVA_HOME`.
2. Clone the repository and navigate to the backend directory.
3. Use Maven to install dependencies and run the application:


#### Frontend

1. Ensure Node.js and npm are installed.
2. Navigate to the frontend directory and install dependencies:
3. Start the application

#### Database

1. Install PostgreSQL and create a database for the project.
2. Configure `application.properties` in the backend for database connectivity.

#### AWS Configuration

- Follow AWS documentation for setting up Elastic Beanstalk, RDS, S3, and CloudFront.

## Usage

To track and manage your stock portfolio:

1. Log into the system through the frontend interface.
2. Enter the stock positions you own in the designated form.
3. The system will fetch the latest stock prices and calculate your portfolio's profit or loss, displaying the results in real time.

## Deployment

Refer to AWS documentation for detailed instructions on deploying the services used (Elastic Beanstalk, RDS, S3, CloudFront).

## Contributing

Contributions are welcome! Please open an issue to discuss your ideas before submitting a pull request.
