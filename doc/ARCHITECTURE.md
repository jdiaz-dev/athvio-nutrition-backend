# ATHVIO-NUTRITION-BACKEND - Architecture

This project follows a **Hexagonal Architecture** (also known as **Ports & Adapters** pattern), to ensure a clear separation of concerns:

- **Business logic** is isolated from frameworks, databases, and APIs
- **Adapters** handle input (web, mobile, API) and output (persistence, external services)
- **Application layer** contains the core use cases and business rules

This structure allows the project to be:

Below is the current folder structure and component responsibilities.

src/
├── core/
├── infrastructure/
├── modules/
│   ├── auth/
│   ├── mail/
│   ├── patients/
│   ├── professionals/
│   │   ├── nutritional-meals/
│   │   │   ├── adapters/
│   │   │   │   ├── in/
│   │   │   │   │   ├── mobile/
│   │   │   │   │   │   ├── dtos/
│   │   │   │   │   │   └── nutritional-meals-mobile.resolver.ts
│   │   │   │   │   ├── web/
│   │   │   │   │   │   ├── dtos/
│   │   │   │   │   │   ├── ingredients.resolver.ts
│   │   │   │   │   │   └── nutritional-meals-web.resolver.ts
│   │   │   │   ├── out/
│   │   │   │   │   ├── nutritional-meal.schema.ts
│   │   │   │   │   └── nutritional-meals-persistence.service.ts
│   │   │   ├── application/
│   │   │   │   ├── nutritional-meals-manager.service.ts
│   │   │   │   ├── upload-meal-image.service.ts
│   │   │   ├── helpers/
│   │   │   │   └── constants.ts
│   │   │   ├── nutritional-meal.types.d.ts
│   │   │   ├── nutritional-meals.module.ts
│   ├── patient-groups/
│   ├── program-tags/
│   ├── programs/
