-- CreateEnum
CREATE TYPE "public"."ProjectType" AS ENUM ('REACT_NATIVE', 'NEXTJS', 'REACT');

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "type" "public"."ProjectType" NOT NULL DEFAULT 'NEXTJS';
