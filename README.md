# Blogify-Server by Rowin

<img src="https://miro.medium.com/max/700/1*pD7ShcZ7YHIMXe2mgiFzbg.png">

_See the client code at: [rowin-blogs-client](https://github.com/rowin1125/rowin-blogs-client)_

## Building bloks

The Blogify server is build with the following stack:

- Node JS
- Apollo Server
- Mongoose
- GraphQL

## How to use

### Visit the application

You can find the applications on the following urls:

- **Client** [Blogify-client](https://rowin-blogify.vercel.app/)
- **Server** [Blogify-server](https://rowin-blogify.herokuapp.com/) (only available with graphQL queries)

You can use `Postman` to send a Post request to the server url with a grapqhl body like:

```graphql
{
  getPosts {
    id
    createdAt
    username
  }
}
```

### Instal locally

This projects is react / node based. To be able to work within this project, at least node 10 is required. When you don't have Node, follow this guide => [install](https://changelog.com/posts/install-node-js-with-homebrew-on-os-x). This project also uses yarn. If you haven't installed yarn yet, follow [this](https://github.com/rowin1125/derow.git) guide.

- ### First clone the two projects:

```bash
git clone https://github.com/rowin1125/rowin-blogs-client.git && git https://github.com/rowin1125/rowin-blogs-server.git
```

- ### cd into both projects and install dependencies:

```bash
yarn install
```

- ### For the client, create an .env file with

```
REACT_APP_API_URI=http://localhost:5000/
```

- ### Server only

> Go to [mongodb](https://www.mongodb.com/)

> Create an account

> Create a cluster

> GO to `security` > `add new databse user` and add one

> Go back to the cluser and go to `connect` > `Connect your application`

> Copy the link and continue

- ### For the server, create an .env file with

```
MONGODB=<URL FROM PREVIOUS STEP AND CHANGE `PASSWORD` AND `DBNAME`>
JWT_KEY=<JUST A KEY YOU WANT TO USE TO SECURE JWT>
```

- Start both applications

```BASH
yarn dev
```
