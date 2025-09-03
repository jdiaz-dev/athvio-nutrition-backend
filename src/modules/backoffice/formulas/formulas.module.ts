import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { Formula, FormulaSchema } from 'src/modules/backoffice/formulas/adapters/out/formula.schema';
import { FormulasPersistenceService } from 'src/modules/backoffice/formulas/adapters/out/formulas-persistence.service';
import { FormulasResolver } from 'src/modules/backoffice/formulas/adapters/in/formulas.resolver';
import { FormulasManagerService } from 'src/modules/backoffice/formulas/application/formulas-manager.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Formula.name, schema: FormulaSchema }]), SharedModule, AuthModule],
  providers: [FormulasPersistenceService, FormulasManagerService, FormulasResolver],
})
export class FormulasModule {}
