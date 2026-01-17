
import { DisplayField } from '../types';

export const sortedDisplayFields = (fields: DisplayField[]): DisplayField[] => {
    return [...fields].sort((a, b) => a.order - b.order);
};
