import requests
from SPARQLWrapper import SPARQLWrapper, JSON
from operator import itemgetter

string_api_url = "https://string-db.org/api"
output_format = "json"
method = "network"
request_url = "/".join([string_api_url, output_format, method])

def firstreq(gene):
    params = {

        "identifiers" : gene, # your protein
        "species" : 9606, # species NCBI identifier 
        "caller_identity" : "www.awesome_app.org", # your app name
        "required_score" : 700

    }
    response = requests.post(request_url, data=params)

    for i in response.json():
        yield i['stringId_B']

def lastreq(gene):
    neighbours = list(firstreq(gene))
    newparams = {

        "identifiers" : "%0d".join(neighbours),
        "species" : 9606,
        "caller_identity" : "www.awesome_app.org"

    }

    lastresponse = requests.post(request_url, data=newparams)

    for j in lastresponse.json():
            if j['preferredName_B'] != gene and j['preferredName_A'] != gene:
                yield j 

def sortbyscore(gene):
  genelist = list(lastreq(gene))
  sorts = sorted(genelist, key=itemgetter('score'), reverse=True)
  return sorts[0:5] 

def getgenes(genelist):
    for i in genelist:
        yield i['preferredName_A']

def get_pdb(gene):
    endpoint_url = "https://query.wikidata.org/sparql"
    query = "SELECT ?pdbid WHERE {{values ?symbol {} . ?gene wdt:P638 ?pdbid .}} LIMIT 1".format({gene})

    def get_results(endpoint_url, query):
        sparql = SPARQLWrapper(endpoint_url)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        return sparql.query().convert()

    pdblist = []
    results = get_results(endpoint_url, query)
    return results['results']['bindings'][0]['pdbid']['value']

# if __name__=='__main__':
#   get_pdb(
#     gene = input('gene:')
#   )