MATCH (n)
RETURN n;

MATCH (dc:DiseaseCause)
RETURN dc;

MATCH (n)-[r]->(m)
RETURN n, r, m;



//get parasites graph
MATCH (dc:DiseaseCause {name: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN dc,hrec,rec,hres,di

// get data filtered by parasites
MATCH (dc:DiseaseCause {name: "Parasites"})-[:HAS_RECOMMENDATION]->(r:Recommendation)
OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)
WITH dc, r, COLLECT(DISTINCT res.name) AS restrictions
WHERE NOT EXISTS {
    MATCH (rec)-[:HAS_RESTRICTION]->(:Restriction {name: "Diabetes"})
}
RETURN dc.name AS cause, 
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

