import { createFullValidationRange, createMaxValidationRange } from './utils';

export const UserEmailLengthRange = createFullValidationRange(1, 200);

export const UserNameLengthRange = createFullValidationRange(1, 12);

export const UserAgeRange = createFullValidationRange(18, 200);

export const UserHeightRange = createFullValidationRange(120, 220);

export const UserWeightRange = createFullValidationRange(25, 250);

export const UserLanguagesRange = createFullValidationRange(1, 3);

export const UserDescriptionMaxRange = createMaxValidationRange(3e3);

export const UserIntroMaxRange = createMaxValidationRange(30);

export const UserPhotoCountMaxRange = createMaxValidationRange(20);
