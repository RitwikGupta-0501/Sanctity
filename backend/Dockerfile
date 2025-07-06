# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This allows Docker to cache the npm install step
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application (TypeScript to JavaScript)
# This step is important for production builds. For development, `npm run start:dev`
# handles recompilation, but this ensures a clean build if not using watch mode.
RUN npm run build

# Expose the port the NestJS app runs on
EXPOSE 3000

# Command to run the application
# For production, you would typically use `npm run start:prod`
# For development, we'll override this with `npm run start:dev` in docker-compose.yml
CMD ["npm", "run", "start"]
