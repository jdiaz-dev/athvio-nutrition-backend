import { CustomFieldsGroupName } from 'src/shared/enums/project';
import { QuestionaryDetail } from 'src/shared/schemas/questionary.schema';
import { Questionary, QuestionaryGroup } from 'src/shared/schemas/questionary.schema';

type QuestionaryGroupType = (Omit<QuestionaryGroup, '_id'> & { questionaryDetails: Omit<QuestionaryDetail, '_id'>[] })[];
type GlobalQuestionary = Omit<Questionary, '_id' | 'questionaryGroups' | 'createdAt' | 'updatedAt'> & {
  questionaryGroups: QuestionaryGroupType;
};

/* 
questionaryGroups
title
description
  

questionaryDetails
  questionaryGroupId
  questionaryDetailId
  ...data


*/


//todo: create and carry to commons database
//todo: break  in normalized way
export const globalQuestionary: GlobalQuestionary = {
  questionaryGroups: [
    {
      title: 'Informaciones de consulta',
      description: 'Motivos y expectativas para el seguimiento',
      questionaryDetails: [
        {
          fieldName: 'Motivo de consulta',
          associatedQuestion: '¿Cuál es el motivo de la consulta?',
          isEnabled: true,
          isDeleted: false,//to delete
          fieldType: 'text',
        },
        {
          fieldName: 'Expectativas',
          associatedQuestion: '¿Cuáles son sus expectativas?',
          isEnabled: true,
          isDeleted: false, //to delete
          fieldType: 'text',
        },
        {
          fieldName: 'Objetivos clínicos',
          associatedQuestion: '¿Cuáles son sus objetivos?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
      ],
    },
    {
      title: 'Historia personal y social',
      description: 'Informaciones y habitos fisiológicos del paciente',
      questionaryDetails: [
        {
          fieldName: 'Función intestinal',
          associatedQuestion: '¿Sufre Ud. de estreñimiento/diarrea/intestino irritable?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Calidad de sueño',
          associatedQuestion: '¿Es Ud. fumador?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Bebe alcohol',
          associatedQuestion: '¿Ud. bebe bebidas alcohólicas?¿Con qué frecuencia?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Estado civil',
          associatedQuestion: '¿Cuál es su estado civil?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Actividad física',
          associatedQuestion: '¿Realiza Ud. algun deporte/actividad física?¿Con qué frecuencia?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
      ],
    },
    {
      title: 'Historia alimentaria',
      description: 'Habitos y preferencias alimentarias del paciente',
      questionaryDetails: [
        {
          fieldName: 'Hora habitual de levantarse',
          associatedQuestion: '¿Normalmente a que hora se levanta?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Hora habitual de acostarse',
          associatedQuestion: '¿Normalmente a que hora se acuesta?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Tipos de dieta',
          associatedQuestion: '¿Que tipos de dieta realiza?. Ejemplo: vegetariana, carnívora, cetogénica, etc.',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Alimentos favoritos',
          associatedQuestion: '¿Cuáles son sus alimentos favoritos?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Alimentos rechazados',
          associatedQuestion: '¿Cuáles son sus alimentos rechazados?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Alergias',
          associatedQuestion: '¿Sufre de algun tipo de alergia?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Deficiencias nutricionales',
          associatedQuestion: '¿Sufre de algun tipo de deficiencia nutricional?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          fieldName: 'Ingesta de agua',
          associatedQuestion: '¿Normalmente cuánta agua bebe durante el dia?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
      ],
    },
    {
      title: CustomFieldsGroupName,
      description: '',
      questionaryDetails: [],
    },
  ],
};
/* 
questionaryConfig
  questionaryGroups
    questionaryGroup
    questionaryDetails
      questionaryDetail
      isEnabled
*/


export const globalQuestionaryxxx = {
  questionaryGroups: [
    {
      questionaryGroup: 'mongoId',
      questionaryDetails: [
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
      ],
    },
    {
      questionaryGroup: 'mongoId',
      questionaryDetails: [
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
      ],
    },
    {
      title: 'Historia alimentaria',
      description: 'Habitos y preferencias alimentarias del paciente',
      questionaryDetails: [
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
        },
        {
          questionaryDetail:'mongoId',
          fieldName: 'Alergias',
          associatedQuestion: '¿Sufre de algun tipo de alergia?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          questionaryDetail:'mongoId',
          fieldName: 'Deficiencias nutricionales',
          associatedQuestion: '¿Sufre de algun tipo de deficiencia nutricional?',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
        {
          questionaryDetail:'mongoId',
          isEnabled: true,
          isDeleted: false,
          fieldType: 'text',
        },
      ],
    },
    {
      title: CustomFieldsGroupName,
      description: '',
      questionaryDetails: [],
    },
  ],
};

/* 
  so far the most possible option is move specific fields to other document and realize multiple $lookups

*/