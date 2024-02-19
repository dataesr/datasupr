import express from 'express';

const router = new express.Router();

// const allData = [
//   { idPaysage: "G2qA7", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc", "msca"] },
//   { idPaysage: "FRAFR", tableauxIds: ["european-projects", "tableau-de-bord-financier", "erc", "atlas"] },
//   { idPaysage: "DEUDE", tableauxIds: ["european-projects"] },
// ];

const allTabs = [
  { label: "Projets européens", id: "european-projects", description: "description du tableau de bord desprojets européens", tags: ["Recherche"] },
  { label: "tableau de bord financier", id: "tableau-de-bord-financier", description: "description du tableau de bord financier", tags: ["Enseignement supérieur"] },
  { label: "ERC", id: "erc", description: "description du tableau de bord des ERC", tags: ["Recherche"] },
  { label: "MSCA", id: "msca", description: "description du tableau de bord des MSCA", tags: ["Recherche"] },
  {
    description: "L’Atlas des effectifs étudiants est un outil indispensable pour une bonne appréhension de la structuration territoriale de l’enseignement supérieur et pour l’élaboration de stratégies territoriales. Il présente, sous forme de cartes, de graphiques et de tableaux, la diversité du système français d’enseignement supérieur.",
    id: "atlas",
    label: "Atlas des effecifs étudiants",
    public: true,
    searchDescription: "Atlas des effectifs étudiants en France",
    tags: ["enseignement supérieur", "atlas", "france"],
    url: '/atlas',
  },
  {
    description: "Quelques graphiques basés sur les données Open Alex",
    id: "open-alex",
    label: "Open Alex",
    public: false,
    searchDescription: "Description du tableau de bord Open Alex",
    tags: ["open alex", "open science", "science ouverte", "bibliométrie"],
    url: '/open-alex',
  },
]

router.route('/tableaux')
  .get((req, res) => {
    let tabs = [];
    let data = [];
    if (req.query?.tag && req.query.tag !== 'undefined') {
      data = allTabs.filter((el) => el.tags.includes(req.query.tag));
    }
    res.json(data);
  });

export default router;
