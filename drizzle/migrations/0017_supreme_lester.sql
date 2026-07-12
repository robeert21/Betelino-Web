CREATE TABLE `station_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`station_id` text NOT NULL,
	`name` text NOT NULL,
	`created_by_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `station_materials` ADD `folder_id` text REFERENCES station_folders(id);