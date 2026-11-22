export class PatientQuestionaryQueryFragments {
  /**
   * Builds the answer of a patient questionary detail for reading.
   * Multiple selector answers store focused answers as { professionalFocusedQuestion, answer }; this adds
   * fieldName and associatedQuestion from the professional focused question with that uuid.
   * Any other answer (primitive or missing) is returned as stored.
   * @param detailAnswer expression of the stored answer, e.g. '$$detail.answer'
   * @param professionalOptions expression of the professional detail options, e.g. '$$professionalDetail.options'
   */
  static answerWithFocusedQuestionsInfo(detailAnswer: string, professionalOptions: string): Record<string, any> {
    return {
      $cond: [
        { $isArray: detailAnswer },
        {
          $let: {
            vars: {
              professionalFocusedQuestions: {
                $reduce: {
                  input: { $ifNull: [professionalOptions, []] },
                  initialValue: [],
                  in: { $concatArrays: ['$$value', { $ifNull: ['$$this.focusedQuestions', []] }] },
                },
              },
            },
            in: {
              $map: {
                input: detailAnswer,
                as: 'answerItem',
                in: {
                  $cond: [
                    { $isArray: '$$answerItem.focusedQuestions' },
                    {
                      $mergeObjects: [
                        '$$answerItem',
                        {
                          focusedQuestions: {
                            $map: {
                              input: '$$answerItem.focusedQuestions',
                              as: 'focusedAnswer',
                              in: {
                                $let: {
                                  vars: {
                                    focusedQuestion: {
                                      $arrayElemAt: [
                                        {
                                          $filter: {
                                            input: '$$professionalFocusedQuestions',
                                            as: 'professionalFocusedQuestion',
                                            cond: {
                                              $eq: [
                                                '$$professionalFocusedQuestion.uuid',
                                                '$$focusedAnswer.professionalFocusedQuestion',
                                              ],
                                            },
                                          },
                                        },
                                        0,
                                      ],
                                    },
                                  },
                                  in: {
                                    $mergeObjects: [
                                      '$$focusedAnswer',
                                      {
                                        fieldName: '$$focusedQuestion.fieldName',
                                        associatedQuestion: '$$focusedQuestion.associatedQuestion',
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                    '$$answerItem',
                  ],
                },
              },
            },
          },
        },
        detailAnswer,
      ],
    };
  }
}
