MATCH (n)
RETURN n;

MATCH (n)-[r]->(m)
RETURN n, r, m;

//get parasites graph
MATCH (c:Cause {name: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(res:Restriction)
RETURN c,hrec,rec,hres,res

// get data filtered by parasites
MATCH (c:Cause {name: "Parasites"})-[:HAS_RECOMMENDATION]->(r:Recommendation)
OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)
WITH c, r, COLLECT(DISTINCT res.name) AS restrictions
RETURN c.name AS cause, 
       COLLECT(DISTINCT {
           recommendation: r.name, 
           details: r.details,
           restrictions: restrictions
       }) AS recommendations;

//parasites reccomendations without restriction for diabetes
MATCH (c:Cause {name: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(res:Restriction)
WITH c, hrec, rec, hres, res
WHERE NOT EXISTS {
    MATCH (rec)-[:HAS_RESTRICTION]->(:Restriction {name: "Diabetes"})
}
RETURN c, hrec, rec, hres, res;

