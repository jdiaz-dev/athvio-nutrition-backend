For error management this app use the errors provided by default for Nest.js 

## Database
- InternalServerErrorException : when problem with database has 
  happened

## Bussiness exceptions
- NotFoundException : When a resource is not found
- BadRequestException : when the server is not aggre with the 
  request

## Example
Check create-patient-plan.service.ts

## Use of _id and uuid
_id: internal mongoId (use internal only)
uuid: external id (use external only)

