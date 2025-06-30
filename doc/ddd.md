# DDD
## Bounded context
- patients
- professionals
- backoffice
- auth

## Domains, subdomains and modules
|--auth (domain)
|  |--users (subdomain)
|  |  |--onboarding (module)
|--patients 
|  |--patient plans
|  |  |--meals
|  |  |--workouts
|  |  |--healthy habits
|  |--notes
|  |--chats
|  |--calories
|  |--patient-questionaries
|--professionals
|  |--nutritional meals
|  |--patient groups
|  |--program tags
|  |--programs
|  |--professional-questionaries
|--backoffice (internal tools)
|  |--nutritional meals
|  |  |--nutritional meal providers
|  |  |--internal nutritional meal
|  |  |--internal questionaries

