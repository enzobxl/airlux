-- Inserting test data into raspberries table
INSERT INTO `raspberries` (`id`, `mac_address`, `ssh_key`, `last_ping_at`, `created_at`, `updated_at`) VALUES
    ('123e4567-e89b-12d3-a456-426614174000', '28:CD:C1:DD:EE:FF', 'ssh-rsa AAAAB3Nza...', NULL, NOW(), NOW()),
    ('123e4567-e89b-12d3-a456-426614174001', '28:CD:C1:CC:BB:AA', 'ssh-rsa AAAAC3NzB...', NOW(), NOW(), NOW());

-- Inserting test data into ports table
INSERT INTO `ports` (`id`, `port_number`, `raspberry_id`, `created_at`, `updated_at`) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 8080, '123e4567-e89b-12d3-a456-426614174000', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440001', 8081, NULL, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 8082, '123e4567-e89b-12d3-a456-426614174001', NOW(), NOW());