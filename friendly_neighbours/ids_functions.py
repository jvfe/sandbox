import requests
from operator import itemgetter
import pandas as pd
import re

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
  return sorts

def getgenes(genelist):
    genes = []
    for i in genelist:
        genes.append(i['preferredName_A'])
    genes = set(genes)
    return list(genes)

def get_pdb(gene):
    uniprot = pd.read_table("./data/uniprot_mapping.tsv")
    reg = gene + "$"
    df = uniprot[uniprot["g_name"].str.contains(reg,regex=True, na=False)]
    if df.empty:
        reg = gene + ";"
        df = uniprot[uniprot["g_name"].str.contains(reg,regex=True, na=False)]

    st = df['PDB'].to_string(index=False)
    pdb = re.split(r"\s*[,;]\s*", st.strip())[1]
    return pdb 

# if __name__=='__main__':
#   get_pdb(
#     gene = 'IRAK3'
#   )
