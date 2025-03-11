db.CustomMeals.deleteMany({});
db.PatientPlans.find({ $or:[ 
  { patient: "64baf693fb81403afa9f7795", assignedDate: ISODate("2023-11-20T05:00:00.000+00:00")}, 
  { patient: "64baf693fb81403afa9f7795", assignedDate: ISODate("2023-11-21T05:00:00.000+00:00")}   ]  })