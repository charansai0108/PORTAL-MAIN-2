-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logo" TEXT,
    "settings" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_announcements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "targetSchools" TEXT,
    "targetBatches" TEXT,
    "targetCenters" TEXT,
    "createdBy" TEXT NOT NULL,
    "tenantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_announcements" ("createdAt", "createdBy", "description", "id", "imagePublicId", "imageUrl", "link", "targetBatches", "targetCenters", "targetSchools", "title") SELECT "createdAt", "createdBy", "description", "id", "imagePublicId", "imageUrl", "link", "targetBatches", "targetCenters", "targetSchools", "title" FROM "announcements";
DROP TABLE "announcements";
ALTER TABLE "new_announcements" RENAME TO "announcements";
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt" DESC);
CREATE INDEX "announcements_tenantId_idx" ON "announcements"("tenantId");
CREATE TABLE "new_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_name" TEXT,
    "actor_role" TEXT,
    "actor_id" TEXT,
    "action_type" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "details" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "tenant_id" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_audit_logs" ("action_type", "actor_id", "actor_name", "actor_role", "details", "id", "ip_address", "target_id", "target_type", "timestamp", "user_agent") SELECT "action_type", "actor_id", "actor_name", "actor_role", "details", "id", "ip_address", "target_id", "target_type", "timestamp", "user_agent" FROM "audit_logs";
DROP TABLE "audit_logs";
ALTER TABLE "new_audit_logs" RENAME TO "audit_logs";
CREATE INDEX "audit_logs_actor_role_idx" ON "audit_logs"("actor_role");
CREATE INDEX "audit_logs_action_type_idx" ON "audit_logs"("action_type");
CREATE INDEX "audit_logs_target_type_idx" ON "audit_logs"("target_type");
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp" DESC);
CREATE INDEX "audit_logs_tenant_id_idx" ON "audit_logs"("tenant_id");
CREATE TABLE "new_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "companyId" TEXT,
    "recruiterId" TEXT,
    "companyName" TEXT,
    "recruiterEmail" TEXT,
    "recruiterName" TEXT,
    "recruiterEmails" TEXT,
    "salary" TEXT,
    "ctc" TEXT,
    "salaryRange" TEXT,
    "location" TEXT,
    "companyLocation" TEXT,
    "driveDate" DATETIME,
    "applicationDeadline" DATETIME NOT NULL,
    "jobType" TEXT,
    "workMode" TEXT,
    "experienceLevel" TEXT,
    "driveVenues" TEXT NOT NULL,
    "reportingTime" TEXT,
    "qualification" TEXT,
    "specialization" TEXT,
    "yop" TEXT,
    "minCgpa" TEXT,
    "gapAllowed" TEXT,
    "gapYears" TEXT,
    "backlogs" TEXT,
    "spocs" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_REVIEW',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "applicationDeadlineMailSent" BOOLEAN NOT NULL DEFAULT false,
    "driveReminder7dSent" BOOLEAN NOT NULL DEFAULT false,
    "driveReminder3dSent" BOOLEAN NOT NULL DEFAULT false,
    "driveReminder24hSent" BOOLEAN NOT NULL DEFAULT false,
    "adminNote" TEXT,
    "recruiterNote" TEXT,
    "interviewRounds" TEXT,
    "requiresScreening" BOOLEAN NOT NULL DEFAULT false,
    "requiresTest" BOOLEAN NOT NULL DEFAULT false,
    "targetSchools" TEXT NOT NULL,
    "targetCenters" TEXT NOT NULL,
    "targetBatches" TEXT NOT NULL,
    "submittedAt" DATETIME,
    "postedAt" DATETIME,
    "postedBy" TEXT,
    "approvedAt" DATETIME,
    "approvedBy" TEXT,
    "rejectedAt" DATETIME,
    "rejectedBy" TEXT,
    "rejectionReason" TEXT,
    "archivedAt" DATETIME,
    "archivedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tenantId" TEXT,
    CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jobs_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiters" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jobs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_jobs" ("adminNote", "applicationDeadline", "applicationDeadlineMailSent", "approvedAt", "approvedBy", "archivedAt", "archivedBy", "backlogs", "companyId", "companyLocation", "companyName", "createdAt", "ctc", "description", "driveDate", "driveReminder24hSent", "driveReminder3dSent", "driveReminder7dSent", "driveVenues", "experienceLevel", "gapAllowed", "gapYears", "id", "interviewRounds", "isActive", "isPosted", "jobTitle", "jobType", "location", "minCgpa", "postedAt", "postedBy", "qualification", "recruiterEmail", "recruiterEmails", "recruiterId", "recruiterName", "recruiterNote", "rejectedAt", "rejectedBy", "rejectionReason", "reportingTime", "requiredSkills", "requirements", "requiresScreening", "requiresTest", "salary", "salaryRange", "specialization", "spocs", "status", "submittedAt", "targetBatches", "targetCenters", "targetSchools", "updatedAt", "workMode", "yop") SELECT "adminNote", "applicationDeadline", "applicationDeadlineMailSent", "approvedAt", "approvedBy", "archivedAt", "archivedBy", "backlogs", "companyId", "companyLocation", "companyName", "createdAt", "ctc", "description", "driveDate", "driveReminder24hSent", "driveReminder3dSent", "driveReminder7dSent", "driveVenues", "experienceLevel", "gapAllowed", "gapYears", "id", "interviewRounds", "isActive", "isPosted", "jobTitle", "jobType", "location", "minCgpa", "postedAt", "postedBy", "qualification", "recruiterEmail", "recruiterEmails", "recruiterId", "recruiterName", "recruiterNote", "rejectedAt", "rejectedBy", "rejectionReason", "reportingTime", "requiredSkills", "requirements", "requiresScreening", "requiresTest", "salary", "salaryRange", "specialization", "spocs", "status", "submittedAt", "targetBatches", "targetCenters", "targetSchools", "updatedAt", "workMode", "yop" FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
