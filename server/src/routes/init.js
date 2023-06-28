import express from 'express';

const router = new express.Router();

router.route('/init')
  .get((req, res) => {
    res.json({
      options: {
        title: 'Doadify',
        description: 'Doadify API 2',
        version: '1.0.0',
        elements: [
          {
            id: 'HomeId',
            title: 'Home',
            description: 'Home page',
            path: '/',
            children: ['RechercheID', 'EnseignementSupId'],
            level: 1,
          },
          {
            id: 'RechercheID',
            title: 'Recherche',
            description: 'Page de la recherche',
            path: '/recherche',
            children: ['ProjectId'],
            level: 2,
          },
          {
            id: 'EnseignementSupId',
            title: 'Enseignement supérieur',
            description: "Page de l'enseignement supérieur",
            path: '/enseignement-superieur',
            children: ['FinanceId', 'StudentId'],
            level: 2,
          },
        ],
      },
    });
  });

export default router;
