-- CreateTable
CREATE TABLE "public"."Configs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "maxSlots" INTEGER NOT NULL DEFAULT 1,
    "startTime" TEXT NOT NULL DEFAULT '09:00',
    "endTime" TEXT NOT NULL DEFAULT '18:00',
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    "monday" BOOLEAN NOT NULL DEFAULT true,
    "tuesday" BOOLEAN NOT NULL DEFAULT true,
    "wednesday" BOOLEAN NOT NULL DEFAULT true,
    "thursday" BOOLEAN NOT NULL DEFAULT true,
    "friday" BOOLEAN NOT NULL DEFAULT true,
    "saturday" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur',

    CONSTRAINT "Configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OffDays" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,

    CONSTRAINT "OffDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OffHours" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL DEFAULT '13:00',
    "endTime" TEXT NOT NULL DEFAULT '14:00',

    CONSTRAINT "OffHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointmentDateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OffDays_configId_idx" ON "public"."OffDays"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "OffDays_configId_date_key" ON "public"."OffDays"("configId", "date");

-- CreateIndex
CREATE INDEX "OffHours_configId_idx" ON "public"."OffHours"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "OffHours_startTime_endTime_key" ON "public"."OffHours"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "Appointments_configId_idx" ON "public"."Appointments"("configId");
