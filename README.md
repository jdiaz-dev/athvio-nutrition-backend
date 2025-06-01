## Description

Backend monolith service to allow to medical professionals create and manage nutritional plans of their patients.
This backend app was designed to support interactions from medical doctor, naturopaths, nutritionists, coaches fitness also. 

## Modules
- The current developed modules are the next:
1. professionals
2. meals (allow create and manage meals of professionals)
3. foods (integration with third app to allow hydrate app with nutritional information of foods)
4. program-tags (allow to tag programs)
5. programs (allow create and manage healing programs of medical professional)
6. patient-groups (allow to group patients. Example: patient with cancer, alzheimer, fat weight, etc)
7. patients (allow to create and manage patients)
8. patient-plans (allow to assign and manage healing plans of patients)
9. notes (allow to save clinical notes of meical professionals)
10. chats (allow interaction between medicarl professionals and patients)
11. patient-questionaries (designed to allow to patient awnser questionaries)
12. professional-questionaries (designed to allow to medical professionals customize their questionaries)

## Future modules
- The future modules will be:
1. program generator (it was thought to create healing programs using IA)

## Tech stack
- Nest.js
- Mongodb
- Neo4j (for program generator module)
- Docker
- AWS (ECS fargate, SES, S3)

## Installation

- install nvm: https://github.com/nvm-sh/nvm
- install docker compose: https://docs.docker.com/compose/install/linux/

```bash
# use properly node.js version
$ nvm use
```

```bash
# install dependencies
$ npm install
```

## Running the app

```bash
# run docker compose
$ docker compose up

```bash
# development -watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
