import { OwnerListingType, OwnerType } from 'helpers/types';

export interface IProps {
    owners: OwnerType[] | OwnerListingType[];
}