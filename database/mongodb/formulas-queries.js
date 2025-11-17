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
          coefficients: [
            { variable: 'weight', value: 10 },
            { variable: 'height', value: 6.25 },
            { variable: 'age', value: -5 }
          ],
          constants: [
            { name: 'baseAdjustment', value: -161 }
          ]
        },
        {
          spanishCaseLabel: 'Hombres',
          coefficients: [
            { variable: 'weight', value: 10 },
            { variable: 'height', value: 6.25 },
            { variable: 'age', value: -5 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 5 }
          ]
        }
      ],
      parameters: [
        {
          spanishParameterName: 'Sedentario',
          valueCases: [
            { value: 1.2, spanishCase: 'Mujeres' },
            { value: 1.2, spanishCase: 'Hombres' }
          ]
        },
        {
          spanishParameterName: 'Ligera',
          valueCases: [
            { value: 1.56, spanishCase: 'Mujeres' },
            { value: 1.55, spanishCase: 'Hombres' }
          ]
        },
        {
          spanishParameterName: 'Moderada',
          valueCases: [
            { value: 1.64, spanishCase: 'Mujeres' },
            { value: 1.78, spanishCase: 'Hombres' }
          ]
        },
        {
          spanishParameterName: 'Intensa',
          valueCases: [
            { value: 1.82, spanishCase: 'Mujeres' },
            { value: 2.1, spanishCase: 'Hombres' }
          ]
        }
      ]
    },

    {
      uuid: 'e7762ab0-c671-4672-98a5-1ae3491e7ecf',
      spanishFormulaName: 'HARRIS',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          coefficients: [
            { variable: 'weight', value: 9.247 },
            { variable: 'height', value: 3.098 },
            { variable: 'age', value: -4.330 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 447.593 }
          ]
        },
        {
          spanishCaseLabel: 'Hombres',
          coefficients: [
            { variable: 'weight', value: 13.397 },
            { variable: 'height', value: 4.799 },
            { variable: 'age', value: -5.677 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 88.362 }
          ]
        }
      ],
      parameters: [
        { spanishParameterName: 'Sedentario', valueCases: [
          { value: 1.2, spanishCase: 'Mujeres' },
          { value: 1.2, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Ligera', valueCases: [
          { value: 1.56, spanishCase: 'Mujeres' },
          { value: 1.55, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Moderada', valueCases: [
          { value: 1.64, spanishCase: 'Mujeres' },
          { value: 1.78, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Intensa', valueCases: [
          { value: 1.82, spanishCase: 'Mujeres' },
          { value: 2.1, spanishCase: 'Hombres' }
        ]}
      ]
    },

    {
      uuid: '0e5e0aac-f5bd-4630-a142-b98253488a6d',
      spanishFormulaName: 'OWEN',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          coefficients: [
            { variable: 'weight', value: 7.18 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 795 }
          ]
        },
        {
          spanishCaseLabel: 'Hombres',
          coefficients: [
            { variable: 'weight', value: 10.2 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 879 }
          ]
        }
      ],
      parameters: [
        { spanishParameterName: 'Sedentario', valueCases: [
          { value: 1.2, spanishCase: 'Mujeres' },
          { value: 1.2, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Ligera', valueCases: [
          { value: 1.56, spanishCase: 'Mujeres' },
          { value: 1.55, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Moderada', valueCases: [
          { value: 1.64, spanishCase: 'Mujeres' },
          { value: 1.78, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Intensa', valueCases: [
          { value: 1.82, spanishCase: 'Mujeres' },
          { value: 2.1, spanishCase: 'Hombres' }
        ]}
      ]
    },

    {
      uuid: 'c394342c-2b92-486f-b51f-d1150d3b5e3b',
      spanishFormulaName: 'TINSLEY',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          coefficients: [
            { variable: 'leanMass', value: 20.9 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 500 }
          ]
        },
        {
          spanishCaseLabel: 'Hombres',
          coefficients: [
            { variable: 'leanMass', value: 22.3 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 500 }
          ]
        }
      ],
      parameters: [
        { spanishParameterName: 'Sedentario', valueCases: [
          { value: 1.2, spanishCase: 'Mujeres' },
          { value: 1.2, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Ligera', valueCases: [
          { value: 1.56, spanishCase: 'Mujeres' },
          { value: 1.55, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Moderada', valueCases: [
          { value: 1.64, spanishCase: 'Mujeres' },
          { value: 1.78, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Intensa', valueCases: [
          { value: 1.82, spanishCase: 'Mujeres' },
          { value: 2.1, spanishCase: 'Hombres' }
        ]}
      ]
    },

    {
      uuid: 'b1d7bb8a-5db0-42e6-8a07-fcf11ebef174',
      spanishFormulaName: 'OMS',
      cases: [
        {
          spanishCaseLabel: 'Mujeres',
          coefficients: [
            { variable: 'weight', value: 8.7 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 829 }
          ]
        },
        {
          spanishCaseLabel: 'Hombres',
          coefficients: [
            { variable: 'weight', value: 11.6 }
          ],
          constants: [
            { name: 'baseAdjustment', value: 879 }
          ]
        }
      ],
      parameters: [
        { spanishParameterName: 'Sedentario', valueCases: [
          { value: 1.2, spanishCase: 'Mujeres' },
          { value: 1.2, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Ligera', valueCases: [
          { value: 1.56, spanishCase: 'Mujeres' },
          { value: 1.55, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Moderada', valueCases: [
          { value: 1.64, spanishCase: 'Mujeres' },
          { value: 1.78, spanishCase: 'Hombres' }
        ]},
        { spanishParameterName: 'Intensa', valueCases: [
          { value: 1.82, spanishCase: 'Mujeres' },
          { value: 2.1, spanishCase: 'Hombres' }
        ]}
      ]
    }
  ]
});
