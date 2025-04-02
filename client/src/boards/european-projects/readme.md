# commandes à passer sur la collection si les codes piliers ne sont pas présents
```sh
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Excellence scientifique" }, { "$set": { "pilier_code": "p1" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Problématiques mondiales et compétitivité industrielle européenne" }, { "$set": { "pilier_code": "p2" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Europe plus innovante" }, { "$set": { "pilier_code": "p3" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Élargir la participation et renforcer l\'espace européen de la recherche" }, { "$set": { "pilier_code": "p4" } })
```

```sh

db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Conseil européen de la recherche (ERC)" }, { "$set": { "programme_code": "HORIZON.1.1" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Marie Sklodowska-Curie Actions (MSCA)" }, { "$set": { "programme_code": "HORIZON.1.2" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Infrastructures de recherche" }, { "$set": { "programme_code": "HORIZON.1.3" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Santé" }, { "$set": { "programme_code": "HORIZON.2.1" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Culture, créativité et société inclusive" }, { "$set": { "programme_code": "HORIZON.2.2" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Sécurité civile pour la société" }, { "$set": { "programme_code": "HORIZON.2.3" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Numérique, industrie et espace" }, { "$set": { "programme_code": "HORIZON.2.4" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Climat, énergie et mobilité" }, { "$set": { "programme_code": "HORIZON.2.5" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Bio-Environnement" }, { "$set": { "programme_code": "HORIZON.2.6" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Conseil européen de l'innovation (EIC)" }, { "$set": { "programme_code": "HORIZON.3.1" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Écosystèmes européens de l'innovation (EIE)" }, { "$set": { "programme_code": "HORIZON.3.2" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Institut européen d'innovation et de technologie (EIT)" }, { "$set": { "programme_code": "HORIZON.3.3" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Élargir la participation et diffuser l'excellence" }, { "$set": { "programme_code": "HORIZON.4.1" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Réformer et renforcer le système européen de la R&I" }, { "$set": { "programme_code": "HORIZON.4.2" } })
db["fr-esr-all-projects-synthese"].updateMany({ programme_name_fr: "Mission" }, { "$set": { "programme_code": "MISSION" } })
```