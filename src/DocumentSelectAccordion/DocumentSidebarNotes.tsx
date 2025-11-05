import { useState } from 'react';
import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';
import { useGetDocumentNotes } from './getters/useGetDocumentNotes';
import { CloseIconButton } from './templates/CloseIconButton';
import { GovUkButton } from './templates/GovUkButton';
import { GovUkLink } from './templates/GovUkLink';
import { GovUkTextarea } from './templates/GovUkTextarea';

export const DocumentSidebarNotes = (p: {
  urn: string;
  caseId: number;
  documentId: string;
  onBackButtonClick: () => void;
}) => {
  const [text, setText] = useState('');

  const resp = useGetDocumentNotes({
    urn: p.urn,
    caseId: p.caseId,
    documentId: p.documentId
  });
  // const axiosInstance = useAxiosInstance();

  // useEffect(() => {
  //   (async () => {
  //     getDocumentNotesFromAxiosInstance({
  //       axiosInstance,
  //       urn: p.urn,
  //       documentId: p.documentId,
  //       caseId: p.caseId
  //     });
  //   })();
  // }, [axiosInstance]);
  return (
    <DocumentSidebarWrapper>
      <GovUkButton
        onClick={() => {
          console.log(resp);
        }}
      >
        click
      </GovUkButton>
      <div
        style={{
          borderBottom: 'solid 1px #b1b4b6',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 700, padding: '10px' }}>
          Notes
        </div>
        <CloseIconButton onClick={() => p.onBackButtonClick()} />
      </div>
      <div
        style={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <label
          htmlFor="notes-textarea"
          className="govuk-label"
          style={{ fontWeight: 700 }}
        >
          Add a note to the document
        </label>
        <GovUkTextarea
          id="notes-textarea"
          value={text}
          onInput={(x) => setText(x)}
          maxLength={500}
          rows={5}
        />
        <div>You have {500 - text.length} characters remaining</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <GovUkButton onClick={() => window.alert('save and continue')}>
            Save and close
          </GovUkButton>
          <GovUkLink onClick={() => p.onBackButtonClick()}>Cancel</GovUkLink>
        </div>
        <pre>{JSON.stringify(resp, null, 2)}</pre>
      </div>
    </DocumentSidebarWrapper>
  );
};
