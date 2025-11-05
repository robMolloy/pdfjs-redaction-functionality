import { AxiosInstance } from 'axios';
import useSWR from 'swr';
import z from 'zod';
import { useAxiosInstance } from './useAxiosInstance';

export const getCaseDocumentListFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents`
  );
  console.log(response.data);

  return response.data;
};
/*
[
    {
        "documentId": "CMS-8888949",
        "status": "New",
        "versionId": 8117832,
        "cmsDocType": {
            "documentTypeId": 1020,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "googleLinks.pdf",
        "presentationTitle": "Test",
        "cmsFileCreatedDate": "2025-10-29T10:44:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": "Links"
    },
    {
        "documentId": "CMS-8884800",
        "status": "New",
        "versionId": 8114631,
        "cmsDocType": {
            "documentTypeId": 1034,
            "documentType": "MG 3",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "testhttps2.pdf",
        "presentationTitle": "MG3",
        "cmsFileCreatedDate": "2025-10-17T15:44:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": true,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8880092",
        "status": "New",
        "versionId": 8114485,
        "cmsDocType": {
            "documentTypeId": 1031,
            "documentType": null,
            "documentCategory": "Statement"
        },
        "cmsOriginalFileName": "special_characters_document.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 26/09/2024 #26",
        "cmsFileCreatedDate": "2025-10-10T10:24:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": 2783632,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Statement",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": false,
        "renameStatus": "IsStatement",
        "reference": null
    },
    {
        "documentId": "CMS-8880088",
        "status": "New",
        "versionId": 8111024,
        "cmsDocType": {
            "documentTypeId": 1042,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "UK_History_with_special_chars.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #11",
        "cmsFileCreatedDate": "2025-10-10T10:14:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": "Test"
    },
    {
        "documentId": "CMS-8873791",
        "status": "New",
        "versionId": 8106353,
        "cmsDocType": {
            "documentTypeId": 1020,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "UK_History_with_special_chars.pdf",
        "presentationTitle": "Test",
        "cmsFileCreatedDate": "2025-10-02T12:59:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": "100"
    },
    {
        "documentId": "CMS-8873675",
        "status": "New",
        "versionId": 8106259,
        "cmsDocType": {
            "documentTypeId": 1042,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "UK_History.pdf",
        "presentationTitle": "PDF Test",
        "cmsFileCreatedDate": "2025-10-02T12:48:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": "1"
    },
    {
        "documentId": "CMS-8834853",
        "status": "New",
        "versionId": 8117898,
        "cmsDocType": {
            "documentTypeId": 1059,
            "documentType": "MG 11(R)",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "MG11.pdf",
        "presentationTitle": "MG11 CARMINE Victim, #91",
        "cmsFileCreatedDate": "2025-07-08T14:17:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8831863",
        "status": "New",
        "versionId": 8072371,
        "cmsDocType": {
            "documentTypeId": 1031,
            "documentType": null,
            "documentCategory": "Statement"
        },
        "cmsOriginalFileName": "Exhibit 1.docx",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #4",
        "cmsFileCreatedDate": "2025-06-25T10:44:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": 1,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": 2783632,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Statement",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": false,
        "renameStatus": "IsStatement",
        "reference": null
    },
    {
        "documentId": "CMS-8825935",
        "status": "New",
        "versionId": 8117897,
        "cmsDocType": {
            "documentTypeId": 1054,
            "documentType": "PE 4",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "Exhibit2- Car Chase.pdf",
        "presentationTitle": "MG16",
        "cmsFileCreatedDate": "2025-06-12T12:55:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": false,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8825933",
        "status": "New",
        "versionId": 8094419,
        "cmsDocType": {
            "documentTypeId": 1059,
            "documentType": "MG 11(R)",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "Exhibit 1.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #9",
        "cmsFileCreatedDate": "2025-06-12T12:55:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": false,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8824903",
        "status": "New",
        "versionId": 8095597,
        "cmsDocType": {
            "documentTypeId": 1031,
            "documentType": null,
            "documentCategory": "Statement"
        },
        "cmsOriginalFileName": "MG2Form_ Not Vulnerable _ Not Intimidated _54KR7689125.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #22",
        "cmsFileCreatedDate": "2025-06-10T09:30:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": 1,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": 2783632,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": true,
        "classification": "Statement",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": false,
        "renameStatus": "IsStatement",
        "reference": null
    },
    {
        "documentId": "CMS-8821461",
        "status": "New",
        "versionId": 8098071,
        "cmsDocType": {
            "documentTypeId": 1042,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "TestDocument.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 26/08/2025 #9",
        "cmsFileCreatedDate": "2025-05-29T21:33:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": false,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": "Test"
    },
    {
        "documentId": "CMS-8821446",
        "status": "New",
        "versionId": 8109680,
        "cmsDocType": {
            "documentTypeId": 1042,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "Sample Document1.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #5",
        "cmsFileCreatedDate": "2025-05-29T20:54:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": true,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8821445",
        "status": "New",
        "versionId": 8065532,
        "cmsDocType": {
            "documentTypeId": 1041,
            "documentType": "MG 14",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "Sample Document1.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 Test",
        "cmsFileCreatedDate": "2025-05-29T20:51:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8821444",
        "status": "New",
        "versionId": 8117974,
        "cmsDocType": {
            "documentTypeId": 1042,
            "documentType": null,
            "documentCategory": "Exhibit"
        },
        "cmsOriginalFileName": "Sample Document1.pdf",
        "presentationTitle": "MG11 CARMINE Victim #Test",
        "cmsFileCreatedDate": "2025-05-29T20:49:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": false,
        "classification": "Exhibit",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8821443",
        "status": "New",
        "versionId": 8117972,
        "cmsDocType": {
            "documentTypeId": 1006,
            "documentType": "MG 5",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "Sample Document1.pdf",
        "presentationTitle": "Newtest",
        "cmsFileCreatedDate": "2025-05-29T20:48:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": true,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": false,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8821354",
        "status": "New",
        "versionId": 8072913,
        "cmsDocType": {
            "documentTypeId": 1031,
            "documentType": null,
            "documentCategory": "Statement"
        },
        "cmsOriginalFileName": "Test Doc Exhibit2.pdf",
        "presentationTitle": "MG11 CARMINE Victim, 22/09/2024 #6",
        "cmsFileCreatedDate": "2025-05-29T10:07:00Z",
        "isOcrProcessed": false,
        "categoryListOrder": 2,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": 2783632,
        "hasFailedAttachments": false,
        "hasNotes": true,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": false,
        "classification": "Statement",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": false,
        "renameStatus": "IsStatement",
        "reference": null
    },
    {
        "documentId": "CMS-8821353",
        "status": "New",
        "versionId": 8062954,
        "cmsDocType": {
            "documentTypeId": 1059,
            "documentType": "MG 11(R)",
            "documentCategory": "MGForm"
        },
        "cmsOriginalFileName": "Test Doc Exhibit.pdf",
        "presentationTitle": "Test",
        "cmsFileCreatedDate": "2025-05-29T10:01:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": true,
        "isInbox": false,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8861171",
        "status": "New",
        "versionId": 8098069,
        "cmsDocType": {
            "documentTypeId": -5,
            "documentType": null,
            "documentCategory": "Communication"
        },
        "cmsOriginalFileName": "test_pages.pdf",
        "presentationTitle": "Test",
        "cmsFileCreatedDate": "2025-09-05T14:31:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8861059",
        "status": "New",
        "versionId": 8110464,
        "cmsDocType": {
            "documentTypeId": 1029,
            "documentType": null,
            "documentCategory": "Communication"
        },
        "cmsOriginalFileName": "PDF.test.pdf",
        "presentationTitle": "Test PDF",
        "cmsFileCreatedDate": "2025-09-05T12:22:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8843488",
        "status": "New",
        "versionId": 8082207,
        "cmsDocType": {
            "documentTypeId": 1029,
            "documentType": null,
            "documentCategory": "Communication"
        },
        "cmsOriginalFileName": "MCLOVEMG3.pdf",
        "presentationTitle": "Other Comm (In)",
        "cmsFileCreatedDate": "2025-07-23T13:19:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8843482",
        "status": "New",
        "versionId": 8082203,
        "cmsDocType": {
            "documentTypeId": 1029,
            "documentType": null,
            "documentCategory": "Communication"
        },
        "cmsOriginalFileName": "SearchPII.pdf",
        "presentationTitle": "J Cooper Test File",
        "cmsFileCreatedDate": "2025-07-23T13:15:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": true,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "CMS-8837611",
        "status": "New",
        "versionId": 8082234,
        "cmsDocType": {
            "documentTypeId": 1029,
            "documentType": null,
            "documentCategory": "Communication"
        },
        "cmsOriginalFileName": "Casework error.pdf",
        "presentationTitle": "Other Comm (In)",
        "cmsFileCreatedDate": "2025-07-14T10:46:00Z",
        "isOcrProcessed": true,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "Ok"
        },
        "parentDocumentId": "",
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": true,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": false,
        "classification": "Other",
        "isWitnessManagement": false,
        "canReclassify": true,
        "canRename": true,
        "renameStatus": "CanRename",
        "reference": null
    },
    {
        "documentId": "PCD-141956",
        "status": "New",
        "versionId": 141956,
        "cmsDocType": {
            "documentTypeId": 1029,
            "documentType": "PCD",
            "documentCategory": "Review"
        },
        "cmsOriginalFileName": "PCD-141956.pdf",
        "presentationTitle": "PCD-141956",
        "cmsFileCreatedDate": "2025-01-16",
        "isOcrProcessed": false,
        "categoryListOrder": null,
        "presentationFlags": {
            "read": "Ok",
            "write": "DocTypeNotAllowed"
        },
        "parentDocumentId": null,
        "witnessId": null,
        "hasFailedAttachments": false,
        "hasNotes": false,
        "conversionStatus": "DocumentConverted",
        "piiVersionId": null,
        "isUnused": false,
        "isInbox": false,
        "classification": null,
        "isWitnessManagement": false,
        "canReclassify": false,
        "canRename": false,
        "renameStatus": null,
        "reference": null
    }
]
*/

export const useGetCaseDocumentList = (p: {
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const axiosInstance = useAxiosInstance();

  const { data, error, isLoading } = useSWR('getCaseDocumentList', () => {
    return getCaseDocumentListFromAxiosInstance({ axiosInstance, ...p });
  });

  return { data, error, isLoading };
};

export const documentSchema = z
  .object({
    documentId: z.string(),
    status: z.string(),
    cmsDocType: z.object({
      documentTypeId: z.number(),
      documentType: z.string().nullish(),
      documentCategory: z.string()
    }),
    cmsOriginalFileName: z.string(),
    presentationTitle: z.string(),
    isUnused: z.boolean(),
    hasNotes: z.boolean()
  })
  .brand<'TDocument'>();
export const documentListSchema = z.array(documentSchema);
export type TDocument = z.infer<typeof documentSchema>;
export type TDocumentList = TDocument[];
