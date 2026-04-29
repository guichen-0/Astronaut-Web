-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Planet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "planetType" TEXT NOT NULL,
    "diameterKm" REAL,
    "massKg" TEXT,
    "distanceFromSunAu" REAL,
    "orbitalPeriodDays" REAL,
    "rotationPeriodHours" REAL,
    "numberOfMoons" INTEGER NOT NULL DEFAULT 0,
    "hasRings" BOOLEAN NOT NULL DEFAULT false,
    "temperatureMin" INTEGER,
    "temperatureMax" INTEGER,
    "atmosphereComposition" TEXT,
    "description" TEXT NOT NULL,
    "funFact" TEXT,
    "imageUrl" TEXT,
    "iconName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Moon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "diameterKm" REAL,
    "massKg" TEXT,
    "discoverer" TEXT,
    "discoveryYear" INTEGER,
    "description" TEXT,
    CONSTRAINT "Moon_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "bayerDesignation" TEXT,
    "flamsteedDesignation" TEXT,
    "hipId" INTEGER,
    "hdId" INTEGER,
    "hrId" INTEGER,
    "rightAscension" REAL NOT NULL,
    "declination" REAL NOT NULL,
    "apparentMagnitude" REAL NOT NULL,
    "absoluteMagnitude" REAL,
    "colorIndexBv" REAL,
    "distanceParsecs" REAL,
    "spectralType" TEXT,
    "luminosity" REAL,
    "temperatureK" INTEGER,
    "radiusSolar" REAL,
    "constellationAbbreviation" TEXT,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Star_constellationAbbreviation_fkey" FOREIGN KEY ("constellationAbbreviation") REFERENCES "Constellation" ("abbreviation") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Constellation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "genitive" TEXT,
    "meaning" TEXT,
    "season" TEXT,
    "areaSqDeg" REAL,
    "brightestStarId" TEXT,
    "description" TEXT NOT NULL,
    "mythos" TEXT,
    "imageUrl" TEXT,
    "imageCredit" TEXT,
    "boundaryJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" DATETIME,
    "crawledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "CelestialEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "peakDate" DATETIME,
    "visibility" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "imageUrl" TEXT,
    "sourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StarMapPreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StarMapPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrawlSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "feedUrl" TEXT,
    "categoryId" TEXT,
    "crawlIntervalMinutes" INTEGER NOT NULL DEFAULT 360,
    "lastCrawledAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userAgent" TEXT NOT NULL DEFAULT 'AstronomyWebBot/1.0',
    "robotsCache" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Planet_name_key" ON "Planet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Planet_slug_key" ON "Planet"("slug");

-- CreateIndex
CREATE INDEX "Moon_planetId_idx" ON "Moon"("planetId");

-- CreateIndex
CREATE UNIQUE INDEX "Star_hipId_key" ON "Star"("hipId");

-- CreateIndex
CREATE UNIQUE INDEX "Star_hdId_key" ON "Star"("hdId");

-- CreateIndex
CREATE UNIQUE INDEX "Star_hrId_key" ON "Star"("hrId");

-- CreateIndex
CREATE INDEX "Star_apparentMagnitude_idx" ON "Star"("apparentMagnitude");

-- CreateIndex
CREATE INDEX "Star_constellationAbbreviation_idx" ON "Star"("constellationAbbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "Constellation_name_key" ON "Constellation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Constellation_abbreviation_key" ON "Constellation"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_sourceUrl_key" ON "Article"("sourceUrl");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_sourceName_idx" ON "Article"("sourceName");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");

-- CreateIndex
CREATE INDEX "CelestialEvent_startDate_idx" ON "CelestialEvent"("startDate");

-- CreateIndex
CREATE INDEX "CelestialEvent_eventType_idx" ON "CelestialEvent"("eventType");

-- CreateIndex
CREATE INDEX "Favorite_entityType_entityId_idx" ON "Favorite"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_entityType_entityId_key" ON "Favorite"("userId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "UserNote_userId_entityType_idx" ON "UserNote"("userId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "CrawlSource_name_key" ON "CrawlSource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CrawlSource_baseUrl_key" ON "CrawlSource"("baseUrl");
