CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`target_leader_id` text,
	`author_name` text,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`hidden_at` integer,
	`hidden_by_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_leader_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`hidden_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
