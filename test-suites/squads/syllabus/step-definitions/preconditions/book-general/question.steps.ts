import { DataTable, Given } from '@cucumber/cucumber';

import { LMTypeShortMappedKey } from '../../cms-models/learning-material';
import { transformDTHashesQuestionDescription } from '../../data-tables/question';

// TODO: Continue to implement later, please ignore this file
Given(
    'school admin has created question(s) of {string} in a general book',
    async function (lmType: keyof typeof LMTypeShortMappedKey, dataTable: DataTable) {
        const data = transformDTHashesQuestionDescription({
            lmType,
            dataHashes: dataTable.hashes(),
        });
        console.log(data);
    }
);
