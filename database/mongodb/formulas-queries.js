db.Formulas.insertOne({
  uuid: '7e1683b2-482a-4ffc-9159-7d063ee7f82d',
  spanishGroupName: 'Metabolismo basal',
  formulaGroups: [
    {
      uuid: '4678e70d-9ede-49c2-b0e1-a532f29908bd',
      spanishFormulaName: 'MIFFLIN',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          case: 'female',
          coefficients: [
            { variable: 'weight', value: 10 },
            { variable: 'height', value: 6.25 },
            { variable: 'age', value: -5 },
          ],
          constants: [{ name: 'baseAdjustment', value: -161 }],
        },
        {
          spanishCaseLabel: 'Hombres',
          case: 'male',
          coefficients: [
            { variable: 'weight', value: 10 },
            { variable: 'height', value: 6.25 },
            { variable: 'age', value: -5 },
          ],
          constants: [{ name: 'baseAdjustment', value: 5 }],
        },
      ],
      parameterDescription: 'Factor de actividad física',
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          description: 'No realiza actividad física',
          valueCases: [
            { value: 1.2, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.2, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Ligera',
          description: '3 horas semanales de actividad física',
          valueCases: [
            { value: 1.56, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.55, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Moderada',
          description: '6 horas semanales de actividad física',
          valueCases: [
            { value: 1.64, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.78, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Intensa',
          description: '4 a 5 horas diarias de actividad física',
          valueCases: [
            { value: 1.82, case: 'female', spanishCase: 'Mujeres' },
            { value: 2.1, case: 'male', spanishCase: 'Hombres' },
          ],
        },
      ],
    },
    {
      uuid: 'e7762ab0-c671-4672-98a5-1ae3491e7ecf',
      spanishFormulaName: 'HARRIS',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          case: 'female',
          coefficients: [
            { variable: 'weight', value: 9.247 },
            { variable: 'height', value: 3.098 },
            { variable: 'age', value: -4.33 },
          ],
          constants: [{ name: 'baseAdjustment', value: 447.593 }],
        },
        {
          spanishCaseLabel: 'Hombres',
          case: 'male',
          coefficients: [
            { variable: 'weight', value: 13.397 },
            { variable: 'height', value: 4.799 },
            { variable: 'age', value: -5.677 },
          ],
          constants: [{ name: 'baseAdjustment', value: 88.362 }],
        },
      ],
      parameterDescription: 'Actividad física',
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          description: 'No realiza actividad física',
          valueCases: [
            { value: 1.2, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.2, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Ligera',
          description: '3 horas semanales de actividad física',
          valueCases: [
            { value: 1.375, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.375, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Moderada',
          description: '6 horas semanales de actividad física',
          valueCases: [
            { value: 1.55, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.55, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Intensa',
          description: '4 a 5 horas diarias de actividad física',
          valueCases: [
            { value: 1.725, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.725, case: 'male', spanishCase: 'Hombres' },
          ],
        },
      ],
    },

    {
      uuid: '0e5e0aac-f5bd-4630-a142-b98253488a6d',
      spanishFormulaName: 'OWEN',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          case: 'female',
          coefficients: [{ variable: 'weight', value: 7.18 }],
          constants: [{ name: 'baseAdjustment', value: 795 }],
        },
        {
          spanishCaseLabel: 'Hombres',
          case: 'male',
          coefficients: [{ variable: 'weight', value: 10.2 }],
          constants: [{ name: 'baseAdjustment', value: 879 }],
        },
      ],
      parameterDescription: 'Factor de actividad física',
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          description: 'No realiza actividad física',
          valueCases: [
            { value: 1.2, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.2, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Ligera',
          description: '3 horas semanales de actividad física',
          valueCases: [
            { value: 1.375, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.375, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Moderada',
          description: '6 horas semanales de actividad física',
          valueCases: [
            { value: 1.55, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.55, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Intensa',
          description: '4 a 5 horas diarias de actividad física',
          valueCases: [
            { value: 1.725, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.725, case: 'male', spanishCase: 'Hombres' },
          ],
        },
      ],
    },

    {
      uuid: 'c394342c-2b92-486f-b51f-d1150d3b5e3b',
      spanishFormulaName: 'TINSLEY',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          case: 'female',
          coefficients: [{ variable: 'leanMass', value: 20.9 }],
          constants: [{ name: 'baseAdjustment', value: 500 }],
        },
        {
          spanishCaseLabel: 'Hombres',
          case: 'male',
          coefficients: [{ variable: 'leanMass', value: 22.3 }],
          constants: [{ name: 'baseAdjustment', value: 500 }],
        },
      ],
      parameterDescription: 'Factor de actividad física',
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          description: 'No realiza actividad física',
          valueCases: [
            { value: 1.2, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.2, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Ligera',
          description: '3 horas semanales de actividad física',
          valueCases: [
            { value: 1.375, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.375, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Moderada',
          description: '6 horas semanales de actividad física',
          valueCases: [
            { value: 1.55, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.55, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Intensa',
          description: '4 a 5 horas diarias de actividad física',
          valueCases: [
            { value: 1.725, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.725, case: 'male', spanishCase: 'Hombres' },
          ],
        },
      ],
    },

    /* {
      uuid: 'b1d7bb8a-5db0-42e6-8a07-fcf11ebef174',
      spanishFormulaName: 'OMS',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          case: 'female',
          coefficients: [{ variable: 'weight', value: 8.7 }],
          constants: [{ name: 'baseAdjustment', value: 829 }],
        },
        {
          spanishCaseLabel: 'Hombres',
          case: 'male',
          coefficients: [{ variable: 'weight', value: 11.6 }],
          constants: [{ name: 'baseAdjustment', value: 879 }],
        },
      ],
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          description: 'No realiza actividad física',
          valueCases: [
            { value: 1.2, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.2, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Ligera',
          description: '3 horas semanales de actividad física',
          valueCases: [
            { value: 1.56, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.55, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Moderada',
          description: '6 horas semanales de actividad física',
          valueCases: [
            { value: 1.64, case: 'female', spanishCase: 'Mujeres' },
            { value: 1.78, case: 'male', spanishCase: 'Hombres' },
          ],
        },
        {
          spanishParameterName: 'Intensa',
          description: '4 a 5 horas diarias de actividad física',
          valueCases: [
            { value: 1.82, case: 'female', spanishCase: 'Mujeres' },
            { value: 2.1, case: 'male', spanishCase: 'Hombres' },
          ],
        },
      ],
    }, */
  ],
});
