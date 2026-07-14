ALTER TABLE `point_logs` ADD `canceled_at` integer;--> statement-breakpoint
ALTER TABLE `point_logs` ADD `canceled_by_id` text REFERENCES users(id);