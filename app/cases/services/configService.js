'use strict';

import hydrajs from '../../shared/hydrajs';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import concat from 'lodash/concat';
import merge from 'lodash/merge';
import get from 'lodash/get';
import find from 'lodash/find';


export default class ConfigService {
    constructor(AlertService) {
        'ngInject';

        this.config = [];

        this.getField = (fieldName, fieldType) => {
            let values = reduce(this.config, (result, v) => {
                return v.fieldName.startsWith(fieldName) ? [...result, v.fieldValue] : result;
            }, []);

            if (values.length === 0) return null;

            if (!fieldType) return values;

            try {
                const parsed = values.map(JSON.parse);
                if (fieldType === 'JSON') return parsed;
                if (fieldType === 'JSON-ARRAY') return reduce(parsed, concat);
                if (fieldType === 'JSON-HASHMAP') return reduce(parsed, merge);
            } catch (error) {
                AlertService.addStrataErrorMessage(error);
            }
        }

        this.loadConfig = async () => {
            try {
                this.config = await hydrajs.maintenance.getMaintenanceMode('pcm_configurations')
            } catch (e) {
                AlertService.addStrataErrorMessage(error);
            }
        }
    }
}
