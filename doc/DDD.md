# DDD

## Bounded context
- auth
- backoffice
- patients
- professionals

## Domains, subdomains and modules
|--onboarding
|--auth (domain)
|  |--users (subdomain)
|--patients 
|  |--patient plans
|  |  |--meals (module)
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
|--nutrition
|  |--food (external provider)
|  |--formulas
|  |--internal questionaries
|--communication
|  |--mail

