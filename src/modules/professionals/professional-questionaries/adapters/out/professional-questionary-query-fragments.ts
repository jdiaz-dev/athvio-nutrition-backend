export class ProfessionalQuestionaryQueryFragments {
  static projectAndFilterDetails(restFields: Record<string, number>): Record<string, any> {
    return {
      ...restFields,
      questionaryGroups: {
        $map: {
          input: '$questionaryGroups',
          as: 'group',
          in: {
            _id: '$$group._id',
            uuid: '$$group.uuid',
            title: '$$group.title',
            questionaryDetails: {
              $filter: {
                input: '$$group.questionaryDetails',
                as: 'detail',
                cond: { $eq: ['$$detail.isDeleted', false] },
              },
            },
          },
        },
      },
    };
  }
}
