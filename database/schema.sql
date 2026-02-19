-- SparkAI On-Demand Service Application
-- Database Schema for MySQL 8.0+
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS sparkai_db;
USE sparkai_db;

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE roles (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('user', 'Regular customer who books services'),
('provider', 'Service provider who fulfills bookings'),
('admin', 'Administrator with full system access');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id           INT UNSIGNED NOT NULL,
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL UNIQUE,
    phone             VARCHAR(20) UNIQUE,
    password          VARCHAR(255) NOT NULL,
    avatar            VARCHAR(500) DEFAULT NULL,
    address           TEXT DEFAULT NULL,
    lat               DECIMAL(10, 8) DEFAULT NULL,
    lng               DECIMAL(11, 8) DEFAULT NULL,
    is_active         BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role_id),
    INDEX idx_users_active (is_active)
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    image       VARCHAR(500) DEFAULT NULL,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_sort (sort_order)
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id      INT UNSIGNED NOT NULL,
    name             VARCHAR(150) NOT NULL,
    description      TEXT DEFAULT NULL,
    price            DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    image            VARCHAR(500) DEFAULT NULL,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_services_category (category_id),
    INDEX idx_services_active (is_active)
);

-- ============================================
-- PROVIDER PROFILES TABLE
-- ============================================
CREATE TABLE provider_profiles (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id          INT UNSIGNED NOT NULL UNIQUE,
    bio              TEXT DEFAULT NULL,
    experience_years INT DEFAULT 0,
    rating           DECIMAL(3, 2) DEFAULT 0.00,
    total_jobs       INT DEFAULT 0,
    is_available     BOOLEAN DEFAULT TRUE,
    verified         BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_provider_available (is_available),
    INDEX idx_provider_rating (rating)
);

-- ============================================
-- PROVIDER SERVICES (Junction Table)
-- ============================================
CREATE TABLE provider_services (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    provider_id  INT UNSIGNED NOT NULL,
    service_id   INT UNSIGNED NOT NULL,
    custom_price DECIMAL(10, 2) DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY uk_provider_service (provider_id, service_id)
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    provider_id     INT UNSIGNED DEFAULT NULL,
    service_id      INT UNSIGNED NOT NULL,
    status          ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')
                        NOT NULL DEFAULT 'pending',
    scheduled_date  DATE NOT NULL,
    scheduled_time  TIME NOT NULL,
    address         TEXT NOT NULL,
    lat             DECIMAL(10, 8) DEFAULT NULL,
    lng             DECIMAL(11, 8) DEFAULT NULL,
    notes           TEXT DEFAULT NULL,
    total_price     DECIMAL(10, 2) NOT NULL,
    payment_status  ENUM('pending', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'pending',
    cancelled_by    ENUM('user', 'provider', 'admin') DEFAULT NULL,
    cancel_reason   TEXT DEFAULT NULL,
    started_at      TIMESTAMP DEFAULT NULL,
    completed_at    TIMESTAMP DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_provider (provider_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_date (scheduled_date)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id  INT UNSIGNED NOT NULL UNIQUE,
    user_id     INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL,
    comment     TEXT DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE,
    INDEX idx_reviews_provider (provider_id),
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id      INT UNSIGNED NOT NULL,
    amount          DECIMAL(10, 2) NOT NULL,
    method          ENUM('card', 'upi', 'wallet', 'cash', 'net_banking') NOT NULL DEFAULT 'cash',
    status          ENUM('pending', 'processing', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    transaction_id  VARCHAR(255) DEFAULT NULL,
    paid_at         TIMESTAMP DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    INDEX idx_payments_booking (booking_id),
    INDEX idx_payments_status (status)
);
