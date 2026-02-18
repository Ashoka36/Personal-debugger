CREATE TABLE `gitlabTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`gitlabUrl` varchar(512) DEFAULT 'https://gitlab.com',
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `gitlabTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `gitlabTokens_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `repositorySyncs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sourceRepositoryId` int NOT NULL,
	`sourceType` varchar(64) NOT NULL,
	`targetType` varchar(64) NOT NULL,
	`targetRepoName` varchar(512) NOT NULL,
	`targetRepoUrl` varchar(512),
	`syncStatus` enum('pending','approved','syncing','completed','failed') DEFAULT 'pending',
	`approvalStatus` enum('pending','approved','rejected') DEFAULT 'pending',
	`approvedBy` varchar(255),
	`approvedAt` timestamp,
	`syncStartedAt` timestamp,
	`syncCompletedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repositorySyncs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `gitlabTokens` ADD CONSTRAINT `gitlabTokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repositorySyncs` ADD CONSTRAINT `repositorySyncs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repositorySyncs` ADD CONSTRAINT `repositorySyncs_sourceRepositoryId_repositories_id_fk` FOREIGN KEY (`sourceRepositoryId`) REFERENCES `repositories`(`id`) ON DELETE no action ON UPDATE no action;