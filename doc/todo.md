## Learning
- learng about session and close methods in neoj4 driver
- learn profiler in node.js 
- learn close-with-grace to handle application shutdown events
- use nest-commander to create cli tools (with spanish foods can be good)
- learn about cookies and sessions with express.js
- deploy multiregion app/infraestructure
- implement kafka or rabbitmq to onboard new users 
- learn about event sourcing pattern, what is the relationship with CQRS
- implement multiregion infraestructure
- learn about how works internally one the event loop
- learn to create threads in C++
- learn about tail call optimization (tail call optimizations)
- implement some example of sessions

## TODO (infraestructure):
- migrate from railway to aws?,  beacuse don't have static ip
- research how many amount of memory and cpu need the athvio-nutrition-backend app
- check cost of loadbalancer 
- check cost of cloudwatch
- learn about load balancer
- check parametrized queries to void NoSQL injection    
- configure pre commit, using linters
- remove validations of entity user

## Fixes code 
- enhance message error in get questionary config (standarizate errors)
- stop to use profesional persistence service directly in various modules
- add plastics to diseaseCauses 
- add each to every IsArray decorator (different to IsUUID)
- stayed: refactor done in NutritionalPlanGeneratorService class 
- analyze startingDay in generateNutritionalPlanForPatient method
- add loggers to all persistence layers
- add detail error property to logger.error
- add input to receive amount of calories
- review Anticancer Vinaigrette	amounts
- fix: separate image that belongs to system and professional
- fix: remove garbage images from s3
- fix: add professional in documents that belongs to patient also
- refactor: add service layer in patient plans
- fix: remove food dto and use intead food from schema
- feat: create one endpoint to add specific food
- refactor: orchestrator must to manage the creation of questionary config nor questionary config
- fix: change from patient demo to paciente de prueba para español
- fix: manage english and spanish questionaries
- refactor: rename sytem to system questionary 
- fix: update mail message according to detectedLanguage
- fix: create other folder for store images from custom meals
- feat: delete previous image if update image (require big developement)
- fix: add logger verifiying all onboarding professional process
- test: test chat between web app and mobile app
- fix: check connection with mongodb
- fix: validate schema of loaded environment variables, not run if it is not loaded
- fix: change questionary by internal questionary in model of mongodb
- fix: move creating of uuid of patient-group, program-tags to one application class
- fix: validate user inside the token with professional send in body (void unwanted relationship between professionals and records from other domains that doesn't belong to it)
- fix: fix population of program tags in program schema
- fix: get data from neo4j sorted by alphabetic 
- fix: @Field(() => String) replace with proper a proper enum using registerEnumType when is one enum
- fix: inject OAUTH_GOOGLE_CLIENT_ID variable throught nestjs config
- fix: SECURITY - implement mechanism to avoid remove production insteal of local
- fix: change order for meals in one program plan
- feat: physic activity factor 
- fix: enable send email for wig up patient from web

## Database
- fix zanahorias search
- add chili
- fix: it is difficult to search judias verdes, limon
- fix: enhance this :
1. Neutraliza especies reactivas de oxígeno, previniendo daño oxidativo del ADN
2. Activa la vía Nrf2 (Factor nuclear relacionado con el eritroide 2) para aumentar enzimas antioxidantes
- fix: 
1. Activa la muerte celular por necroptosis
2. apoptosis
- fix: infusiones con adaptogenos no funciona (preferencias nutricionales)


## Videos