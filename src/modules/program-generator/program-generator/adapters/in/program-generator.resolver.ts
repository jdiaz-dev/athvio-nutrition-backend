import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GenerateNutritionalPlanDto } from 'src/modules/program-generator/program-generator/adapters/in/dtos/generate-nutritional-plan.dto';
import { GeneratorManagerService } from 'src/modules/program-generator/program-generator/application/generator-manager.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';

@Resolver()
export class ProgramGeneratorResolver {
  constructor(private readonly gms: GeneratorManagerService) {}

  @Mutation(() => [PatientPlan])
  async generateNutritionalPlanForPatient(
    @Args('input') dto: GenerateNutritionalPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    return await this.gms.generateNutritionalPlanForPatient(dto, selectors);
  }
}
