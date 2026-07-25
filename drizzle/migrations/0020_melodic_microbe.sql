CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`file_key` text NOT NULL,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`caption` text,
	`uploaded_by_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
