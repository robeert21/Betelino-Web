INSERT INTO `stations` (`id`, `name`, `description`, `created_by_id`, `created_at`)
SELECT '11111111-1111-4111-8111-111111111111', 'Lecție Biblică', NULL, `id`, unixepoch() * 1000 FROM `users` WHERE `role` = 'ADMIN' LIMIT 1;
--> statement-breakpoint
INSERT INTO `stations` (`id`, `name`, `description`, `created_by_id`, `created_at`)
SELECT '22222222-2222-4222-8222-222222222222', 'Verset', NULL, `id`, unixepoch() * 1000 FROM `users` WHERE `role` = 'ADMIN' LIMIT 1;
--> statement-breakpoint
INSERT INTO `stations` (`id`, `name`, `description`, `created_by_id`, `created_at`)
SELECT '33333333-3333-4333-8333-333333333333', 'Lucru Manual', NULL, `id`, unixepoch() * 1000 FROM `users` WHERE `role` = 'ADMIN' LIMIT 1;
--> statement-breakpoint
INSERT INTO `stations` (`id`, `name`, `description`, `created_by_id`, `created_at`)
SELECT '44444444-4444-4444-8444-444444444444', 'Jocuri', NULL, `id`, unixepoch() * 1000 FROM `users` WHERE `role` = 'ADMIN' LIMIT 1;
