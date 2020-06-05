library(tidyverse)

guide_ligands <- read_csv("https://www.guidetopharmacology.org/DATA/gtopdb_coronavirus_info_ligands_list.csv") %>% 
  janitor::clean_names() %>% 
  separate(ligand_id, sep = ';', 
           into = paste0('ligand_id', 1:2),
           remove= TRUE) %>%
  separate(ligand_therapeutic, sep = '\\+|\\band\\b',
           into = paste0('ligand_or_therapeutic', 1:2),
           remove= TRUE) %>% 
  na_if('n/a') %>% na_if(' others)')
                         
guide_ligands %>% View()

guide_targets <- read_csv("https://www.guidetopharmacology.org/DATA/gtopdb_coronavirus_info_targets_list.csv") %>% 
  janitor::clean_names()

guide_targets %>% View()
