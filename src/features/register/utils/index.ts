import { deserializeFile } from '@/shared/types';
import { DisplayField } from '../types';
import { SectionChanges } from '@openg2p/registry-widgets';

export const sortedDisplayFields = (fields: DisplayField[]): DisplayField[] => {
    return [...fields].sort((firstField, secondField) => firstField.order - secondField.order);
};

export const extractFilesFromSection = (sectionChanges: SectionChanges) => {
  const filesToUpload: File[] = [];
  const fileLabels: string[] = [];

  if (Array.isArray(sectionChanges.files)) {
    sectionChanges.files.forEach((value, index) => {
      if (value && typeof value === 'object' && (value as any).__type === 'File') {
        try {
          const realFile = deserializeFile(value);
          filesToUpload.push(realFile);
          fileLabels.push(`file_${index}`);
        } catch (error) {
          console.error('Failed to deserialize file:', error);
        }
      }
    });
  }
  
  return {
    filesToUpload,
    fileLabels,
  };
};

/**
 * Section Change edit_action values:
 * - NO_CHANGE: No changes made (handled here)
 * - ADD: New record added (handled at widget level; 
 *   only additional info such as IDs and required fields are added)
 * - DELETE: Record deleted (handled at registry widget level)
 * - UPDATE: Existing record updated (handled at registry widget level)
 */
export function normalizeEditActions(
  records: any[],
  linkInternalRecordId = "Empty Internal RecordID"
) {
  if (!Array.isArray(records)) return [];

  return records.map((record) => {
    // TODO: Need to resolve 3-level structure
    const result = { ...record };

    if (result.edit_action === undefined) {
      result.edit_action = "NO_CHANGE";
    }

    if (result.edit_action === "ADD") {
      result.link_internal_record_id = linkInternalRecordId;
      result.internal_record_id = "";
    }

    return result;
  });
}
