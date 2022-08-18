
# Base image
FROM node:14.17.0 AS development

# Create app directory
WORKDIR /oneLab/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --force

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

RUN mkdir -p /oneLab/src/app/dist/static

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]
