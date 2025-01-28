/*
  todo:
    - add rules to create week plans, verify the amount of days in week

    - endpoint to update isTrialPeriod
    - update basic information of patient (professional and patient views)
    - update some information of patient (from professional view)

    - fix creaateAt and updatedAt, it is not creating in sub documents of programs
    - implement equivalent ingredients

    - ValidateIf is not working (EquivalentInputs InputType)

    - check application layer if foods module, check right implementation for hexagonal architecture

    - endpoint to relationate patients with programs (plans) 

    - photos and files of patients
    - customize error by rate limit

*/

/* 
  TODO: 
  - consider if I need account domain
  - questionary
    - questionary configuracion: enabled disabled
    - allow to create own fields
    - send questionary to patient

    - Information -> Patient
      - questionaryGroups: [
        {
          - title
          - description
          - questionaryDetails: [
              { (fieldNames)
                - id
                - associatedInformation
                - associatedQuestion
                - answwer:string || string[]
                - fieldType: string
                - fieldOptions?: string[]
                - professionalNotes
              }
          ]
        }
      ]

    apis: 
      - getInformtationPatient
      - updateInformationDetail

    internal
      - at moment to create a patient, create a patient information (quesetionary)

    - questionaryConfiguration
      - id
      - questionaryGroups: [
        {
          - id
          - title 
          - description
          - questionaryDetails: [
              { (fieldNames)
                - id
                - fieldName
                - associatedQuestion
                - enabled: boolean
                - fieldType: string
                - fieldOptions?: string[]
              }
          ]
        }
      ]

    apis:
      - getQuestionaryGroup: questionaryGroup,
      - enableQuestion  
      - createQuestionaryGroup: questionaryGroup, (questions, enabled, associatedInformation)[]
      - updateQuestionaryGroup: questionaryGroup, (questions, enabled, associatedInformation)[]
      - add questionaryDetails (customs questions)

    internal
      - at moment to create a professional, create a questionary configuration
      - common table for questionary configuration
*/

/* 
  TODO (infraestructure):
    - migrate from railway to aws?,  beacuse don't have static ip
    
    - research how many amount of memory and cpu need the athvio-nutrition-backend app
    - check cost of loadbalancer 
    - check cost of cloudwatch
    - learn about load balancer
    - check parametrized queries to void NoSQL injection
    - configure pre commit , using linters
*/
