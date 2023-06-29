import express from 'express';

const router = new express.Router();

router.route('/tableaux')
  .get((req, res) => {
    res.json([
      { label: "Projets européens", id: "european-projects", description: "description du tableau de bord desprojets européens", tags: ["Recherche"] },
      { label: "tableau de bord financier", id: "tableau-de-bord-financier", description: "description du tableau de bord financier", tags: ["Enseignement supérieur"] },
      { label: "ERC", id: "erc", description: "description du tableau de bord des ERC", tags: ["Recherche"] },
      { label: "MSCA", id: "msca", description: "description du tableau de bord des MSCA", tags: ["Recherche"] },
    ]);
  });

export default router;
