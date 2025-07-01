import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/backoffice/foods/foods.module';
import { InternalQuestionaryModule } from 'src/modules/backoffice/internal-questionary/internal-questionary.module';

@Module({
  imports: [InternalQuestionaryModule, FoodsModule],
})
export class BackofficeDomainsModule {}
