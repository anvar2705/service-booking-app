import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { getEnvPath } from 'common/helpers/env.helper';

import { dbConfiguration } from './data-source.config';

dotenv.config({ path: getEnvPath(`${__dirname}/../common/envs`) });

export const dataSource = new DataSource(dbConfiguration());
