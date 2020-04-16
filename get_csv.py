from selenium import webdriver
import os
import glob
import time
from datetime import date

# To prevent download dialog
profile = webdriver.FirefoxProfile()
profile.set_preference('browser.download.folderList', 2) # custom location
profile.set_preference('browser.download.manager.showWhenStarting', False)
profile.set_preference('browser.download.dir', '~/Documentos/sandbox/BRcsv')
profile.set_preference("browser.helperApps.neverAsk.saveToDisk","text/csv")

browser = webdriver.Firefox(profile)
browser.get("https://covid.saude.gov.br/")

time.sleep(5)
browser.find_element_by_xpath('/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/div[1]/div[2]/ion-button').click()

browser.close()


list_of_files = glob.glob('./BRcsv/*csv') 
latest_file = max(list_of_files, key=os.path.getctime)
current = latest_file
newname = f"./BRcsv/{str(date.today())}.csv"
os.rename(current,newname)
