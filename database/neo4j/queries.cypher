MATCH (n)
RETURN n;

MATCH (dc:DiseaseCause)
RETURN dc;

MATCH (n)-[r]->(m)
RETURN n, r, m;

//get diseases caused by parasites 
MATCH (dc:DiseaseCause {englishName: "Parasites"})
OPTIONAL MATCH (di:Disease)-[hdc:HAS_DISEASE_CAUSE]->(dc)
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN dc,hrec,rec,hres,di


//get parasites with recomendations
MATCH (dc:DiseaseCause {englishName: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN dc,hrec,rec,hres,di

//get diseases and causes
MATCH (d:Disease)-[hdica:HAS_DISEASE_CAUSE]->(dc:DiseaseCause)
WHERE d.englishName in ["Cancer"] and dc.englishName = "Parasites"
OPTIONAL MATCH (dc:DiseaseCause)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
WHERE dc.englishName in ["Parasites"] 
OPTIONAL MATCH (dc)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN d,hdica,dc,hrec,rec,hres,di


//get diesease
MATCH (d:Disease)
WHERE d.englishName in ["Gastritis"]
OPTIONAL MATCH (d:Disease)-[hdica:HAS_DISEASE_CAUSE]->(dc:DiseaseCause)
OPTIONAL MATCH (d:Disease)-[d_h_rec:HAS_RECOMMENDATION]->(d_rec:Recommendation)
OPTIONAL MATCH (dc:DiseaseCause)-[dc_h_rec:HAS_RECOMMENDATION]->(dc_rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(di:Disease)
RETURN d,d_h_rec,dc_h_rec,hdica,dc,d_rec,dc_rec,hres,di

//get diabetes and relations if exists
MATCH (d:DiseaseCause {englishName: "Viruses"})
OPTIONAL MATCH (d)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
RETURN d,hrec,rec

//caused by abscence of magnesium
MATCH (d:Disease)-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation {englishName: "Magnesium"})
RETURN d, hrec, rec;

// get data filtered by parasites
MATCH (dc:DiseaseCause {englishName: "Parasites"})-[:HAS_RECOMMENDATION]->(r:Recommendation)
OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)
WITH dc, r, COLLECT(DISTINCT res.englishName) AS restrictions
WHERE NOT EXISTS {
    MATCH (rec)-[:HAS_RESTRICTION]->(:Restriction {englishName: "Diabetes"})
}
RETURN dc.englishName AS cause, 
       COLLECT(DISTINCT {
           recommendation: r.englishName, 
           details: r.englishDetails,
           restrictions: restrictions
       }) AS recommendations;

//parasites reccomendations without restriction for diabetes
MATCH (dc:DiseaseCause {englishName: "Parasites"})-[hrec:HAS_RECOMMENDATION]->(rec:Recommendation)
OPTIONAL MATCH (rec)-[hres:HAS_RESTRICTION]->(res:Restriction)
WITH dc, hrec, rec, hres, res
WHERE NOT EXISTS {
    MATCH (rec)-[:HAS_RESTRICTION]->(:Restriction {englishName: "Diabetes"})
}
RETURN dc, hrec, rec, hres, res;

