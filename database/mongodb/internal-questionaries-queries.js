const createUUID = () => {
  const uuid = UUID()
    .toString('hex')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
  return uuid;
};

db.InternalQuestionaries.insertOne({
  uuid: createUUID(),
  questionaryGroups: [
    {
      title: 'Informaciones de consulta',
      description: 'Motivos y expectativas para el seguimiento',
      questionaryDetails: [
        {
          fieldName: 'Motivo de consulta',
          associatedQuestion: '¿Cuál es el motivo de la consulta?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Expectativas',
          associatedQuestion: '¿Cuáles son sus expectativas?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Objetivos clínicos',
          associatedQuestion: '¿Cuáles son sus objetivos?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
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
          options: [
            {
              uuid: createUUID(),
              name: 'Normal',
            },
            {
              uuid: createUUID(),
              name: 'Estreñimiento',
            },
            {
              uuid: createUUID(),
              name: 'Diarrea',
            },
            {
              uuid: createUUID(),
              name: 'Irregular',
            },
          ],
          optionType: 'selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Horas de sueño',
          associatedQuestion: '¿Cúantas horas duerme Ud. por la noche?',
          options: [
            {
              uuid: createUUID(),
              name: 'Menos de 5 horas',
            },
            {
              uuid: createUUID(),
              name: '5 horas',
            },
            {
              uuid: createUUID(),
              name: '6 horas',
            },
            {
              uuid: createUUID(),
              name: '7 horas',
            },
            {
              uuid: createUUID(),
              name: '8 horas',
            },
            {
              uuid: createUUID(),
              name: '9 horas',
            },
            {
              uuid: createUUID(),
              name: '10 horas',
            },
            {
              uuid: createUUID(),
              name: 'Más de 10 horas',
            },
          ],
          optionType: 'selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Fumador',
          associatedQuestion: '¿Ud. es fumador?',
          optionType: 'boolean',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Bebe alcohol',
          associatedQuestion: '¿Ud. bebe bebidas alcohólicas?',
          optionType: 'boolean',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Estado civil',
          associatedQuestion: '¿Cuál es su estado civil?',
          options: [
            {
              uuid: createUUID(),
              name: 'Soltero(a)',
            },
            {
              uuid: createUUID(),
              name: 'Casado(a)',
            },
            {
              uuid: createUUID(),
              name: 'Divorciado(a)',
            },
            {
              uuid: createUUID(),
              name: 'Viudo(a)',
            },
          ],
          optionType: 'selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Actividad física',
          associatedQuestion: '¿Realiza Ud. algun deporte/actividad física?¿Con qué frecuencia?',
          options: [
            {
              uuid: createUUID(),
              name: 'Sedentario',
            },
            {
              uuid: createUUID(),
              name: 'Actividad física ligera',
            },
            {
              uuid: createUUID(),
              name: 'Actividad física moderada',
            },
            {
              uuid: createUUID(),
              name: 'Actividad física intensa',
            },
          ],
          optionType: 'selector',
          isEnabled: true,
          isDeleted: false,
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
          optionType: 'hour',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Hora habitual de acostarse',
          associatedQuestion: '¿Normalmente a que hora se acuesta?',
          optionType: 'hour',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Tipos de dieta',
          associatedQuestion: '¿Que tipos de dieta realiza?. Ejemplo: vegetariana, carnívora, cetogénica, etc.',
          options: [
            {
              uuid: createUUID(),
              name: 'Lacto-ovo vegetariano',
            },
            {
              uuid: createUUID(),
              name: 'Lacto vegetariano',
            },
            {
              uuid: createUUID(),
              name: 'Bajo en carbohidratos',
            },
            {
              uuid: createUUID(),
              name: 'Bajo en grasas',
            },
            {
              uuid: createUUID(),
              name: 'Macrobiótica',
            },
            {
              uuid: createUUID(),
              name: 'Mediterránea',
            },
            {
              uuid: createUUID(),
              name: 'Sin carne roja',
            },
            {
              uuid: createUUID(),
              name: 'Ovo-vegetariana',
            },
            {
              uuid: createUUID(),
              name: 'Paleo',
            },
            {
              uuid: createUUID(),
              name: 'Pescetariano',
            },
          ],
          optionType: 'multiple_selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alimentos favoritos',
          associatedQuestion: '¿Cuáles son sus alimentos favoritos?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alimentos rechazados',
          associatedQuestion: '¿Cuáles son sus alimentos rechazados?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alergias',
          associatedQuestion: '¿Sufre de algun tipo de alergia?',
          options: [
            {
              uuid: createUUID(),
              name: 'Apio',
            },
            {
              uuid: createUUID(),
              name: 'Maní',
            },
            {
              uuid: createUUID(),
              name: 'Crustáceo',
            },
            {
              uuid: createUUID(),
              name: 'Dióxido de azufre',
            },
            {
              uuid: createUUID(),
              name: 'Fruto seco',
            },
            {
              uuid: createUUID(),
              name: 'Gluten',
            },
            {
              uuid: createUUID(),
              name: 'Lupino',
            },
            {
              uuid: createUUID(),
              name: 'Látex natural',
            },
            {
              uuid: createUUID(),
              name: 'Molusco',
            },
            {
              uuid: createUUID(),
              name: 'Mostaza',
            },
            {
              uuid: createUUID(),
              name: 'Pescado',
            },
            {
              uuid: createUUID(),
              name: 'Soja',
            },
            {
              uuid: createUUID(),
              name: 'Sésamo',
            },
            {
              uuid: createUUID(),
              name: 'Trigo',
            },
          ],
          optionType: 'multiple_selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Intolerancias alimentarias',
          associatedQuestion: '¿Sufre de algun tipo de intelerancia alimentaria?',
          options: [
            {
              uuid: createUUID(),
              name: 'Alcohol',
            },
            {
              uuid: createUUID(),
              name: 'Aminas',
            },
            {
              uuid: createUUID(),
              name: 'Cafeina',
            },
            {
              uuid: createUUID(),
              name: 'Colorante alimenticio',
            },
            {
              uuid: createUUID(),
              name: 'Edulcorantes artificiales',
            },
            {
              uuid: createUUID(),
              name: 'FODMAPs',
            },
            {
              uuid: createUUID(),
              name: 'Fructosa',
            },
            {
              uuid: createUUID(),
              name: 'Glutamato monosódico',
            },
            {
              uuid: createUUID(),
              name: 'Gluten',
            },
            {
              uuid: createUUID(),
              name: 'Histamina',
            },
            {
              uuid: createUUID(),
              name: 'Lactosa',
            },
            {
              uuid: createUUID(),
              name: 'Levadura',
            },
            {
              uuid: createUUID(),
              name: 'Salicilatos',
            },
            {
              uuid: createUUID(),
              name: 'Sulfitos',
            },
            {
              uuid: createUUID(),
              name: 'Trigo',
            },
          ],
          optionType: 'multiple_selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Deficiencias nutricionales',
          associatedQuestion: '¿Sufre de algun tipo de deficiencia nutricional?',
          options: [
            {
              uuid: createUUID(),
              name: 'Calcio',
            },
            {
              uuid: createUUID(),
              name: 'Electrolitos',
            },
            {
              uuid: createUUID(),
              name: 'Hierro',
            },
            {
              uuid: createUUID(),
              name: 'Líquido',
            },
            {
              uuid: createUUID(),
              name: 'Magnesio',
            },
            {
              uuid: createUUID(),
              name: 'Niacina',
            },
            {
              uuid: createUUID(),
              name: 'Potasio',
            },
            {
              uuid: createUUID(),
              name: 'Sodio',
            },
            {
              uuid: createUUID(),
              name: 'Tiamina',
            },
            {
              uuid: createUUID(),
              name: 'Vitamina A',
            },
            {
              uuid: createUUID(),
              name: 'Vitamina B12',
            },
            {
              uuid: createUUID(),
              name: 'Vitamina C',
            },
            {
              uuid: createUUID(),
              name: 'Vitamina D',
            },
            {
              uuid: createUUID(),
              name: 'Yodo',
            },
            {
              uuid: createUUID(),
              name: 'Ácido fólico',
            },
          ],
          optionType: 'multiple_selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Ingesta de agua',
          associatedQuestion: '¿Normalmente cuánta agua bebe durante el dia?',
          options: [
            {
              uuid: createUUID(),
              name: 'Menos de 0.5 litros',
            },
            {
              uuid: createUUID(),
              name: 'Entre 0,5 y 1 litro',
            },
            {
              uuid: createUUID(),
              name: 'Entre 1 y 1,5 litros',
            },
            {
              uuid: createUUID(),
              name: 'Entre 1,5 y 2 litros',
            },
            {
              uuid: createUUID(),
              name: 'Entre 2 y 2,5 litros',
            },
            {
              uuid: createUUID(),
              name: 'Entre 2,5 y 3 litros',
            },
            {
              uuid: createUUID(),
              name: 'Más de 3 litros',
            },
          ],
          optionType: 'selector',
          isEnabled: true,
          isDeleted: false,
        },
      ],
    },
    {
      title: 'Historia clínica',
      description: 'Enfermedad(es) diagnosticadas y medicación del paciente',
      questionaryDetails: [
        {
          fieldName: 'Patologías',
          associatedQuestion: '¿Qué enfermedades tiene?',
          options: [
            {
              uuid: createUUID(),
              name: 'Gastritis',
            },
            {
              uuid: createUUID(),
              name: 'Estreñimiento',
            },
            {
              uuid: createUUID(),
              name: 'Piedras en la vesícula (litiasis biliar) ',
            },
          ],
          optionType: 'multiple_selector',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Medicación',
          associatedQuestion: 'En caso que utilize ¿Qué medicamentos Ud. utiliza?',
          optionType: 'text',
          isEnabled: true,
          isDeleted: false,
        },
      ],
    },
    {
      title: 'Personalizado',
      description: '',
      questionaryDetails: [],
    },
  ],
});
