/* eslint-disable func-names, max-len */
const ON_INSERT_LIKE_FUNCTION = `
    CREATE OR REPLACE FUNCTION toggle_like(uid NUMERIC, rid NUMERIC)
    RETURNS NUMERIC AS $$
    DECLARE
        row_exists NUMERIC;
    BEGIN
        SELECT 1 INTO row_exists FROM likes WHERE user_id = uid and repo_id = rid;
        IF (row_exists > 0) THEN
            DELETE FROM likes WHERE user_id = uid AND repo_id = rid;
            RETURN 0;
        ELSE
            INSERT INTO likes(user_id, repo_id) VALUES(uid, rid);
            RETURN 1;
        END IF;
    END;
    $$
    LANGUAGE plpgsql;
`;

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('likes', (table) => {
      table.unique(['user_id', 'repo_id']);
    }),
    knex.raw(ON_INSERT_LIKE_FUNCTION),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw('DROP FUNCTION toggle_like(uid NUMERIC, rid NUMERIC)'),
    knex.schema.alterTable('likes', (table) => {
      table.dropUnique(['user_id', 'repo_id']);
    }),
  ]);
};
