INSERT INTO `stations` (`id`, `name`, `description`, `created_by_id`, `created_at`)
SELECT '55555555-5555-4555-8555-555555555555', 'Media', NULL, `id`, unixepoch() * 1000 FROM `users` WHERE `role` = 'ADMIN' LIMIT 1;
