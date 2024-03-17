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
- To register a new account, click on the "Register" button and provide the required information.

### Login
- After registration, you are automatically logged in. If you already have an account, you can log in with your credentials using the "Login" page.

### Shopping
- One connected, you will see your blockchain address and your balance
- All available items are displayed on the home page
- Click on buy to buy an item

### Adding Items to the Shop
- you can add new items by entering his name, price and image URL

### Payment Process with Blockchain
- When checking out, the payment process is seamlessly integrated with blockchain technology.
- Your transactions are secure and transparent thanks to blockchain's decentralized ledger.
