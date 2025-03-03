MATCH (d:Disease)
        WHERE d.id IN [
        "8f243e08-dd37-4acf-a5ea-b160eeaa82db",
        "3f4c33c6-21bd-44d2-9053-027a18c2f9fa"
    ] AND d.isActive = true
    OPTIONAL MATCH (d)-[:HAS_RECOMMENDATION]->(r:Recommendation)
        OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)

        WITH d, r, COLLECT(DISTINCT {
          id: r.id,
          name:r.name,
          details: r.details
        }) AS recommendation, 
        
        COLLECT(res) AS restrictions

        RETURN d.name AS disease, 
        COLLECT(DISTINCT {
            name:d.name,
            recommendations: recommendation 
            //restrictions: restrictions  
        }) AS resultName;


MATCH (d:Disease)
 WHERE d.id IN [
        "8f243e08-dd37-4acf-a5ea-b160eeaa82db",
        "3f4c33c6-21bd-44d2-9053-027a18c2f9fa"
    ]
OPTIONAL MATCH (d)-[:HAS_RECOMMENDATION]->(r:Recommendation)
       

    return d