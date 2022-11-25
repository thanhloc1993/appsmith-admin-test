import fs from 'fs';

export const getImportLocationDataPayload = () => {
    const payload = fs.readFileSync('assets/master-data/location.csv', 'base64');
    return payload;
};

export const getImportLocationTypeDataPayload = () => {
    const payload = fs.readFileSync('assets/master-data/location-type.csv', 'base64');
    return payload;
};
