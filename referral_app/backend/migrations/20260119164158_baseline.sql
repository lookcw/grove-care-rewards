-- Create "addresses" table
CREATE TABLE "addresses" (
  "street_address_1" character varying(255) NOT NULL,
  "street_address_2" character varying(255) NULL,
  "city" character varying(100) NOT NULL,
  "state" character varying(2) NOT NULL,
  "zip_code" character varying(10) NOT NULL,
  "country" character varying(100) NOT NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
-- Create index "ix_addresses_id" to table: "addresses"
CREATE UNIQUE INDEX "ix_addresses_id" ON "addresses" ("id");
-- Create "patients" table
CREATE TABLE "patients" (
  "first_name" character varying(100) NOT NULL,
  "last_name" character varying(100) NOT NULL,
  "phone" character varying(20) NULL,
  "phone_home" character varying(20) NULL,
  "phone_mobile" character varying(20) NULL,
  "email" character varying(255) NULL,
  "date_of_birth" date NOT NULL,
  "sex" character varying(20) NULL,
  "patient_id" character varying(100) NULL,
  "medical_record_number" character varying(100) NULL,
  "address_id" uuid NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "patients_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);
-- Create index "ix_patients_address_id" to table: "patients"
CREATE INDEX "ix_patients_address_id" ON "patients" ("address_id");
-- Create index "ix_patients_date_of_birth" to table: "patients"
CREATE INDEX "ix_patients_date_of_birth" ON "patients" ("date_of_birth");
-- Create index "ix_patients_email" to table: "patients"
CREATE INDEX "ix_patients_email" ON "patients" ("email");
-- Create index "ix_patients_id" to table: "patients"
CREATE UNIQUE INDEX "ix_patients_id" ON "patients" ("id");
-- Create index "ix_patients_medical_record_number" to table: "patients"
CREATE UNIQUE INDEX "ix_patients_medical_record_number" ON "patients" ("medical_record_number");
-- Create index "ix_patients_patient_id" to table: "patients"
CREATE INDEX "ix_patients_patient_id" ON "patients" ("patient_id");
-- Create "insurances" table
CREATE TABLE "insurances" (
  "patient_id" uuid NOT NULL,
  "plan_name" character varying(255) NULL,
  "policy_number" character varying(100) NULL,
  "group_number" character varying(100) NULL,
  "subscriber_name" character varying(255) NULL,
  "is_primary" boolean NOT NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "insurances_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- Create index "ix_insurances_id" to table: "insurances"
CREATE UNIQUE INDEX "ix_insurances_id" ON "insurances" ("id");
-- Create index "ix_insurances_is_primary" to table: "insurances"
CREATE INDEX "ix_insurances_is_primary" ON "insurances" ("is_primary");
-- Create index "ix_insurances_patient_id" to table: "insurances"
CREATE INDEX "ix_insurances_patient_id" ON "insurances" ("patient_id");
-- Create index "ix_insurances_policy_number" to table: "insurances"
CREATE INDEX "ix_insurances_policy_number" ON "insurances" ("policy_number");
-- Create "users" table
CREATE TABLE "users" (
  "phone_number" character varying(20) NULL,
  "first_name" character varying(100) NULL,
  "last_name" character varying(100) NULL,
  "npi" character varying(10) NULL,
  "is_admin" boolean NOT NULL,
  "id" uuid NOT NULL,
  "email" character varying(320) NOT NULL,
  "hashed_password" character varying(1024) NOT NULL,
  "is_active" boolean NOT NULL,
  "is_superuser" boolean NOT NULL,
  "is_verified" boolean NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "ix_users_email" to table: "users"
CREATE UNIQUE INDEX "ix_users_email" ON "users" ("email");
-- Create index "ix_users_npi" to table: "users"
CREATE INDEX "ix_users_npi" ON "users" ("npi");
-- Create "provider_institutions" table
CREATE TABLE "provider_institutions" (
  "name" character varying(255) NOT NULL,
  "type" character varying(255) NULL,
  "phone" character varying(20) NULL,
  "email" character varying(255) NULL,
  "website" character varying(500) NULL,
  "address_id" uuid NULL,
  "created_by_user_id" uuid NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "provider_institutions_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "provider_institutions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- Create index "ix_provider_institutions_address_id" to table: "provider_institutions"
CREATE INDEX "ix_provider_institutions_address_id" ON "provider_institutions" ("address_id");
-- Create index "ix_provider_institutions_created_by_user_id" to table: "provider_institutions"
CREATE INDEX "ix_provider_institutions_created_by_user_id" ON "provider_institutions" ("created_by_user_id");
-- Create index "ix_provider_institutions_id" to table: "provider_institutions"
CREATE UNIQUE INDEX "ix_provider_institutions_id" ON "provider_institutions" ("id");
-- Create index "ix_provider_institutions_name" to table: "provider_institutions"
CREATE INDEX "ix_provider_institutions_name" ON "provider_institutions" ("name");
-- Create "providers" table
CREATE TABLE "providers" (
  "first_name" character varying(100) NOT NULL,
  "last_name" character varying(100) NOT NULL,
  "email" character varying(255) NOT NULL,
  "phone" character varying(20) NULL,
  "fax" character varying(20) NULL,
  "npi" character varying(10) NULL,
  "specialty" character varying(255) NULL,
  "address_id" uuid NULL,
  "institution_id" uuid NULL,
  "global_provider" boolean NOT NULL,
  "created_by_user_id" uuid NULL,
  "copied_from_provider_id" uuid NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "providers_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "providers_copied_from_provider_id_fkey" FOREIGN KEY ("copied_from_provider_id") REFERENCES "providers" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "providers_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "providers_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "provider_institutions" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);
-- Create index "ix_providers_address_id" to table: "providers"
CREATE INDEX "ix_providers_address_id" ON "providers" ("address_id");
-- Create index "ix_providers_copied_from_provider_id" to table: "providers"
CREATE INDEX "ix_providers_copied_from_provider_id" ON "providers" ("copied_from_provider_id");
-- Create index "ix_providers_created_by_user_id" to table: "providers"
CREATE INDEX "ix_providers_created_by_user_id" ON "providers" ("created_by_user_id");
-- Create index "ix_providers_email" to table: "providers"
CREATE INDEX "ix_providers_email" ON "providers" ("email");
-- Create index "ix_providers_global_provider" to table: "providers"
CREATE INDEX "ix_providers_global_provider" ON "providers" ("global_provider");
-- Create index "ix_providers_id" to table: "providers"
CREATE UNIQUE INDEX "ix_providers_id" ON "providers" ("id");
-- Create index "ix_providers_institution_id" to table: "providers"
CREATE INDEX "ix_providers_institution_id" ON "providers" ("institution_id");
-- Create index "ix_providers_npi" to table: "providers"
CREATE INDEX "ix_providers_npi" ON "providers" ("npi");
-- Create "referrals" table
CREATE TABLE "referrals" (
  "user_id" uuid NOT NULL,
  "patient_id" uuid NULL,
  "referring_provider_id" uuid NULL,
  "provider_id" uuid NULL,
  "provider_institution_id" uuid NULL,
  "status" character varying(20) NOT NULL,
  "notes" character varying(1000) NULL,
  "referral_date" timestamptz NOT NULL,
  "appointment_timeframe" timestamptz NULL,
  "diagnosis_codes" json NULL,
  "diagnosis_descriptions" json NULL,
  "reason_for_referral" text NULL,
  "clinical_notes" text NULL,
  "specialty_requested" character varying(255) NULL,
  "urgency" character varying(50) NULL,
  "orders_count" character varying(50) NULL,
  "schedule_within" character varying(100) NULL,
  "signed_by" character varying(255) NULL,
  "confidence_score" double precision NULL,
  "raw_text" text NULL,
  "document_file_path" character varying(500) NULL,
  "document_processed_at" timestamptz NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "referrals_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "referrals_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "referrals_provider_institution_id_fkey" FOREIGN KEY ("provider_institution_id") REFERENCES "provider_institutions" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "referrals_referring_provider_id_fkey" FOREIGN KEY ("referring_provider_id") REFERENCES "providers" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT "referrals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- Create index "ix_referrals_id" to table: "referrals"
CREATE UNIQUE INDEX "ix_referrals_id" ON "referrals" ("id");
-- Create index "ix_referrals_patient_id" to table: "referrals"
CREATE INDEX "ix_referrals_patient_id" ON "referrals" ("patient_id");
-- Create index "ix_referrals_provider_id" to table: "referrals"
CREATE INDEX "ix_referrals_provider_id" ON "referrals" ("provider_id");
-- Create index "ix_referrals_provider_institution_id" to table: "referrals"
CREATE INDEX "ix_referrals_provider_institution_id" ON "referrals" ("provider_institution_id");
-- Create index "ix_referrals_referral_date" to table: "referrals"
CREATE INDEX "ix_referrals_referral_date" ON "referrals" ("referral_date");
-- Create index "ix_referrals_referring_provider_id" to table: "referrals"
CREATE INDEX "ix_referrals_referring_provider_id" ON "referrals" ("referring_provider_id");
-- Create index "ix_referrals_status" to table: "referrals"
CREATE INDEX "ix_referrals_status" ON "referrals" ("status");
-- Create index "ix_referrals_user_id" to table: "referrals"
CREATE INDEX "ix_referrals_user_id" ON "referrals" ("user_id");
-- Create "user_provider_networks" table
CREATE TABLE "user_provider_networks" (
  "user_id" uuid NOT NULL,
  "provider_id" uuid NULL,
  "provider_institution_id" uuid NULL,
  "id" uuid NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "datetime_updated" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "unique_user_institution" UNIQUE ("user_id", "provider_institution_id"),
  CONSTRAINT "unique_user_provider" UNIQUE ("user_id", "provider_id"),
  CONSTRAINT "user_provider_networks_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "user_provider_networks_provider_institution_id_fkey" FOREIGN KEY ("provider_institution_id") REFERENCES "provider_institutions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "user_provider_networks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "check_exactly_one_network_target" CHECK ((((provider_id IS NOT NULL))::integer + ((provider_institution_id IS NOT NULL))::integer) = 1)
);
-- Create index "ix_user_provider_networks_id" to table: "user_provider_networks"
CREATE UNIQUE INDEX "ix_user_provider_networks_id" ON "user_provider_networks" ("id");
-- Create index "ix_user_provider_networks_provider_id" to table: "user_provider_networks"
CREATE INDEX "ix_user_provider_networks_provider_id" ON "user_provider_networks" ("provider_id");
-- Create index "ix_user_provider_networks_provider_institution_id" to table: "user_provider_networks"
CREATE INDEX "ix_user_provider_networks_provider_institution_id" ON "user_provider_networks" ("provider_institution_id");
-- Create index "ix_user_provider_networks_user_id" to table: "user_provider_networks"
CREATE INDEX "ix_user_provider_networks_user_id" ON "user_provider_networks" ("user_id");
