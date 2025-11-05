import { AxiosInstance } from 'axios';
import useSWR from 'swr';
import { useAxiosInstance } from './useAxiosInstance';

export const getDocumentNotesFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  documentId: string | undefined;
  caseId: number | undefined;
}) => {
  const url = `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/notes`;
  const response = await p.axiosInstance.get(url);

  console.log({ x: response.data });

  return response.data;
};
/*
[
    {
      "id": 8884800,
      "createdByName": "Robert Molloy",
      "sortOrder": 1,
      "date": "2025-11-04",
      "text": "here is a note",
      "type": "MA"
    }
]
*/

export const useGetDocumentNotes = (p: {
  urn: string | undefined;
  caseId: number | undefined;
  documentId: string | undefined;
}) => {
  const axiosInstance = useAxiosInstance();

  const { data, error, isLoading } = useSWR('getDocumentNotes', () => {
    return getDocumentNotesFromAxiosInstance({ axiosInstance, ...p });
  });
  console.log({ data });

  return { data, error, isLoading };
};

// export const documentSchema = z
//   .object({
//     documentId: z.string(),
//     status: z.string(),
//     cmsDocType: z.object({
//       documentTypeId: z.number(),
//       documentType: z.string().nullish(),
//       documentCategory: z.string()
//     }),
//     cmsOriginalFileName: z.string(),
//     presentationTitle: z.string(),
//     isUnused: z.boolean(),
//     hasNotes: z.boolean()
//   })
//   .brand<'TDocument'>();
// export const documentListSchema = z.array(documentSchema);
// export type TDocument = z.infer<typeof documentSchema>;
// export type TDocumentList = TDocument[];
