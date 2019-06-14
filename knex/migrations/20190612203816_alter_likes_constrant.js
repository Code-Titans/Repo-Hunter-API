/* eslint-disable func-names, max-len */
const ON_INSERT_LIKE_FUNCTION = `
    CREATE OR REPLACE FUNCTION toggle_like(uid NUMERIC, rid NUMERIC)
    RETURNS RECORD AS $$
    DECLARE
        row_exists NUMERIC;
        likes_obj RECORD;
    BEGIN
        SELECT 1 INTO row_exists FROM likes WHERE user_id = uid and repo_id = rid;
        IF (row_exists > 0) THEN
            DELETE FROM likes WHERE user_id = uid AND repo_id = rid;
            SELECT COUNT(*) AS total_likes, 
            EXISTS(
                SELECT *
                FROM likes
                WHERE user_id = uid
                AND repo_id = rid
            ) AS liked INTO likes_obj
            FROM likes 
            WHERE repo_id = rid;
            RETURN likes_obj;
        ELSE
            INSERT INTO likes(user_id, repo_id) VALUES(uid, rid);
            SELECT COUNT(*) AS total_likes, 
            EXISTS(
                SELECT *
                FROM likes
                WHERE user_id = uid
                AND repo_id = rid
            ) AS liked INTO likes_obj FROM likes WHERE repo_id = rid;
            RETURN likes_obj;
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
