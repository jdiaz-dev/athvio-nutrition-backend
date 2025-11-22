import { InputType } from '@nestjs/graphql';
import { GetLastPlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-last-planification.dto';

@InputType()
export class GetPlanificationsDto extends GetLastPlanificationDto {}
