import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.join("db", "contacts.json");

/**
 * Gets all contacts from followed by path file
 * @returns {Promise<object[]>}
 */
async function listContacts() {
  return JSON.parse(await fs.readFile(contactsPath, "utf-8"));
}

/**
 * Gets contact by id or null if wasn't found
 * @param {string} contactId
 * @returns {Promise<object>} - Contact or null
 */
async function getContactById(contactId) {
  const allContacts = await listContacts();
  return allContacts.find((contact) => contact.id === contactId) || null;
}

/**
 * Removes a contact by it's id
 * @param {string} contactId
 * @returns removed contact or null if wasn't found
 */
async function removeContact(contactId) {
  const allContacts = await listContacts(); // Отримуємо всі контакти
  const contactIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    return null;
  }

  const [removedContact] = allContacts.splice(contactIndex, 1); // Видаляємо контакт за його індексом
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2)); // Перезаписуємо файл

  return removedContact;
}

/**
 * Creates a new contact
 * @param {string} name - name of a new contact
 * @param {string} email - email of a new contact
 * @param {string} phone - phone of a new contact
 * @returns new contact
 */
async function addContact(name, email, phone) {
  const allContacts = await listContacts(); // Отримуємо всі контакти
  const newContact = { id: nanoid(), name, email, phone }; // Створюємо новий контакт
  allContacts.push(newContact); // Додаємо новий контакт до масиву контактів
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2)); // Перезаписуємо файл
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
