import hubspot from '@hubspot/api-client';
import { enviromentVariables } from '../config/env.js';
import logger from '../utils/logger.js';

const hubspotClient = new hubspot.Client({ accessToken: enviromentVariables.HUBSPOT_ACCESS_TOKEN });

export async function migrateToHubspot(type, data) {
  for (const item of data) {
    try {
      let properties = {};
      let objectType = '';
      let searchFilter = {};
      let api;

      if (type === 'pokemon') {
        objectType = 'contacts';
        properties = {
          firstname: item.name,
          lastname: 'Pokemon',
          email: `${item.name}@pokeapi.com`, // clave única
        };

        searchFilter = {
          propertyName: 'email',
          operator: 'EQ',
          value: properties.email,
        };

        api = hubspotClient.crm.contacts;
      }

      else if (type === 'location') {
        objectType = 'companies';
        properties = {
          name: item.name,
          domain: `${item.name.toLowerCase().replace(/\s/g, '')}.pokeapi.com`, // dominio simulado
        };

        searchFilter = {
          propertyName: 'domain',
          operator: 'EQ',
          value: properties.domain,
        };

        api = hubspotClient.crm.companies;
      }

      else if (type === 'move') {
        // Usamos un objeto personalizado (hay que crearlo en HubSpot antes)
        objectType = 'pokedex_move'; // el nombre del objeto personalizado en HubSpot (slug o API name)

        properties = {
          name: item.name,
          accuracy: item.accuracy?.toString() ?? '',
          power: item.power?.toString() ?? '',
          pp: item.pp?.toString() ?? '',
          type: item.type,
          damage_class: item.damageClass,
        };

        searchFilter = {
          propertyName: 'name',
          operator: 'EQ',
          value: properties.name,
        };

        api = hubspotClient.crm.objects.basicApi;
      }

      // Ejecutar búsqueda para evitar duplicados
      const searchRequest = {
        filterGroups: [{ filters: [searchFilter] }],
        properties: Object.keys(properties),
        limit: 1,
      };

      let existing;
      if (type === 'move') {
        const response = await hubspotClient.crm.objects.searchApi.doSearch(objectType, searchRequest);
        existing = response?.results?.[0];
      } else {
        const response = await api.searchApi.doSearch(objectType, searchRequest);
        existing = response?.results?.[0];
      }

      if (existing) {
        logger.info(`🟡 ${type} "${properties.name || properties.firstname}" ya existe en HubSpot`);
        continue;
      }

      if (type === 'move') {
        await api.create(objectType, { properties });
      } else {
        await api.basicApi.create({ properties });
      }

      logger.info(`✅ ${type} "${properties.name || properties.firstname}" creado en HubSpot`);

    } catch (err) {
      logger.error(`❌ Error migrando ${type} "${item.name}": ${err.message}`);
    }
  }
}
