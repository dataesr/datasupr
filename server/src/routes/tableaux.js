import express from 'express';

const router = new express.Router();

const allData = [
  { idPaysage: "G2qA7", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc", "msca"] },
  { idPaysage: "FRAFR", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc", "atlas"] },
  { idPaysage: "DEUDE", tableauxIds: ["european-projects"] },
];

const allTabs = [
  { label: "Projets européens", id: "european-projects", description: "description du tableau de bord desprojets européens", tags: ["Recherche"] },
  { label: "tableau de bord financier", id: "tableau-de-bord-financier", description: "description du tableau de bord financier", tags: ["Enseignement supérieur"] },
  { label: "ERC", id: "erc", description: "description du tableau de bord des ERC", tags: ["Recherche"] },
  { label: "MSCA", id: "msca", description: "description du tableau de bord des MSCA", tags: ["Recherche"] },
  { label: "Atlas", id: "atlas", description: "description du tableau atlas", tags: ["Enseignement supérieur"] },
]

router.route('/tableaux')
  .get((req, res) => {
    console.log(req.query.q);
    let tabs = [];
    let data = [];
    if (req.query?.q && req.query.q !== 'undefined') {
      console.log('API tableaux', req.query.q);
      tabs = allData.find((el) => el.idPaysage === req.query.q);
      data = allTabs.filter((el) => tabs.tableauxIds.includes(el.id));
    }

    res.json(data);
  });

export default router;
