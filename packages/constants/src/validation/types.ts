export interface FullValidationRange {
    min: number;
    max: number;
}

export type MinValidationRange = Pick<FullValidationRange, 'min'>;

export type MaxValidationRange = Pick<FullValidationRange, 'max'>;
