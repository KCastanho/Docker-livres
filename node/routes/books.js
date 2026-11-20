
const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

const validId = (value) => Number.isSafeInteger(value) && value > 0;
const validText = (value) => typeof value === 'string' && value.trim().length > 0;
const validContent = (body) =>
  body && validText(body.title) && validText(body.author) && validId(body.page);

// GET : récupérer tous les livres
router.get('/', async (req, res) => {
  const books = await Book.find().sort({ id: 1 });
  res.json(books);
});

// GET : récupérer un livre par son ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!validId(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const book = await Book.findOne({ id });

  if (!book) {
    return res.status(404).json({ error: 'Livre introuvable' });
  }

  res.json(book);
});

// POST : ajouter un livre
router.post('/', async (req, res) => {
  if (!validContent(req.body) || !validId(req.body.id)) {
    return res.status(400).json({
      error: 'Champs requis : id, title, author et page',
    });
  }

  if (await Book.exists({ id: req.body.id })) {
    return res.status(409).json({ error: 'Cet ID existe déjà' });
  }

  const book = await Book.create({
    id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    page: req.body.page,
  });

  res.status(201).json(book);
});

// PUT : modifier un livre
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!validId(id) || !validContent(req.body)) {
    return res.status(400).json({
      error: 'ID, titre, auteur ou nombre de pages invalide',
    });
  }

  if (req.body.id !== undefined && req.body.id !== id) {
    return res.status(400).json({
      error: "L'ID du livre ne peut pas être modifié",
    });
  }

  const book = await Book.findOneAndUpdate(
    { id },
    {
      title: req.body.title,
      author: req.body.author,
      page: req.body.page,
    },
    { new: true, runValidators: true }
  );

  if (!book) {
    return res.status(404).json({ error: 'Livre introuvable' });
  }

  res.json(book);
});

// DELETE : supprimer un livre
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!validId(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const book = await Book.findOneAndDelete({ id });

  if (!book) {
    return res.status(404).json({ error: 'Livre introuvable' });
  }

  res.status(204).send();
});

module.exports = router;
