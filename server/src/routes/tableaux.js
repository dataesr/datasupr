import express from 'express';

const router = new express.Router();

const allData = [
  { idPaysage: "G2qA7", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc", "msca"] },
  { idPaysage: "FRAFR", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc"] },
  { idPaysage: "DEUDE", tableauxIds: ["european-projects"] },
];

const allTabs = [
  { label: "Projets européens", id: "european-projects", description: "description du tableau de bord desprojets européens", tags: ["Recherche"] },
  { label: "tableau de bord financier", id: "tableau-de-bord-financier", description: "description du tableau de bord financier", tags: ["Enseignement supérieur"] },
  { label: "ERC", id: "erc", description: "description du tableau de bord des ERC", tags: ["Recherche"] },
  { label: "MSCA", id: "msca", description: "description du tableau de bord des MSCA", tags: ["Recherche"] },
]

router.route('/tableaux')
  .get((req, res) => {
    let tabs = [];
    let data = [];
    if (req.query?.q) {
      tabs = allData.find((el) => el.idPaysage === req.query.q);
      console.log(tabs);
      data = allTabs.filter((el) => tabs.tableauxIds.includes(el.id));
    }

    res.json(data);
  });

export default router;
