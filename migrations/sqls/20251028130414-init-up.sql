CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(255) UNIQUE NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_image TEXT,
	created_on TIMESTAMP DEFAULT NOW(),
	updated_on TIMESTAMP
);

CREATE TABLE services (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	service_code VARCHAR(255) UNIQUE NOT NULL,
	service_name VARCHAR(255) NOT NULL,
	service_icon TEXT NOT NULL,
	description TEXT NOT NULL,
	service_tariff INT,
	created_on TIMESTAMP DEFAULT NOW(),
	updated_on TIMESTAMP
);

CREATE TABLE banner (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	banner_name VARCHAR(255) NOT NULL,
	banner_image TEXT NOT NULL,
	description TEXT NOT NULL,
	created_on TIMESTAMP DEFAULT NOW(),
	updated_on TIMESTAMP
);

CREATE TABLE transactions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(255) REFERENCES users(email),
	service_code VARCHAR(255) REFERENCES services(service_code),
	invoice_number VARCHAR(255) UNIQUE NOT NULL,
	transaction_type VARCHAR(255) NOT NULL,
	total_amount INT NOT NULL,
	created_on TIMESTAMP DEFAULT NOW(),
	updated_on TIMESTAMP
);

INSERT INTO services(service_code, service_name, service_icon, description, service_tariff) VALUES
('TOPUP', 'TOPUP', 'https://nutech-integrasi.app/dummy.jpg', 'Top Up balance', null),
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 'Pajak PBB', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 'Listrik', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 'PDAM Berlangganan', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 'Pulsa', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 'PGN Berlangganan', 50000),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 'Musik Berlangganan', 50000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 'TV Berlangganan', 50000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 'Paket data', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 'Voucher Game', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 'Voucher Makanan', 100000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 'Qurban', 200000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 'Zakat', 300000);

INSERT INTO banner(banner_name, banner_image, description) VALUES
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');