export const UPDATE_TIMESTAMP_PROCEDURE = `
CREATE OR REPLACE FUNCTION update_timestamp()
 RETURNS trigger AS $$
 BEGIN
  IF( TG_OP = 'UPDATE') THEN 
  UPDATE posts SET update_at = now();
  WHERE id = NEW.id
  return NEW
 END
 $$ LANGUAGE plpgsql;
`;

export const updateTimestampTrigger = (table) => `
DROP TRIGGER IF EXISTS on_update_${table}_update_timestamp ON posts
CREATE TRIGGER  on_update_post_update_timestamp
BEFORE UPDATE 
ON ${table} 
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
`;

exports.up = function (knex, Promise){
  return Promise.all([
    knex.raw(UPDATE_TIMESTAMP_PROCEDURE),
    knex.raw(updateTimestampTrigger('posts'))
  ])
};
