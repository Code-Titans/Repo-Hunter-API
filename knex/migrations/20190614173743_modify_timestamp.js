/* eslint-disable func-names, max-len */
function onUpdateTrigger(table) {
  return (`
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `);
}
const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger
    AS $BODY$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $BODY$ language 'plpgsql';
  `;

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION),
    knex.raw(onUpdateTrigger('users')),
    knex.raw(onUpdateTrigger('likes')),
    knex.raw(onUpdateTrigger('followers')),
    knex.raw(onUpdateTrigger('posts')),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.raw('DELETE FUNCTION on_update_timestamp'),
  ]);
};
