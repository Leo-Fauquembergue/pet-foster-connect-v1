-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('individual', 'shelter', 'admin');

-- CreateEnum
CREATE TYPE "housing_type" AS ENUM ('house', 'apartment', 'other');

-- CreateEnum
CREATE TYPE "animal_sex" AS ENUM ('male', 'female', 'unknown');

-- CreateEnum
CREATE TYPE "animal_status" AS ENUM ('available', 'adopted', 'foster_care', 'unavailable');

-- CreateEnum
CREATE TYPE "application_type" AS ENUM ('adoption', 'foster');

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "pfc_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL,
    "phone_number" VARCHAR(20),
    "address" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pfc_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "individual_profile" (
    "pfc_user_id" INTEGER NOT NULL,
    "housing_type" "housing_type",
    "surface" INTEGER,
    "have_garden" BOOLEAN,
    "have_animals" BOOLEAN,
    "have_children" BOOLEAN,
    "available_family" BOOLEAN DEFAULT false,
    "available_time" TEXT,

    CONSTRAINT "individual_profile_pkey" PRIMARY KEY ("pfc_user_id")
);

-- CreateTable
CREATE TABLE "shelter_profile" (
    "pfc_user_id" INTEGER NOT NULL,
    "siret" VARCHAR(14) NOT NULL,
    "shelter_name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "shelter_profile_pkey" PRIMARY KEY ("pfc_user_id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" VARCHAR(50),
    "sex" "animal_sex" NOT NULL,
    "weight" DECIMAL(4,2),
    "height" INTEGER,
    "description" TEXT,
    "animal_status" "animal_status" NOT NULL,
    "photos" JSONB,
    "accept_other_animals" BOOLEAN DEFAULT false,
    "accept_children" BOOLEAN DEFAULT false,
    "need_garden" BOOLEAN DEFAULT false,
    "treatment" TEXT,
    "species_id" INTEGER NOT NULL,
    "pfc_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application" (
    "pfc_user_id" INTEGER NOT NULL,
    "animal_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "application_type" "application_type" NOT NULL,
    "application_status" "application_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "application_pkey" PRIMARY KEY ("pfc_user_id","animal_id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "pfc_user_id" INTEGER NOT NULL,
    "animal_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("pfc_user_id","animal_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pfc_user_email_key" ON "pfc_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shelter_profile_siret_key" ON "shelter_profile"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- CreateIndex
CREATE INDEX "animal_species_id_idx" ON "animal"("species_id");

-- CreateIndex
CREATE INDEX "animal_pfc_user_id_idx" ON "animal"("pfc_user_id");

-- CreateIndex
CREATE INDEX "animal_animal_status_idx" ON "animal"("animal_status");

-- CreateIndex
CREATE INDEX "application_animal_id_idx" ON "application"("animal_id");

-- CreateIndex
CREATE INDEX "application_application_status_idx" ON "application"("application_status");

-- CreateIndex
CREATE INDEX "bookmark_animal_id_idx" ON "bookmark"("animal_id");

-- AddForeignKey
ALTER TABLE "individual_profile" ADD CONSTRAINT "individual_profile_pfc_user_id_fkey" FOREIGN KEY ("pfc_user_id") REFERENCES "pfc_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_profile" ADD CONSTRAINT "shelter_profile_pfc_user_id_fkey" FOREIGN KEY ("pfc_user_id") REFERENCES "pfc_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_pfc_user_id_fkey" FOREIGN KEY ("pfc_user_id") REFERENCES "pfc_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_pfc_user_id_fkey" FOREIGN KEY ("pfc_user_id") REFERENCES "pfc_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_pfc_user_id_fkey" FOREIGN KEY ("pfc_user_id") REFERENCES "pfc_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
