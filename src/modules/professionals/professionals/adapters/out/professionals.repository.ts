import { CreateProfessionalDto } from "src/modules/professionals/professionals/adapters/in/dtos/create-professional.dto";

export interface IProfessionalRepository {
  createProfessional(dto: CreateProfessionalDto): any;
  getProfessionalByEmail(email: string): any;
}
