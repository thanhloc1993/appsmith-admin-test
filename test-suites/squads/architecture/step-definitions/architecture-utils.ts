import { LocationObjectGRPC, LocationTypeGRPC } from '@supports/types/cms-types';

export const sortLocationsTypes = (locationTypes: LocationTypeGRPC[]) => {
    let rootLocationType = '';
    const result: LocationTypeGRPC[] = [];
    while (result.length < locationTypes.length) {
        const locationTypesChild = locationTypes.filter(
            (locationType) => locationType.parentLocationTypeId === rootLocationType
        );

        if (locationTypesChild.length != 1) {
            throw Error(
                'Something is wrong with the location type data. Locations Settings may not work correctly.'
            );
        }

        result.push(locationTypesChild[0]);
        rootLocationType = locationTypesChild[0].locationTypeId;
    }

    return result;
};

export const parseFirstGrantedLocation = (
    locationTypesList: LocationTypeGRPC[],
    locationList: LocationObjectGRPC[]
) => {
    const sortedLocationTypesList = sortLocationsTypes(locationTypesList);
    let firstGrantedLocation: LocationObjectGRPC | undefined;
    let parentLocationId = '';
    sortedLocationTypesList.forEach((locationType) => {
        firstGrantedLocation = locationList.find(
            (location) =>
                location.locationType === locationType.locationTypeId &&
                location.parentLocationId === parentLocationId
        );

        parentLocationId = firstGrantedLocation?.locationId || '';
    });

    if (!firstGrantedLocation) throw Error("Can't find first granted location");
    return firstGrantedLocation;
};
