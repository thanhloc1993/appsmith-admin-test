import fs from 'fs';

export const getImportGradeMasterDataPayload = () => {
    const payload = fs.readFileSync('assets/master-data/grade.csv', 'base64');
    return payload;
};

export const getImportClassDataPayload = () => {
    const payload = fs.readFileSync('assets/master-data/class-template.csv', 'base64');
    return payload;
};
