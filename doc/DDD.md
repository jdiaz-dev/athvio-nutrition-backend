# DDD

## Bounded context
- auth
- backoffice
- patients
- professionals
- mail

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
|  |  |--food (external provider)
|  |  |--internal questionaries
|--mail

