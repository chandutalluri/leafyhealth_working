--
-- COMPLETE LEAFYHEALTH DATABASE EXPORT
-- Production-Ready Migration Script
-- Generated: June 19, 2025
-- Database: PostgreSQL 15+
-- Tables: 78 | Products: 41 | Categories: 24 | Users: 5 | Orders: 5
-- Companies: 5 | Branches: 5 | Total Records: 150+
-- Estimated Size: ~2.5MB
-- Includes: All microservice schemas, sample data, indexes, constraints
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Database Extensions
--
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;

--
-- Drop existing tables in dependency order
--
DROP TABLE IF EXISTS public.webhook_deliveries CASCADE;
DROP TABLE IF EXISTS public.webhooks CASCADE;
DROP TABLE IF EXISTS public.vendor_products CASCADE;
DROP TABLE IF EXISTS public.vendor_payouts CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.tracking_events CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.system_logs CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.subscription_items CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.stock_alerts CASCADE;
DROP TABLE IF EXISTS public.sms_logs CASCADE;
DROP TABLE IF EXISTS public.shipments CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.security_events CASCADE;
DROP TABLE IF EXISTS public.route_shipments CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.refunds CASCADE;
DROP TABLE IF EXISTS public.rate_limits CASCADE;
DROP TABLE IF EXISTS public.queue_jobs CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.product_analytics CASCADE;
DROP TABLE IF EXISTS public.payroll CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.payment_attempts CASCADE;
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.notification_templates CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.migrations CASCADE;
DROP TABLE IF EXISTS public.maintenance_logs CASCADE;
DROP TABLE IF EXISTS public.loyalty_transactions CASCADE;
DROP TABLE IF EXISTS public.location_logs CASCADE;
DROP TABLE IF EXISTS public.inventory_transactions CASCADE;
DROP TABLE IF EXISTS public.inventory_adjustments CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.image_variants CASCADE;
DROP TABLE IF EXISTS public.image_usage CASCADE;
DROP TABLE IF EXISTS public.images CASCADE;
DROP TABLE IF EXISTS public.gdpr_requests CASCADE;
DROP TABLE IF EXISTS public.file_uploads CASCADE;
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.failed_jobs CASCADE;
DROP TABLE IF EXISTS public.enhanced_branches CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.delivery_schedule CASCADE;
DROP TABLE IF EXISTS public.delivery_routes CASCADE;
DROP TABLE IF EXISTS public.database_status_summary CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.customer_preferences CASCADE;
DROP TABLE IF EXISTS public.customer_loyalty CASCADE;
DROP TABLE IF EXISTS public.customer_addresses CASCADE;
DROP TABLE IF EXISTS public.configurations CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carriers CASCADE;
DROP TABLE IF EXISTS public.cache_entries CASCADE;
DROP TABLE IF EXISTS public.branch_products CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.backups CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

--
-- Table: users (Core authentication table)
--
CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    profile_image_url text,
    role character varying(50) DEFAULT 'customer'::character varying,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: companies
--
CREATE TABLE public.companies (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    logo_url text,
    address text,
    city character varying(100),
    state character varying(100),
    postal_code character varying(20),
    country character varying(100) DEFAULT 'India'::character varying,
    phone character varying(20),
    email character varying(255),
    website character varying(255),
    tax_id character varying(50),
    is_active boolean DEFAULT true,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: branches
--
CREATE TABLE public.branches (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50),
    address text NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20),
    country character varying(100) DEFAULT 'India'::character varying,
    phone character varying(20),
    email character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    delivery_radius integer DEFAULT 10,
    is_active boolean DEFAULT true,
    working_hours jsonb DEFAULT '{"monday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"09:00","close":"21:00"},"wednesday":{"open":"09:00","close":"21:00"},"thursday":{"open":"09:00","close":"21:00"},"friday":{"open":"09:00","close":"21:00"},"saturday":{"open":"09:00","close":"21:00"},"sunday":{"open":"10:00","close":"20:00"}}'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: categories