CREATE INDEX "jobs_status_createdAt_idx" ON "jobs"("status", "createdAt" DESC);
CREATE INDEX "jobs_isActive_createdAt_idx" ON "jobs"("isActive", "createdAt" DESC);
CREATE INDEX "jobs_recruiterId_createdAt_idx" ON "jobs"("recruiterId", "createdAt" DESC);
CREATE INDEX "jobs_isPosted_createdAt_idx" ON "jobs"("isPosted", "createdAt" DESC);
CREATE INDEX "jobs_applicationDeadline_applicationDeadlineMailSent_status_idx" ON "jobs"("applicationDeadline", "applicationDeadlineMailSent", "status");
CREATE INDEX "jobs_targetSchools_idx" ON "jobs"("targetSchools");
CREATE INDEX "jobs_targetCenters_idx" ON "jobs"("targetCenters");
CREATE INDEX "jobs_targetBatches_idx" ON "jobs"("targetBatches");
CREATE INDEX "jobs_tenantId_idx" ON "jobs"("tenantId");
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "cgpa" REAL,
    "backlogs" TEXT,
    "batch" TEXT NOT NULL,
    "center" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "bio" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "city" TEXT,
    "stateRegion" TEXT,
    "jobFlexibility" TEXT,
    "profileImageUrl" TEXT,
    "profileImagePublicId" TEXT,
    "linkedin" TEXT,
    "githubUrl" TEXT,
    "youtubeUrl" TEXT,
    "leetcode" TEXT,
    "codeforces" TEXT,
    "gfg" TEXT,
    "hackerrank" TEXT,
    "otherProfiles" TEXT,
    "resumeUrl" TEXT,
    "resumeFileName" TEXT,
    "resumeUploadedAt" DATETIME,
    "statsApplied" INTEGER NOT NULL DEFAULT 0,
    "statsShortlisted" INTEGER NOT NULL DEFAULT 0,
    "statsInterviewed" INTEGER NOT NULL DEFAULT 0,
    "statsOffers" INTEGER NOT NULL DEFAULT 0,
    "emailNotificationsDisabled" BOOLEAN NOT NULL DEFAULT false,
    "publicProfileId" TEXT,
    "publicProfileShowEmail" BOOLEAN NOT NULL DEFAULT true,
    "publicProfileShowPhone" BOOLEAN NOT NULL DEFAULT false,
    "endorsementsData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tenantId" TEXT,
    CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "students_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_students" ("backlogs", "batch", "bio", "center", "cgpa", "city", "codeforces", "createdAt", "email", "emailNotificationsDisabled", "endorsementsData", "enrollmentId", "fullName", "gfg", "githubUrl", "hackerrank", "headline", "id", "jobFlexibility", "leetcode", "linkedin", "otherProfiles", "phone", "profileImagePublicId", "profileImageUrl", "profile_completed", "publicProfileId", "publicProfileShowEmail", "publicProfileShowPhone", "resumeFileName", "resumeUploadedAt", "resumeUrl", "school", "stateRegion", "statsApplied", "statsInterviewed", "statsOffers", "statsShortlisted", "summary", "updatedAt", "userId", "youtubeUrl") SELECT "backlogs", "batch", "bio", "center", "cgpa", "city", "codeforces", "createdAt", "email", "emailNotificationsDisabled", "endorsementsData", "enrollmentId", "fullName", "gfg", "githubUrl", "hackerrank", "headline", "id", "jobFlexibility", "leetcode", "linkedin", "otherProfiles", "phone", "profileImagePublicId", "profileImageUrl", "profile_completed", "publicProfileId", "publicProfileShowEmail", "publicProfileShowPhone", "resumeFileName", "resumeUploadedAt", "resumeUrl", "school", "stateRegion", "statsApplied", "statsInterviewed", "statsOffers", "statsShortlisted", "summary", "updatedAt", "userId", "youtubeUrl" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE UNIQUE INDEX "students_enrollmentId_key" ON "students"("enrollmentId");
CREATE UNIQUE INDEX "students_publicProfileId_key" ON "students"("publicProfileId");
CREATE INDEX "students_center_idx" ON "students"("center");
CREATE INDEX "students_school_idx" ON "students"("school");
CREATE INDEX "students_batch_idx" ON "students"("batch");
CREATE INDEX "students_emailNotificationsDisabled_createdAt_idx" ON "students"("emailNotificationsDisabled", "createdAt");
CREATE INDEX "students_tenantId_idx" ON "students"("tenantId");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" DATETIME,
    "recruiterVerified" BOOLEAN NOT NULL DEFAULT false,
    "displayName" TEXT,
    "profilePhoto" TEXT,
    "blockInfo" TEXT,
    "googleCalendarConnected" BOOLEAN NOT NULL DEFAULT false,
    "connectedGoogleEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    "tenantId" TEXT,
    CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("blockInfo", "connectedGoogleEmail", "createdAt", "displayName", "email", "emailVerified", "emailVerifiedAt", "googleCalendarConnected", "id", "lastLoginAt", "passwordHash", "profilePhoto", "recruiterVerified", "role", "status", "updatedAt") SELECT "blockInfo", "connectedGoogleEmail", "createdAt", "displayName", "email", "emailVerified", "emailVerifiedAt", "googleCalendarConnected", "id", "lastLoginAt", "passwordHash", "profilePhoto", "recruiterVerified", "role", "status", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_name_key" ON "tenants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");
