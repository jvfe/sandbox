import pandas as pd
import datetime
from datetime import date, timedelta
import sys

yesterd = date.today() - timedelta(days=1)

def transform(table):
    nacional = pd.read_csv(table, sep=';')
    yesterday = yesterd.strftime("%Y-%m-%d")
    nacional_hoje = nacional.query("data == @yesterday")
    
    dic = pd.read_csv("./dicionario.csv")
    full = pd.merge(nacional_hoje, dic, on="estado")
    return(full)

def generate_qs(full):
    yesterday_wdt = yesterd.strftime("+%Y-%m-%dT00:00:00Z/11")
    today_wdt = date.today().strftime("+%Y-%m-%dT00:00:00Z/11")
    for index, row in full.iterrows():
        print(
      row['item'] + "|P1603|" + str(int(row['casosAcumulados'])) + "|P585|" + yesterday_wdt + "|S854|" + '"' + "https://covid.saude.gov.br/" + '"' +
            "|S813|" + today_wdt + "\n" +
      row['item'] + "|P1120|" + str(int(row['obitosAcumulados'])) + "|P585|" + yesterday_wdt + "|S854|" + '"' + "https://covid.saude.gov.br/" + '"' +
            "|S813|" + today_wdt  
        )



def main():
    full = transform(sys.stdin)
    generate_qs(full)


if __name__ == "__main__":
    main()
