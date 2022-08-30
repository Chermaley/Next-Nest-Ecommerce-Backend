
# Base image
FROM node:16.0.0

# Create app directory
WORKDIR /oneLab/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

RUN mkdir -p /oneLab/src/app/dist/static
RUN mkdir -p /oneLab/src/app/migrations

ENV NODE_ENV=production

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
