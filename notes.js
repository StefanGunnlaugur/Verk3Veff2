/* todo sækja pakka sem vantar  */
const { Client } = require('pg');
const xss = require('xss');


const connectionString = process.env.DATABASE_URL || 'postgres://postgres:123@localhost/v2';

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  /* todo útfæra */
  try {
    const title1 = xss(title);
    const text1 = xss(text);
    const datetime1 = xss(datetime);
    const client = new Client({ connectionString });
    await client.connect();
    await client.query('INSERT INTO notes (title, text, datetime) VALUES ($1, $2, $3)', [title1, text1, datetime1]);
    await client.end();
  } catch (e) {
    console.error(e);
  }
}

async function fetchNotes() {
  let result = null;
  try {
    const client = new Client({ connectionString });
    await client.connect();
    result = await client.query('SELECT * FROM notes');
    await client.end();
  } catch (e) {
    console.error(e);
  }
  return result.rows;
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  /* todo útfæra */
  let data = null;
  try {
    data = await fetchNotes();
  } catch (e) {
    console.error(e);
  }
  return data;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  /* todo útfæra */
  let data = null;
  try {
    const client = new Client({ connectionString });
    await client.connect();
    data = await client.query('SELECT * FROM notes WHERE id = $1', [id]);
    await client.end();
  } catch (e) {
    console.error(e);
  }
  return data.rows[0];
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */

async function update(id, { title, text, datetime } = {}) {
  /* todo útfæra */
  try {
    const client = new Client({ connectionString });
    await client.connect();
    await client.query('Update notes SET title = $2, text = $3, datetime = $4 WHERE id = $1', [id, title, text, datetime]);
    await client.end();
  } catch (e) {
    console.error(e);
  }
  return readOne(id);
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  /* todo útfæra */
  let result = false;
  try {
    const client = new Client({ connectionString });
    await client.connect();
    await client.query('DELETE FROM notes WHERE id = $1', [id]);
    await client.end();
    result = true;
  } catch (e) {
    console.error(e);
  }
  return result;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
