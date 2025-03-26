# commandes à passer sur la collection si les codes piliers ne sont pas présents
```sh
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Excellence scientifique" }, { "$set": { "pilier_code": "p1" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Problématiques mondiales et compétitivité industrielle européenne" }, { "$set": { "pilier_code": "p2" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Europe plus innovante" }, { "$set": { "pilier_code": "p3" } })
db["fr-esr-horizon-projects-entities"].updateMany({ pilier_name_fr: "Élargir la participation et renforcer l\'espace européen de la recherche" }, { "$set": { "pilier_code": "p4" } })
```