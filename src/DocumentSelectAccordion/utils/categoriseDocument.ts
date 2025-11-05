import z from 'zod';
import { documentSchema } from '../getters/useGetCaseDocumentList';
import {
  documentTypeIdsMap,
  TCategoryName,
  unusedCommRegexes
} from './categoriseDocumentHelperUtils';

export const categoriseDocument = (
  doc: z.infer<typeof documentSchema>
): TCategoryName => {
  if (
    doc.cmsDocType.documentType === 'PCD' ||
    documentTypeIdsMap.review.includes(doc.cmsDocType.documentTypeId)
  )
    return 'review' as const;

  if (documentTypeIdsMap.caseOverview.includes(doc.cmsDocType.documentTypeId))
    return 'caseOverview' as const;

  if (
    !doc.isUnused &&
    documentTypeIdsMap.statement.includes(doc.cmsDocType.documentTypeId)
  )
    return 'statement' as const;

  if (
    doc.cmsDocType.documentCategory === 'Exhibit' &&
    documentTypeIdsMap.exhibit.includes(doc.cmsDocType.documentTypeId)
  )
    return 'exhibit' as const;

  if (documentTypeIdsMap.forensic.includes(doc.cmsDocType.documentTypeId))
    return 'forensic' as const;

  if (
    (!!doc.presentationTitle &&
      doc.cmsDocType.documentTypeId === 1029 &&
      !doc.presentationTitle.includes('UM/') &&
      unusedCommRegexes.some((regex) => doc.presentationTitle.match(regex))) ||
    doc.isUnused ||
    documentTypeIdsMap.unusedMaterial.includes(doc.cmsDocType.documentTypeId)
  )
    return 'unusedMaterial' as const;

  if (documentTypeIdsMap.defendant.includes(doc.cmsDocType.documentTypeId))
    return 'defendant' as const;

  if (
    documentTypeIdsMap.courtPreparation.includes(doc.cmsDocType.documentTypeId)
  )
    return 'courtPreparation' as const;

  if (
    doc.cmsOriginalFileName?.endsWith('.hte') ||
    documentTypeIdsMap.communication.includes(doc.cmsDocType.documentTypeId)
  )
    return 'communication' as const;

  if (documentTypeIdsMap.uncategorised.includes(doc.cmsDocType.documentTypeId))
    return 'uncategorised' as const;

  return 'uncategorised' as const;
};
