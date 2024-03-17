# Use the official Node.js 14 image
FROM node:14

# Set the working directory in the container
WORKDIR /app
COPY ./backend-shop /app

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
