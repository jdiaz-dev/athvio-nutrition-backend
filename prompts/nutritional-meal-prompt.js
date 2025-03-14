{
    "_id": ObjectId(),
    "createdAt": Date(),
    "updatedAt": Date(),
    "professional": ObjectId("67cb5064a52f7c0e3d6543cf"),
    "name": "Meal 1",
    "ingredientDetails": [
      {
        "ingredientType": "UNIQUE_INGREDIENT",
        "ingredient": {
          "weightInGrams": 100,
          "protein": 0.85,
          "carbs": 0.06,
          "fat": 81.1,
          "calories": 717,
          "name": "Butter, Salted",
          "amount": 100,
          "label": "Gram"
        },
        "equivalents": [],
        "_id": ObjectId(),
        "createdAt": "2025-03-10T19:07:26.335Z",
        "updatedAt": "2025-03-10T19:07:26.335Z"
      }
    ],
    "cookingInstructions": "",
    "image":"", 
    "macros": {
      "weightInGrams": 100,
      "protein": 0.85,
      "carbs": 0.06,
      "fat": 81.1,
      "calories": 717
    },
    "yield":"",
    "servings":"",
    "description":"",
    "healthBenefits":"",  //optional, normally full field when you don't see underlined numbers, if you not found it must have the next  result  "healthBenefits":""
    "owner":"SYSTEM",
    "source": "Beat cancer kitchen",
    "relatedStudies": [{ summary:'', link:'' }], //mandatory when you see small underlined numbers (reference quotes) in the text of blue color, optional otherwise; if you not found it must have the next  result  "relatedStudies":[]
    "author": "Chris Wark",
    "isDeleted": false,
}