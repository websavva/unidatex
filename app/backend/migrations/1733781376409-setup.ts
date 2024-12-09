import { MigrationInterface, QueryRunner } from 'typeorm';

export class Setup1733781376409 implements MigrationInterface {
  name = 'Setup1733781376409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "isPrimary" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "UQ_fb4872fa7a8a02ed1b2ae780433" UNIQUE ("key"), CONSTRAINT "PK_408dc17e8ec2d9c7cdafcb7ee43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "viewedAt" TIMESTAMP NOT NULL DEFAULT now(), "viewedUserId" uuid, "viewerId" uuid, CONSTRAINT "PK_1f506d7684c169bf0c34a893169" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "favoritedUserId" uuid, CONSTRAINT "PK_6c472a19a7423cfbbf6b7c75939" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cities_country_enum" AS ENUM('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'XG', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" "public"."cities_country_enum" NOT NULL, "name" character varying NOT NULL, "isCapital" boolean NOT NULL, "lat" real NOT NULL, "lng" real NOT NULL, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_lookingfor_enum" AS ENUM('friends', 'fun', 'marriage', 'relationship')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_targetedgender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_country_enum" AS ENUM('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'XG', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_occupation_enum" AS ENUM('administration', 'agriculture', 'artisan', 'artist', 'assistant', 'beauty', 'business_owner', 'ceo', 'customer_service', 'employee', 'engineer', 'entrepreneur', 'executive', 'fashion', 'financial', 'foodservice', 'freelancer', 'hairdresser', 'health', 'it', 'law', 'manager', 'marketing', 'military', 'other', 'realestates', 'retired', 'sale', 'scientist', 'self_employed', 'student', 'teacher', 'technician', 'tourism', 'unemployed', 'worker')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_living_enum" AS ENUM('alone', 'housemate', 'family')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_physicallook_enum" AS ENUM('supermodel', 'very_attractive', 'attractive', 'average', 'below_average', 'not_matter')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_bodytype_enum" AS ENUM('skinny', 'lean', 'average', 'athletic', 'bodybuilt', 'chubby')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_maritalstatus_enum" AS ENUM('single', 'relationship', 'married', 'divorced', 'separated', 'widowed', 'complicated')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_educationlevel_enum" AS ENUM('secondary', 'vocational_school', 'college', 'bachelor', 'master', 'doctorate', 'post_doctorate')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_religion_enum" AS ENUM('catholic', 'orthodox', 'protestant', 'christian', 'buddhist', 'muslim', 'hindu', 'jewish', 'taoist', 'shintoist', 'atheist', 'agnostic', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_ethnicity_enum" AS ENUM('caucasian', 'asian', 'eurasian', 'arab', 'black', 'indian', 'latino', 'mediterranean', 'mixed', 'indigenous')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_eatinghabits_enum" AS ENUM('anything', 'diet', 'healthy', 'fast food', 'vegetarian', 'vegan', 'kosher', 'halal', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_drinkinghabits_enum" AS ENUM('never', 'sometimes', 'often')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_smokinghabits_enum" AS ENUM('never', 'never_but_not_mind', 'socially', 'regularly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_languages_enum" AS ENUM('arabic', 'chinese', 'czech', 'danish', 'dutch', 'english', 'filipino', 'finnish', 'french', 'german', 'greek', 'hebrew', 'hindi', 'indonesian', 'italian', 'japanese', 'korean', 'malay', 'norwegian', 'polish', 'portuguese', 'romanian', 'russian', 'spanish', 'swedish', 'thai', 'turkish', 'ukrainian', 'vietnamese')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_wouldtravel_enum" AS ENUM('yes', 'no', 'uncertain')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_wouldrelocate_enum" AS ENUM('yes', 'no', 'uncertain')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(200) NOT NULL, "name" character varying(12) NOT NULL, "passwordHash" character varying NOT NULL, "passwordUpdatedAt" TIMESTAMP WITH TIME ZONE, "lookingFor" "public"."users_lookingfor_enum" array NOT NULL, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'male', "targetedGender" "public"."users_targetedgender_enum", "birthDate" TIMESTAMP WITH TIME ZONE NOT NULL, "height" integer, "weight" integer, "country" "public"."users_country_enum" NOT NULL, "occupation" "public"."users_occupation_enum", "living" "public"."users_living_enum", "physicalLook" "public"."users_physicallook_enum", "bodyType" "public"."users_bodytype_enum", "maritalStatus" "public"."users_maritalstatus_enum", "educationLevel" "public"."users_educationlevel_enum", "religion" "public"."users_religion_enum", "ethnicity" "public"."users_ethnicity_enum", "eatingHabits" "public"."users_eatinghabits_enum", "drinkingHabits" "public"."users_drinkinghabits_enum", "smokingHabits" "public"."users_smokinghabits_enum", "languages" "public"."users_languages_enum" array NOT NULL DEFAULT '{english}', "hasChildren" boolean, "wouldTravel" "public"."users_wouldtravel_enum", "wouldRelocate" "public"."users_wouldrelocate_enum", "intro" character varying(30), "description" character varying(3000), "cityId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "languages_range" CHECK (array_length(languages, 1) >= 1 AND array_length(languages, 1) <= 3), CONSTRAINT "weght_range" CHECK (weight IS NULL OR (weight >= 25 AND weight <= 250)), CONSTRAINT "height_range" CHECK (height IS NULL OR (height >= 120 AND height <= 220)), CONSTRAINT "birthDate_range" CHECK (DATE_PART('year', AGE("birthDate")) >= 18 AND DATE_PART('year', AGE("birthDate")) <= 200), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_photos" ADD CONSTRAINT "FK_5d177a33da4748e791a3bf1a7f7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_views" ADD CONSTRAINT "FK_58d83a3486900c83fca46ef9aa6" FOREIGN KEY ("viewedUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_views" ADD CONSTRAINT "FK_b4165e01ac61a1f5a118959b67b" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_ea7e30c029cf3852f65a4c80651" FOREIGN KEY ("favoritedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_3785318df310caf8cb8e1e37d85" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_3785318df310caf8cb8e1e37d85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_ea7e30c029cf3852f65a4c80651"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_views" DROP CONSTRAINT "FK_b4165e01ac61a1f5a118959b67b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_views" DROP CONSTRAINT "FK_58d83a3486900c83fca46ef9aa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_photos" DROP CONSTRAINT "FK_5d177a33da4748e791a3bf1a7f7"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_wouldrelocate_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_wouldtravel_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_languages_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_smokinghabits_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_drinkinghabits_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_eatinghabits_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_ethnicity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_religion_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_educationlevel_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_maritalstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_bodytype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_physicallook_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_living_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_occupation_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_country_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_targetedgender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_lookingfor_enum"`);
    await queryRunner.query(`DROP TABLE "cities"`);
    await queryRunner.query(`DROP TYPE "public"."cities_country_enum"`);
    await queryRunner.query(`DROP TABLE "user_favorites"`);
    await queryRunner.query(`DROP TABLE "user_profile_views"`);
    await queryRunner.query(`DROP TABLE "user_photos"`);
  }
}
