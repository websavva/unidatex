import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { MigrationInterface, QueryRunner } from 'typeorm';

interface City {
  id: number;
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  country: string;
  iso2: string;
  iso3: string;
  admin_name: string;
  capital: string;
  population: string;
}

const getAllCities = async () => {
  return readFile(resolve(__dirname, './data/cities.json'), 'utf-8').then(
    (rawCitiesJson) => JSON.parse(rawCitiesJson) as City[],
  );
};

export class CitiesSeed1733781829014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const allCities = await getAllCities();

    const normalizeStringValue = (str: string) =>
      `'${str.replace(/'/g, "''")}'`;

    const sqlQuery = `
      INSERT INTO cities(name, country, lat, lng, "isCapital")
      VALUES ${allCities.map(({ city_ascii, iso2, lat, lng, capital }) => `(${[normalizeStringValue(city_ascii), normalizeStringValue(iso2), lat, lng, capital === 'primary']})`).join(',')};
      `;

    await queryRunner.query(sqlQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE cities;');
  }
}
