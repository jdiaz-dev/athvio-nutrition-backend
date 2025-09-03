db.Formulas.insertOne({
  uuid: '7e1683b2-482a-4ffc-9159-7d063ee7f82d',
  spanishGroupName: 'Metabolismo basal',
  formulaGroups: [
    {
      uuid: '4678e70d-9ede-49c2-b0e1-a532f29908bd',
      spanishFormulaName: 'Ecuación de Mifflin-St Jeor',
      constants: [
        {
          spanishConstantName: 'Sedentario',
          value: 1.2,
          spanishCase: 'Mujeres',
        },
        {
          spanishConstantName: 'Sedentario',
          value: 1.2,
          spanishCase: 'Hombres',
        },
        {
          spanishConstantName: 'Ligera',
          value: 1.56,
          spanishCase: 'Mujeres', 
        },
        {
          spanishConstantName: 'Ligera',
          value: 1.55,
          spanishCase: 'Hombres',
        },
        {
          spanishConstantName: 'Moderada',
          value: 1.64,
          spanishCase: 'Mujeres',
        },
        {
          spanishConstantName: 'Moderada',
          value: 1.78,
          spanishCase: 'Hombres',
        },
        {
          spanishConstantName: 'Intensa',
          value: 1.82,
          spanishCase: 'Mujeres',
        },
        {
          spanishConstantName: 'Intensa',
          value: 2.1,
          spanishCase: 'Hombres',
        },
      ],
    },
  ],
});
