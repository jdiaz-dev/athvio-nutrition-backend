// to check labels
CALL db.schema.nodeTypeProperties()
YIELD nodeLabels, propertyName
RETURN DISTINCT nodeLabels, propertyName

// To set the display label 
:style
{
  "node": {
    "Food": {
      "caption": "englishName"
    }
  }
}
