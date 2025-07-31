MATCH (n)
RETURN n;

MATCH (dc:DiseaseCause)
RETURN dc;

MATCH (n)-[r]->(m)
RETURN n, r, m;

//get diseases caused by parasites 
MATCH (dc:DiseaseCause {name: "Parasites"})
OPTIONAL MATCH (di:Disease)-[hdc:HAS_DISEASE_CAUSE]->(dc)
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN dc,hrec,rec,hres,di


//get parasites with recomendations
MATCH (dc:DiseaseCause {name: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN dc,hrec,rec,hres,di

//get diseases and causes
MATCH (d:Disease)-[hdica:HAS_DISEASE_CAUSE]->(dc:DiseaseCause)
WHERE d.name in ["Cancer"] and dc.name = "Parasites"
OPTIONAL MATCH (dc:DiseaseCause)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
WHERE dc.name in ["Parasites"] 
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN d,hdica,dc,hrec,rec,hres,di


//get diesease
MATCH (d:Disease)
WHERE d.name in ["Gastritis"]
OPTIONAL MATCH (d:Disease)-[hdica:HAS_DISEASE_CAUSE]->(dc:DiseaseCause)
OPTIONAL MATCH (d:Disease)-[d_h_rec:HAS_RECOMMENDATION]->(d_rec:Recommendation)
OPTIONAL MATCH (dc:DiseaseCause)-[dc_h_rec:HAS_RECOMMENDATION]->(dc_rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN d,d_h_rec,dc_h_rec,hdica,dc,d_rec,dc_rec,hres,di

//get diabetes and relations if exists
MATCH (d:DiseaseCause {name: "Viruses"})
OPTIONAL MATCH (d)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
RETURN d,hrec,rec

//caused by abscence of magnesium
MATCH (d:Disease)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation {name: "Magnesium"})
RETURN d, hrec, rec;

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

