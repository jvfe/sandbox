"
Possible methods:
	Mapping identifiers = get_string_ids
	Retrieving interaction network = network (default)
	Interaction partners = interaction_partners
	Homology = homology
	Best hits for homology = homology_best
	Functional enrichment = enrichment
	Functional annotation = functional_annotation
	Enrich interaction net = ppi_enrichment
"
stringwRap <- function(myApp = "www.awesome_app.org", genes, species, method = "network") {
  
  genes <- paste(genes, collapse="%0d")
  
  request <- paste0(
		    "https://string-db.org/api/tsv/",method,"?identifiers=",
		    genes, "&species=", species, "&caller_identity=", myApp
		    )
  interact <- read.table(
    request,
    header = T
  )
  return(interact)
}
