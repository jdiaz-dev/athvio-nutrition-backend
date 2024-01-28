import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/professionals/custom-recipes/adapters/in/ingredients.resolver';
import { CustomRecipesManagementService } from 'src/modules/professionals/custom-recipes/application/custom-recipes-management.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { CustomRecipesResolver } from './adapters/in/custom-recipes.resolver';
import { CustomRecipe, CustomRecipeSchema } from './adapters/out/custom-recipe.schema';
import { CustomRecipesPersistenceService } from './adapters/out/custom-recipes-persistence.service';

const resolvers = [CustomRecipesResolver, IngredientsResolver];
const services = [CustomRecipesPersistenceService, CustomRecipesManagementService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CustomRecipe.name, schema: CustomRecipeSchema }]),
    ProfessionalsModule,
    UsersModule,
  ],
  providers: [...resolvers, ...services],
  exports: [CustomRecipesPersistenceService],
})
export class CustomRecipesModule {}
