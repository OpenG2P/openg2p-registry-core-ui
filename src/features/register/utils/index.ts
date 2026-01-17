import { deserializeFile } from '@/shared/types';
import { DisplayField } from '../types';

export const sortedDisplayFields = (fields: DisplayField[]): DisplayField[] => {
    return [...fields].sort((firstField, secondField) => firstField.order - secondField.order);
};

export const extractFilesFromSection = (sectionData: Record<string, any>) => {
    const data = { ...sectionData };
    const filesToUpload: File[] = [];
    const fileLabels: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value.__type === 'File') {
            try {
                const realFile = deserializeFile(value);
                filesToUpload.push(realFile);
                fileLabels.push(key);
                delete data[key];
            } catch (error) {
                console.error('Failed to deserialize file:', error);
            }
        }
    });

    return { normalizedData: data, filesToUpload, fileLabels };
};