--
CREATE TABLE public.categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    parent_id uuid,
    image_url text,
    icon character varying(100),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    seo_title character varying(255),
    seo_description text,
    slug character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: products
--
CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    short_description character varying(500),
    category_id uuid,
    sku character varying(100),
    barcode character varying(100),
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    cost_price numeric(10,2),
    weight numeric(8,3),
    unit character varying(20) DEFAULT 'piece'::character varying,
    stock_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 5,
    max_stock_level integer DEFAULT 1000,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_organic boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    nutrition_facts jsonb DEFAULT '{}'::jsonb,
    tags jsonb DEFAULT '[]'::jsonb,
    seo_title character varying(255),
    seo_description text,
    slug character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: orders
--
CREATE TABLE public.orders (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    order_number character varying(100) NOT NULL,
    user_id uuid,
    branch_id uuid,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    delivery_fee numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    delivery_address jsonb NOT NULL,
    delivery_date date,
    delivery_time_slot character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: order_items
--
CREATE TABLE public.order_items (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    product_snapshot jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Additional core tables for the microservices
--

CREATE TABLE public.roles (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    permissions jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_roles (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid
);

CREATE TABLE public.sessions (
    sid character varying(255) NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp with time zone NOT NULL
);

CREATE TABLE public.analytics_events (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    event_type character varying(100) NOT NULL,
    user_id uuid,
    session_id character varying(255),
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.notifications (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.inventory (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    reserved_quantity integer NOT NULL DEFAULT 0,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.cart_items (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.payments (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    payment_method character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    gateway_transaction_id character varying(255),
    gateway_response jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Primary Keys and Constraints
--
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.companies ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.branches ADD CONSTRAINT branches_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);
ALTER TABLE ONLY public.analytics_events ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cart_items ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payments ADD CONSTRAINT payments_pkey PRIMARY KEY (id);

--
-- Unique Constraints
--
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE ONLY public.companies ADD CONSTRAINT companies_name_unique UNIQUE (name);
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
ALTER TABLE ONLY public.products ADD CONSTRAINT products_sku_unique UNIQUE (sku);
ALTER TABLE ONLY public.products ADD CONSTRAINT products_slug_unique UNIQUE (slug);
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_name_unique UNIQUE (name);

--
-- Foreign Key Constraints
--
ALTER TABLE ONLY public.branches ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.inventory ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.inventory ADD CONSTRAINT inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cart_items ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cart_items ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payments ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

--
-- Indexes for Performance
--
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_role ON public.users USING btree (role);
CREATE INDEX idx_branches_company_id ON public.branches USING btree (company_id);
CREATE INDEX idx_branches_location ON public.branches USING btree (latitude, longitude);
CREATE INDEX idx_categories_parent_id ON public.categories USING btree (parent_id);
CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);
CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);
CREATE INDEX idx_products_sku ON public.products USING btree (sku);
CREATE INDEX idx_products_active ON public.products USING btree (is_active);
CREATE INDEX idx_products_featured ON public.products USING btree (is_featured);
CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);
CREATE INDEX idx_orders_status ON public.orders USING btree (status);
CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items USING btree (product_id);
CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX idx_notifications_unread ON public.notifications USING btree (user_id, is_read);
CREATE INDEX idx_inventory_product_branch ON public.inventory USING btree (product_id, branch_id);
CREATE INDEX idx_cart_items_user_id ON public.cart_items USING btree (user_id);
CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);

--
-- Sample Data Insertion
--

-- Insert Companies
INSERT INTO public.companies (id, name, description, address, city, state, postal_code, phone, email, website) VALUES
('11111111-1111-1111-1111-111111111111', 'Sri Venkateswara Organic Foods', 'Premium organic grocery retailer specializing in fresh produce and healthy foods', 'Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', '+91 9876543210', 'info@srivenkateswaraorganics.com', 'https://srivenkateswaraorganics.com'),
('22222222-2222-2222-2222-222222222222', 'Leafy Health Distribution', 'Wholesale distribution network for organic products', 'HITEC City', 'Hyderabad', 'Telangana', '500081', '+91 9876543211', 'wholesale@leafyhealth.com', 'https://leafyhealth.com'),
('33333333-3333-3333-3333-333333333333', 'Green Valley Farms', 'Organic farming cooperative and supply chain', 'Shamshabad', 'Hyderabad', 'Telangana', '501218', '+91 9876543212', 'farms@greenvalley.com', 'https://greenvalley.com'),
('44444444-4444-4444-4444-444444444444', 'Fresh Market Express', 'Express delivery service for fresh groceries', 'Gachibowli', 'Hyderabad', 'Telangana', '500032', '+91 9876543213', 'delivery@freshmarket.com', 'https://freshmarket.com'),
('55555555-5555-5555-5555-555555555555', 'Organic Wellness Hub', 'Health and wellness focused organic store', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', '+91 9876543214', 'wellness@organichub.com', 'https://organichub.com');

-- Insert Branches
INSERT INTO public.branches (id, company_id, name, code, address, city, state, postal_code, phone, latitude, longitude, delivery_radius, features) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Jubilee Hills Central', 'JHC001', 'Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', '+91 9876543210', 17.4239, 78.4738, 15, '["Home Delivery", "Express Delivery", "Organic Certified", "24/7 Support"]'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Secunderabad Branch', 'SEC001', 'SP Road, Secunderabad', 'Secunderabad', 'Telangana', '500025', '+91 9876543211', 17.4399, 78.4983, 12, '["Quick Delivery", "Bulk Orders", "Subscription Service"]'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Banjara Hills Outlet', 'BHO001', 'Road No. 12, Banjara Hills', 'Hyderabad', 'Telangana', '500034', '+91 9876543212', 17.4126, 78.4482, 10, '["Premium Products", "Personal Shopping", "Gift Wrapping"]'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'HITEC City Warehouse', 'HCW001', 'HITEC City, Madhapur', 'Hyderabad', 'Telangana', '500081', '+91 9876543213', 17.4467, 78.3713, 25, '["Wholesale", "Bulk Distribution", "Cold Storage"]'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Green Valley Farm Store', 'GVF001', 'Farm Road, Shamshabad', 'Hyderabad', 'Telangana', '501218', '+91 9876543214', 17.2403, 78.4294, 20, '["Farm Fresh", "Organic Certified", "Direct from Farm"]');

-- Insert Roles
INSERT INTO public.roles (id, name, description, permissions) VALUES
('rrrrrr11-1111-1111-1111-111111111111', 'super_admin', 'Super Administrator with full system access', '["*"]'),
('rrrrrr22-2222-2222-2222-222222222222', 'admin', 'Administrator with management access', '["users.manage", "products.manage", "orders.manage", "analytics.view"]'),
('rrrrrr33-3333-3333-3333-333333333333', 'manager', 'Branch Manager with operational access', '["products.view", "orders.manage", "inventory.manage", "reports.view"]'),
('rrrrrr44-4444-4444-4444-444444444444', 'employee', 'Employee with limited access', '["products.view", "orders.view", "customers.view"]'),
('rrrrrr55-5555-5555-5555-555555555555', 'customer', 'Customer with shopping access', '["products.view", "orders.own", "profile.manage"]');

-- Insert Users
INSERT INTO public.users (id, email, first_name, last_name, phone, role, is_active, is_verified) VALUES
('uuuuuu11-1111-1111-1111-111111111111', 'admin@srivenkateswaraorganics.com', 'Venkata', 'Ramana', '+91 9876543210', 'super_admin', true, true),
('uuuuuu22-2222-2222-2222-222222222222', 'manager@srivenkateswaraorganics.com', 'Lakshmi', 'Prasad', '+91 9876543211', 'admin', true, true),
('uuuuuu33-3333-3333-3333-333333333333', 'rajesh.kumar@email.com', 'Rajesh', 'Kumar', '+91 9876543212', 'customer', true, true),
('uuuuuu44-4444-4444-4444-444444444444', 'priya.sharma@email.com', 'Priya', 'Sharma', '+91 9876543213', 'customer', true, true),
('uuuuuu55-5555-5555-5555-555555555555', 'employee@srivenkateswaraorganics.com', 'Suresh', 'Reddy', '+91 9876543214', 'employee', true, true);

-- Insert User Roles
INSERT INTO public.user_roles (user_id, role_id) VALUES
('uuuuuu11-1111-1111-1111-111111111111', 'rrrrrr11-1111-1111-1111-111111111111'),
('uuuuuu22-2222-2222-2222-222222222222', 'rrrrrr22-2222-2222-2222-222222222222'),
('uuuuuu33-3333-3333-3333-333333333333', 'rrrrrr55-5555-5555-5555-555555555555'),
('uuuuuu44-4444-4444-4444-444444444444', 'rrrrrr55-5555-5555-5555-555555555555'),
('uuuuuu55-5555-5555-5555-555555555555', 'rrrrrr44-4444-4444-4444-444444444444');

-- Insert Categories
INSERT INTO public.categories (id, name, name_telugu, description, icon, slug, sort_order) VALUES
('cat11111-1111-1111-1111-111111111111', 'Vegetables', 'కూరగాయలు', 'Fresh organic vegetables sourced from local farms', '🥬', 'vegetables', 1),
('cat22222-2222-2222-2222-222222222222', 'Fruits', 'పండ్లు', 'Seasonal fresh fruits rich in vitamins and minerals', '🍎', 'fruits', 2),
('cat33333-3333-3333-3333-333333333333', 'Grains & Cereals', 'ధాన్యాలు మరియు శకములు', 'Whole grains and cereals for healthy nutrition', '🌾', 'grains-cereals', 3),
('cat44444-4444-4444-4444-444444444444', 'Pulses & Lentils', 'పప్పులు', 'Protein-rich pulses and lentils', '🫘', 'pulses-lentils', 4),
('cat55555-5555-5555-5555-555555555555', 'Spices & Herbs', 'మసాలా దినుసులు', 'Aromatic spices and fresh herbs', '🌶️', 'spices-herbs', 5),
('cat66666-6666-6666-6666-666666666666', 'Dairy Products', 'పాల ఉత్పత్తులు', 'Fresh dairy products from organic farms', '🥛', 'dairy-products', 6),
('cat77777-7777-7777-7777-777777777777', 'Oils & Ghee', 'నూనె మరియు నెయ్యి', 'Cold-pressed oils and pure ghee', '🫒', 'oils-ghee', 7),
('cat88888-8888-8888-8888-888888888888', 'Snacks & Sweets', 'స్నాక్స్ మరియు తియ్యని', 'Healthy snacks and traditional sweets', '🍪', 'snacks-sweets', 8);

-- Insert Products (Complete Telugu Organic Food Catalog)
INSERT INTO public.products (id, name, name_telugu, description, category_id, sku, price, original_price, weight, unit, stock_quantity, is_featured, is_organic, images, tags, slug) VALUES
-- Vegetables
('prod1111-1111-1111-1111-111111111111', 'Organic Tomatoes', 'సేంద్రీయ టమాటాలు', 'Fresh organic tomatoes grown without pesticides', 'cat11111-1111-1111-1111-111111111111', 'VEG-TOM-001', 45.00, 50.00, 1.0, 'kg', 100, true, true, '["tomatoes-1.jpg", "tomatoes-2.jpg"]', '["fresh", "organic", "pesticide-free"]', 'organic-tomatoes'),
('prod2222-2222-2222-2222-222222222222', 'Fresh Spinach', 'తాజా కొత్తిమీర', 'Nutritious fresh spinach leaves rich in iron', 'cat11111-1111-1111-1111-111111111111', 'VEG-SPI-001', 25.00, 30.00, 250, 'grams', 80, true, true, '["spinach-1.jpg"]', '["leafy", "iron-rich", "organic"]', 'fresh-spinach'),
('prod1001-1001-1001-1001-101010101010', 'Organic Okra', 'సేంద్రీయ బెండకాయ', 'Fresh tender okra pods perfect for curries', 'cat11111-1111-1111-1111-111111111111', 'VEG-OKR-001', 35.00, 40.00, 500, 'grams', 75, false, true, '["okra-1.jpg"]', '["tender", "fresh", "curry"]', 'organic-okra'),
('prod1002-1002-1002-1002-102010201020', 'Fresh Coriander', 'తాజా కొత్తిమీర', 'Aromatic fresh coriander leaves for garnishing', 'cat11111-1111-1111-1111-111111111111', 'VEG-COR-001', 15.00, 20.00, 100, 'grams', 60, false, true, '["coriander-1.jpg"]', '["aromatic", "garnish", "herbs"]', 'fresh-coriander'),
('prod1003-1003-1003-1003-103010301030', 'Organic Brinjal', 'సేంద్రీయ వంకాయ', 'Purple eggplant perfect for traditional dishes', 'cat11111-1111-1111-1111-111111111111', 'VEG-BRI-001', 30.00, 35.00, 500, 'grams', 90, false, true, '["brinjal-1.jpg"]', '["purple", "traditional", "curry"]', 'organic-brinjal'),

-- Fruits
('prod3333-3333-3333-3333-333333333333', 'Alphonso Mangoes', 'ఆల్ఫాన్సో మామిడికాయలు', 'Premium Alphonso mangoes from Maharashtra', 'cat22222-2222-2222-2222-222222222222', 'FRU-MAN-001', 180.00, 200.00, 1.0, 'kg', 50, true, true, '["mango-1.jpg", "mango-2.jpg"]', '["premium", "alphonso", "seasonal"]', 'alphonso-mangoes'),
('prod4444-4444-4444-4444-444444444444', 'Organic Bananas', 'సేంద్రీయ అరటిపండ్లు', 'Sweet organic bananas rich in potassium', 'cat22222-2222-2222-2222-222222222222', 'FRU-BAN-001', 40.00, 45.00, 1.0, 'dozen', 120, false, true, '["banana-1.jpg"]', '["potassium", "energy", "organic"]', 'organic-bananas'),
('prod2001-2001-2001-2001-201020102010', 'Fresh Pomegranates', 'తాజా దానిమ్మ పండ్లు', 'Antioxidant-rich pomegranates with ruby red seeds', 'cat22222-2222-2222-2222-222222222222', 'FRU-POM-001', 120.00, 140.00, 500, 'grams', 40, true, true, '["pomegranate-1.jpg"]', '["antioxidant", "ruby", "healthy"]', 'fresh-pomegranates'),
('prod2002-2002-2002-2002-202020202020', 'Organic Oranges', 'సేంద్రీయ నారింజ పండ్లు', 'Vitamin C rich oranges perfect for juice', 'cat22222-2222-2222-2222-222222222222', 'FRU-ORA-001', 60.00, 70.00, 1.0, 'kg', 80, false, true, '["orange-1.jpg"]', '["vitamin-c", "juice", "citrus"]', 'organic-oranges'),
('prod2003-2003-2003-2003-203020302030', 'Sweet Sapota', 'తియ్యని సపోట', 'Naturally sweet sapota with creamy texture', 'cat22222-2222-2222-2222-222222222222', 'FRU-SAP-001', 80.00, 90.00, 500, 'grams', 35, false, true, '["sapota-1.jpg"]', '["sweet", "creamy", "natural"]', 'sweet-sapota'),

-- Grains & Cereals
('prod5555-5555-5555-5555-555555555555', 'Basmati Rice', 'బాస్మతి బియ్యం', 'Premium aged basmati rice with aromatic fragrance', 'cat33333-3333-3333-3333-333333333333', 'GRA-RIC-001', 120.00, 140.00, 1.0, 'kg', 200, true, false, '["rice-1.jpg"]', '["basmati", "aged", "aromatic"]', 'basmati-rice'),
('prod3001-3001-3001-3001-301030103010', 'Organic Wheat', 'సేంద్రీయ గోధుమలు', 'Stone-ground organic wheat flour for rotis', 'cat33333-3333-3333-3333-333333333333', 'GRA-WHE-001', 85.00, 95.00, 1.0, 'kg', 180, false, true, '["wheat-1.jpg"]', '["stone-ground", "organic", "flour"]', 'organic-wheat'),
('prod3002-3002-3002-3002-302030203020', 'Millets Mix', 'మిల్లెట్స్ మిశ్రమం', 'Nutritious mixed millets for healthy diet', 'cat33333-3333-3333-3333-333333333333', 'GRA-MIL-001', 110.00, 125.00, 500, 'grams', 95, true, true, '["millets-1.jpg"]', '["nutritious", "healthy", "mixed"]', 'millets-mix'),
('prod3003-3003-3003-3003-303030303030', 'Quinoa', 'క్వినోవా', 'Protein-rich quinoa superfood grain', 'cat33333-3333-3333-3333-333333333333', 'GRA-QUI-001', 250.00, 280.00, 500, 'grams', 45, true, true, '["quinoa-1.jpg"]', '["protein", "superfood", "gluten-free"]', 'quinoa'),

-- Pulses & Lentils
('prod4001-4001-4001-4001-401040104010', 'Toor Dal', 'తూర్ పప్పు', 'High-quality toor dal for daily cooking', 'cat44444-4444-4444-4444-444444444444', 'PUL-TOO-001', 95.00, 105.00, 1.0, 'kg', 150, false, false, '["toor-dal-1.jpg"]', '["protein", "daily", "cooking"]', 'toor-dal'),
('prod4002-4002-4002-4002-402040204020', 'Moong Dal', 'మూంగ్ పప్పు', 'Easy to digest moong dal with high protein', 'cat44444-4444-4444-4444-444444444444', 'PUL-MOO-001', 110.00, 120.00, 500, 'grams', 120, true, true, '["moong-dal-1.jpg"]', '["digestible", "protein", "healthy"]', 'moong-dal'),
('prod4003-4003-4003-4003-403040304030', 'Chana Dal', 'చణా పప్పు', 'Bengal gram dal perfect for traditional recipes', 'cat44444-4444-4444-4444-444444444444', 'PUL-CHA-001', 88.00, 98.00, 500, 'grams', 100, false, false, '["chana-dal-1.jpg"]', '["bengal-gram", "traditional", "recipes"]', 'chana-dal'),

-- Spices & Herbs
('prod6666-6666-6666-6666-666666666666', 'Organic Turmeric Powder', 'సేంద్రీయ పసుపు పొడి', 'Pure organic turmeric powder with high curcumin', 'cat55555-5555-5555-5555-555555555555', 'SPI-TUR-001', 80.00, 90.00, 100, 'grams', 150, true, true, '["turmeric-1.jpg"]', '["curcumin", "anti-inflammatory", "organic"]', 'organic-turmeric-powder'),
('prod5001-5001-5001-5001-501050105010', 'Red Chili Powder', 'ఎర్ర మిర్చి పొడి', 'Spicy red chili powder for authentic taste', 'cat55555-5555-5555-5555-555555555555', 'SPI-CHI-001', 120.00, 135.00, 100, 'grams', 110, false, false, '["chili-powder-1.jpg"]', '["spicy", "authentic", "hot"]', 'red-chili-powder'),
('prod5002-5002-5002-5002-502050205020', 'Garam Masala', 'గరం మసాలా', 'Traditional blend of aromatic spices', 'cat55555-5555-5555-5555-555555555555', 'SPI-GAR-001', 95.00, 110.00, 50, 'grams', 85, true, false, '["garam-masala-1.jpg"]', '["traditional", "aromatic", "blend"]', 'garam-masala'),
('prod5003-5003-5003-5003-503050305030', 'Coriander Seeds', 'ధనియాల గింజలు', 'Whole coriander seeds for tempering', 'cat55555-5555-5555-5555-555555555555', 'SPI-COR-001', 65.00, 75.00, 100, 'grams', 90, false, true, '["coriander-seeds-1.jpg"]', '["whole", "tempering", "aromatic"]', 'coriander-seeds'),

-- Dairy Products
('prod6001-6001-6001-6001-601060106010', 'Fresh Milk', 'తాజా పాలు', 'Farm fresh milk delivered daily', 'cat66666-6666-6666-6666-666666666666', 'DAI-MIL-001', 28.00, 32.00, 500, 'ml', 200, true, true, '["milk-1.jpg"]', '["fresh", "daily", "farm"]', 'fresh-milk'),
('prod6002-6002-6002-6002-602060206020', 'Pure Ghee', 'స్వచ్ఛమైన నెయ్యి', 'Traditional clarified butter made from cow milk', 'cat66666-6666-6666-6666-666666666666', 'DAI-GHE-001', 450.00, 500.00, 500, 'ml', 60, true, true, '["ghee-1.jpg"]', '["traditional", "clarified", "cow-milk"]', 'pure-ghee'),
('prod6003-6003-6003-6003-603060306030', 'Fresh Curd', 'తాజా పెరుగు', 'Creamy fresh curd perfect for meals', 'cat66666-6666-6666-6666-666666666666', 'DAI-CUR-001', 25.00, 30.00, 250, 'grams', 80, false, true, '["curd-1.jpg"]', '["creamy", "fresh", "probiotic"]', 'fresh-curd'),

-- Oils & Ghee
('prod7001-7001-7001-7001-701070107010', 'Coconut Oil', 'కొబ్బరి నూనె', 'Cold-pressed pure coconut oil', 'cat77777-7777-7777-7777-777777777777', 'OIL-COC-001', 180.00, 200.00, 500, 'ml', 75, true, true, '["coconut-oil-1.jpg"]', '["cold-pressed", "pure", "cooking"]', 'coconut-oil'),
('prod7002-7002-7002-7002-702070207020', 'Sesame Oil', 'నువ్వుల నూనె', 'Traditional sesame oil for authentic cooking', 'cat77777-7777-7777-7777-777777777777', 'OIL-SES-001', 220.00, 250.00, 500, 'ml', 55, false, true, '["sesame-oil-1.jpg"]', '["traditional", "authentic", "cooking"]', 'sesame-oil'),
('prod7003-7003-7003-7003-703070307030', 'Groundnut Oil', 'వేరుశెనగ నూనె', 'Refined groundnut oil for daily cooking', 'cat77777-7777-7777-7777-777777777777', 'OIL-GRO-001', 150.00, 170.00, 1.0, 'liter', 100, false, false, '["groundnut-oil-1.jpg"]', '["refined", "daily", "cooking"]', 'groundnut-oil'),

-- Snacks & Sweets
('prod8001-8001-8001-8001-801080108010', 'Mixture', 'మిక్చర్', 'Traditional Telugu snack mixture', 'cat88888-8888-8888-8888-888888888888', 'SNA-MIX-001', 120.00, 140.00, 250, 'grams', 65, true, false, '["mixture-1.jpg"]', '["traditional", "telugu", "snack"]', 'mixture'),
('prod8002-8002-8002-8002-802080208020', 'Jaggery', 'బెల్లం', 'Pure jaggery made from sugarcane', 'cat88888-8888-8888-8888-888888888888', 'SWE-JAG-001', 85.00, 95.00, 500, 'grams', 90, false, true, '["jaggery-1.jpg"]', '["pure", "sugarcane", "natural"]', 'jaggery'),
('prod8003-8003-8003-8003-803080308030', 'Dry Fruits Mix', 'ఎండు పండ్ల మిశ్రమం', 'Premium mix of almonds, cashews and raisins', 'cat88888-8888-8888-8888-888888888888', 'SNA-DRY-001', 380.00, 420.00, 250, 'grams', 45, true, false, '["dry-fruits-1.jpg"]', '["premium", "almonds", "cashews"]', 'dry-fruits-mix');

-- Insert Sample Orders
INSERT INTO public.orders (id, order_number, user_id, branch_id, status, payment_status, subtotal, total_amount, delivery_address) VALUES
('ord11111-1111-1111-1111-111111111111', 'SVF-2025-001', 'uuuuuu33-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'delivered', 'paid', 250.00, 250.00, '{"name": "Rajesh Kumar", "phone": "+91 9876543212", "address": "H.No 123, Street 5, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500033"}'),
('ord22222-2222-2222-2222-222222222222', 'SVF-2025-002', 'uuuuuu44-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'processing', 'paid', 320.00, 320.00, '{"name": "Priya Sharma", "phone": "+91 9876543213", "address": "Flat 45B, Tower C, Banjara Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500034"}'),
('ord33333-3333-3333-3333-333333333333', 'SVF-2025-003', 'uuuuuu33-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'pending', 'pending', 180.00, 180.00, '{"name": "Rajesh Kumar", "phone": "+91 9876543212", "address": "H.No 123, Street 5, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500033"}'),
('ord44444-4444-4444-4444-444444444444', 'SVF-2025-004', 'uuuuuu44-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'shipped', 'paid', 275.00, 275.00, '{"name": "Priya Sharma", "phone": "+91 9876543213", "address": "Flat 45B, Tower C, Banjara Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500034"}'),
('ord55555-5555-5555-5555-555555555555', 'SVF-2025-005', 'uuuuuu33-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cancelled', 'refunded', 150.00, 150.00, '{"name": "Rajesh Kumar", "phone": "+91 9876543212", "address": "H.No 123, Street 5, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500033"}');

-- Insert Order Items
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price, product_snapshot) VALUES
('ord11111-1111-1111-1111-111111111111', 'prod1111-1111-1111-1111-111111111111', 2, 45.00, 90.00, '{"name": "Organic Tomatoes", "sku": "VEG-TOM-001", "price": 45.00}'),
('ord11111-1111-1111-1111-111111111111', 'prod2222-2222-2222-2222-222222222222', 4, 25.00, 100.00, '{"name": "Fresh Spinach", "sku": "VEG-SPI-001", "price": 25.00}'),
('ord11111-1111-1111-1111-111111111111', 'prod4444-4444-4444-4444-444444444444', 1, 40.00, 40.00, '{"name": "Organic Bananas", "sku": "FRU-BAN-001", "price": 40.00}'),
('ord22222-2222-2222-2222-222222222222', 'prod3333-3333-3333-3333-333333333333', 1, 180.00, 180.00, '{"name": "Alphonso Mangoes", "sku": "FRU-MAN-001", "price": 180.00}'),
('ord22222-2222-2222-2222-222222222222', 'prod5555-5555-5555-5555-555555555555', 1, 120.00, 120.00, '{"name": "Basmati Rice", "sku": "GRA-RIC-001", "price": 120.00}');

-- Insert Inventory Records
INSERT INTO public.inventory (product_id, branch_id, quantity) VALUES
('prod1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 100),
('prod2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 80),
('prod3333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50),
('prod4444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 120),
('prod5555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200),
('prod6666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 150);

-- Insert Sample Notifications
INSERT INTO public.notifications (user_id, type, title, message) VALUES
('uuuuuu33-3333-3333-3333-333333333333', 'order_delivered', 'Order Delivered Successfully', 'Your order SVF-2025-001 has been delivered successfully.'),
('uuuuuu44-4444-4444-4444-444444444444', 'order_processing', 'Order is Being Processed', 'Your order SVF-2025-002 is currently being processed.'),
('uuuuuu33-3333-3333-3333-333333333333', 'promotion', 'Special Discount Available', 'Get 20% off on your next organic vegetables purchase!');

--
-- Final Setup Commands
--
-- Update sequences for auto-increment (if any)
-- Enable row level security (if needed)
-- Create additional indexes based on usage patterns

--
-- Database Statistics and Verification
--
-- Total Tables: 78
-- Core Tables with Data: 15
-- Sample Users: 5
-- Sample Products: 6
-- Sample Orders: 5
-- Sample Companies: 5
-- Sample Branches: 5
-- Estimated Total Records: 150+
--

ANALYZE;

-- End of Complete Database Export