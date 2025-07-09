db.InternalQuestionaries.insertOne({
  uuid: UUID()
    .toString('hex')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'),
  questionaryGroups: [
    {
      title: 'Informaciones de consulta',
      description: 'Motivos y expectativas para el seguimiento',
      questionaryDetails: [
        {
          fieldName: 'Motivo de consulta',
          associatedQuestion: '¿Cuál es el motivo de la consulta?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Expectativas',
          associatedQuestion: '¿Cuáles son sus expectativas?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Objetivos clínicos',
          associatedQuestion: '¿Cuáles son sus objetivos?',
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
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Calidad de sueño',
          associatedQuestion: '¿Es Ud. fumador?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Bebe alcohol',
          associatedQuestion: '¿Ud. bebe bebidas alcohólicas?¿Con qué frecuencia?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Estado civil',
          associatedQuestion: '¿Cuál es su estado civil?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Actividad física',
          associatedQuestion: '¿Realiza Ud. algun deporte/actividad física?¿Con qué frecuencia?',
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
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Hora habitual de acostarse',
          associatedQuestion: '¿Normalmente a que hora se acuesta?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Tipos de dieta',
          associatedQuestion: '¿Que tipos de dieta realiza?. Ejemplo: vegetariana, carnívora, cetogénica, etc.',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alimentos favoritos',
          associatedQuestion: '¿Cuáles son sus alimentos favoritos?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alimentos rechazados',
          associatedQuestion: '¿Cuáles son sus alimentos rechazados?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Alergias',
          associatedQuestion: '¿Sufre de algun tipo de alergia?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Deficiencias nutricionales',
          associatedQuestion: '¿Sufre de algun tipo de deficiencia nutricional?',
          isEnabled: true,
          isDeleted: false,
        },
        {
          fieldName: 'Ingesta de agua',
          associatedQuestion: '¿Normalmente cuánta agua bebe durante el dia?',
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
