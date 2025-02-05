# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies for tsc, nodemon, and concurrently)
RUN npm install -g typescript
RUN npm install

# Copy the rest of the application code
COPY . .

# Set DATABASE_URL as a build argument
ARG DATABASE_URL

# Set DATABASE_URL as an environment variable
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client (assuming Prisma schema is in src/prisma/schema.prisma)
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Run Prisma migrations
# RUN npm run prisma-migrate-dev

# Build the TypeScript code and copy the emails folder
RUN npm run build

# Copy the emails folder from src to dist
RUN cp -r src/emails dist/emails

# Expose the port your app runs on
EXPOSE 3100

# Start the application using the start script
CMD ["npm", "start"]