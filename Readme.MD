# Simple E-Commerce Application README

## Overview
Welcome to our Simple E-Commerce Application! This application allows users to register, login, buy items, and add items to the shop. It consists of two backend services: one handles the database operations, and the other manages the payment process with blockchain integration.

To facilitate easy deployment, our application is containerized using Docker. Follow the instructions below to launch the application on your local machine.

## Prerequisites
Before getting started, ensure you have the following dependencies installed on your system:
- Docker
- Docker Compose

## Installation and Setup
1. Clone the project repository to your local machine:
    ```
    git clone <repository_url>
    ```

2. Navigate to the project directory:
    ```
    cd <project_directory>
    ```

3. Build and start the Docker containers using Docker Compose:
    ```
    docker-compose up --build
    ```

4. Once the containers are up and running, you can access the application at:
    ```
    http://localhost:80
    ```

## Usage
### Registration
- To register a new account, click on the "Register" link and provide the required information.

### Login
- After registration, you can log in with your credentials using the "Login" page.

### Shopping
- Browse through the available items in the shop.
- Click on an item to view its details and add it to your cart.
- Proceed to checkout when you're ready to make a purchase.

### Adding Items to the Shop
- If you have admin privileges, you can add new items to the shop.
- Access the admin panel and navigate to the "Add Item" section to add items.

### Payment Process with Blockchain
- When checking out, the payment process is seamlessly integrated with blockchain technology.
- Your transactions are secure and transparent thanks to blockchain's decentralized ledger.

## Troubleshooting
- If you encounter any issues during installation or setup, please refer to the troubleshooting section in our documentation or reach out to our support team for assistance.

## Feedback and Support
We welcome your feedback and suggestions for improving our application. If you have any questions or need support, please don't hesitate to contact us at [support@example.com](mailto:support@example.com).

Thank you for using our Simple E-Commerce Application!

*Note: Replace `<repository_url>` and `<project_directory>` with the appropriate values specific to your project.*
