-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100),
    "category" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_availability" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "available" BOOLEAN DEFAULT true,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "min_nights" INTEGER DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancellation_rules" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "days_before" INTEGER NOT NULL,
    "refund_percentage" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancellation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "reservation_id" INTEGER,
    "property_id" INTEGER,
    "message" TEXT NOT NULL,
    "sent_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMPTZ(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "reference_url" TEXT,
    "reference_id" INTEGER,
    "read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(50) DEFAULT 'pending',
    "platform_fee" DECIMAL(10,2) DEFAULT 0.00,
    "host_amount" DECIMAL(10,2) DEFAULT 0.00,
    "transaction_number" VARCHAR(100),
    "payment_gateway_response" TEXT,
    "refund_amount" DECIMAL(10,2) DEFAULT 0.00,
    "refund_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) DEFAULT 'Loja',
    "province" VARCHAR(100) DEFAULT 'Loja',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "num_guests" INTEGER NOT NULL DEFAULT 1,
    "num_rooms" INTEGER NOT NULL DEFAULT 1,
    "num_beds" INTEGER NOT NULL DEFAULT 1,
    "num_bathrooms" INTEGER NOT NULL DEFAULT 1,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "cancellation_rule_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "property_type" VARCHAR(50) DEFAULT 'apartment',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "publication_status" VARCHAR(50) DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "amenity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_main" BOOLEAN DEFAULT false,
    "display_order" INTEGER DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_phones" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "num_guests" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "cancellation_reason" TEXT,
    "cancelled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "cleanliness" INTEGER,
    "communication" INTEGER,
    "location" INTEGER,
    "value_for_money" INTEGER,
    "host_response" TEXT,
    "host_response_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "device_info" TEXT,
    "ip_address" INET,
    "user_agent" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "last_activity" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "surname" VARCHAR(150),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password" TEXT,
    "avatar_url" TEXT,
    "auth_provider" VARCHAR(50) NOT NULL DEFAULT 'local',
    "is_active" BOOLEAN DEFAULT true,
    "role_id" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_subscriptions" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "plan_price" DECIMAL(10,2) DEFAULT 3.00,
    "starts_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "auto_renew" BOOLEAN DEFAULT false,
    "payment_method" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "payment_transaction_id" VARCHAR(255),

    CONSTRAINT "property_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "idx_amenities_category" ON "amenities"("category");

-- CreateIndex
CREATE INDEX "idx_amenities_name" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "idx_audit_logs_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity_id" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity_type" ON "audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_calendar_available" ON "calendar_availability"("property_id", "available");

-- CreateIndex
CREATE INDEX "idx_calendar_date" ON "calendar_availability"("date");

-- CreateIndex
CREATE INDEX "idx_calendar_property_date_range" ON "calendar_availability"("property_id", "date");

-- CreateIndex
CREATE INDEX "idx_calendar_property_id" ON "calendar_availability"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_availability_property_id_date_key" ON "calendar_availability"("property_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_rules_name_key" ON "cancellation_rules"("name");

-- CreateIndex
CREATE INDEX "idx_cancellation_rules_name" ON "cancellation_rules"("name");

-- CreateIndex
CREATE INDEX "idx_favorites_property_id" ON "favorites"("property_id");

-- CreateIndex
CREATE INDEX "idx_favorites_user_id" ON "favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_property_id_key" ON "favorites"("user_id", "property_id");

-- CreateIndex
CREATE INDEX "idx_messages_property_id" ON "messages"("property_id");

-- CreateIndex
CREATE INDEX "idx_messages_read" ON "messages"("receiver_id", "read");

-- CreateIndex
CREATE INDEX "idx_messages_receiver_id" ON "messages"("receiver_id");

-- CreateIndex
CREATE INDEX "idx_messages_reservation_id" ON "messages"("reservation_id");

-- CreateIndex
CREATE INDEX "idx_messages_sender_id" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_messages_sent_at" ON "messages"("sent_at");

-- CreateIndex
CREATE INDEX "idx_notifications_created_at" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_read" ON "notifications"("user_id", "read");

-- CreateIndex
CREATE INDEX "idx_notifications_type" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "idx_notifications_user_id" ON "notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_number_key" ON "payments"("transaction_number");

-- CreateIndex
CREATE INDEX "idx_payments_created_at" ON "payments"("created_at");

-- CreateIndex
CREATE INDEX "idx_payments_payment_status" ON "payments"("payment_status");

-- CreateIndex
CREATE INDEX "idx_payments_reservation_id" ON "payments"("reservation_id");

-- CreateIndex
CREATE INDEX "idx_payments_transaction_number" ON "payments"("transaction_number");

-- CreateIndex
CREATE INDEX "idx_properties_city" ON "properties"("city");

-- CreateIndex
CREATE INDEX "idx_properties_province" ON "properties"("province");

-- CreateIndex
CREATE INDEX "idx_properties_is_active" ON "properties"("is_active");

-- CreateIndex
CREATE INDEX "idx_properties_location" ON "properties"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "idx_properties_price" ON "properties"("price_per_night");

-- CreateIndex
CREATE INDEX "idx_properties_user_id" ON "properties"("user_id");

-- CreateIndex
CREATE INDEX "idx_property_amenities_amenity_id" ON "property_amenities"("amenity_id");

-- CreateIndex
CREATE INDEX "idx_property_amenities_property_id" ON "property_amenities"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_amenities_property_id_amenity_id_key" ON "property_amenities"("property_id", "amenity_id");

-- CreateIndex
CREATE INDEX "idx_property_images_is_main" ON "property_images"("property_id", "is_main");

-- CreateIndex
CREATE INDEX "idx_property_images_property_id" ON "property_images"("property_id");

-- CreateIndex
CREATE INDEX "idx_property_phones_property_id" ON "property_phones"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_property_phone" ON "property_phones"("property_id", "phone_number");

-- CreateIndex
CREATE INDEX "idx_reservations_check_in" ON "reservations"("check_in");

-- CreateIndex
CREATE INDEX "idx_reservations_check_out" ON "reservations"("check_out");

-- CreateIndex
CREATE INDEX "idx_reservations_dates" ON "reservations"("check_in", "check_out");

-- CreateIndex
CREATE INDEX "idx_reservations_property_id" ON "reservations"("property_id");

-- CreateIndex
CREATE INDEX "idx_reservations_status" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "idx_reservations_user_id" ON "reservations"("user_id");

-- CreateIndex
CREATE INDEX "idx_reviews_property_id" ON "reviews"("property_id");

-- CreateIndex
CREATE INDEX "idx_reviews_rating" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "idx_reviews_reservation_id" ON "reviews"("reservation_id");

-- CreateIndex
CREATE INDEX "idx_reviews_user_id" ON "reviews"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refresh_token_key" ON "user_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_user_sessions_expires_at" ON "user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_user_sessions_is_active" ON "user_sessions"("is_active");

-- CreateIndex
CREATE INDEX "idx_user_sessions_refresh_token" ON "user_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_user_sessions_token" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_auth_provider" ON "users"("auth_provider");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role_id" ON "users"("role_id");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calendar_availability" ADD CONSTRAINT "calendar_availability_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_cancellation_rule_id_fkey" FOREIGN KEY ("cancellation_rule_id") REFERENCES "cancellation_rules"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_phones" ADD CONSTRAINT "property_phones_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_subscriptions" ADD CONSTRAINT "property_subscriptions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_subscriptions" ADD CONSTRAINT "property_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
