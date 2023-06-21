const { readFile, writeFile } = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join("db", "contacts.json");

/**
 * @param {}
 * @returns {array}
 */
async function listContacts() {
  try {
    const contacts = await readFile(contactsPath);
    const jsonContacts = JSON.parse(contacts);

    console.table(jsonContacts);
    return jsonContacts;
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} - contactId - id of contact
 * @returns {object}
 */
async function getContactById(contactId) {
  const allContacts = await readFile(contactsPath);

  const jsonContacts = JSON.parse(allContacts);

  const curContact = jsonContacts.find((contact) => contact.id === contactId);

  if (curContact === undefined) {
    console.log(null);
    return null;
  }

  console.log(curContact);
  return curContact;
}

/**
 * @param {string} - contactId - id of contact
 * @returns {object}
 */
async function removeContact(contactId) {
  const newPathFile = path.join("db", "newContacts.json");
  let removedContact = null;

  const allContacts = await readFile(contactsPath);
  const jsonContacts = JSON.parse(allContacts);

  const newContacts = jsonContacts.filter((contact) => {
    if (contact.id === contactId) {
      removedContact = contact;
    }
    return contact.id !== contactId;
  });

  if (newContacts.length === jsonContacts.length) {
    console.log(null);
    return null;
  }

  await writeFile(newPathFile, JSON.stringify(newContacts));

  const removedContacts = await readFile(newPathFile);

  console.log(removedContact);

  return removedContact;
}

/**
 * @param {string, string, string} - name of contact, email of contact, phone number of contact
 * @returns {object}
 */
async function addContact(name, email, phone) {
  const newPathFile = path.join("db", "newContacts.json");
  const createdContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  try {
    const allContacts = await readFile(contactsPath);
    const parsedContacts = JSON.parse(allContacts);

    parsedContacts.push(createdContact);
    await writeFile(newPathFile, JSON.stringify(parsedContacts));

    const newContacts = await readFile(newPathFile);
    const newParsedContacts = JSON.parse(newContacts);

    console.log(createdContact);
    return createdContact;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
