PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`username` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'CAMPER' NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`team_id` text,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "username", "password_hash", "role", "points", "team_id") SELECT "id", "name", "email", "username", "password_hash", "role", "points", "team_id" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;