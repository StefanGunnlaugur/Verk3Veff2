const express = require('express');

const moment = require('moment');

const api = express();

api.use(express.json());

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await readAll();
  if (!(Object.keys(result).length === 0)) {
    return res.json(result);
  }
  return res.status(404).json({ error: 'Not found' });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await readOne(parseInt(id, 10));
  if (result) {
    return res.json(result);
  }
  return res.status(404).json({ error: 'Not found' });
});


router.post('/', async (req, res) => {
  const title1 = req.body.title;
  const text1 = req.body.text;
  const datetime1 = req.body.datetime;
  const allData = await readAll();
  const nextId = await allData.map(i => i.id).reduce((a, b) => (a > b ? a : b + 1), 1);

  const errors = [];
  if (title1 === undefined || title1.length === 0 || title1.length > 255) {
    const err = {
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    };
    errors.push(err);
  }

  if (text1 === null || text1 === undefined) {
    const err = {
      field: 'text',
      error: 'text must be a string',
    };
    errors.push(err);
  }

  if (!(moment(datetime1, moment.ISO_8601, true).isValid())) {
    const err = {
      field: 'date',
      error: 'Datetime must be ISO 8601 date',
    };
    errors.push(err);
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const note = {
    title: title1,
    text: text1,
    datetime: datetime1,
  };

  await create(note);
  const newValue = await readOne(nextId);
  return res.status(201).json(newValue);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const title1 = req.body.title;
  const text1 = req.body.text;
  const datetime1 = req.body.datetime;
  const item = await readOne(parseInt(id, 10));

  const errors = [];
  if (title1 === undefined || title1.length === 0 || title1.lenght > 255) {
    const err = {
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    };
    errors.push(err);
  }

  if (text1 === undefined || text1 === null) {
    const err = {
      field: 'text',
      error: 'Text must be a string',
    };
    errors.push(err);
  }

  if (!(moment(datetime1, moment.ISO_8601, true).isValid())) {
    const err = {
      field: 'date',
      error: 'Datetime must be ISO 8601 date',
    };
    errors.push(err);
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  if (item) {
    item.title = title1;
    item.text = text1;
    item.datetime = datetime1;
    update(id, item);
    return res.status(200).json(item);
  }

  return res.status(404).json({ error: 'Not found' });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id, 10);
  const result = await readOne(idNum);

  if (result) {
    del(idNum);
    return res.status(204).end();
  }

  return res.status(404).json({ error: 'Not found' });
});

api.use(errorHandler);

module.exports = router;
