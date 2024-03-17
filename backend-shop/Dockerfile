# Use the official Node.js 14 image
FROM node:14

# Set the working directory in the container
WORKDIR /app
COPY ./app /app

ENV PLATFORM_ADDRESS 0x0
ENV PLATFORM_PRIVATE_KEY 0x0

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["sh", "-c", "node app.js ${PLATFORM_ADDRESS} ${PLATFORM_PRIVATE_KEY}"]