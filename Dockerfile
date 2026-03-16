# Node image
FROM node:18

# Create app directory 
WORKDIR /app

# Copy package files 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Expose API port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]