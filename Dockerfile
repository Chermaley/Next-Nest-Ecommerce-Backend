
# ! Important
# Since we rely in our code to environment variables for e.g. db connection
# this can only be run successfully with docker-compose file

# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:14.17.0 AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /oneLab/src/app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm install --force

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
ENV NODE_OPTIONS=--max_old_space_size=1024

RUN npm run build


################
## PRODUCTION ##
################
# Build another image named production
FROM node:14 AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /oneLab/src/app

# Copy all from development stage
COPY --from=development /oneLab/src/app/ .

EXPOSE 8080

RUN mkdir -p /oneLab/src/app/dist/static

# Run app
CMD [ "node", "dist/main" ]

# Example Commands to build and run the dockerfile
# docker build -t thomas-nest .
# docker run thomas-nest
