import { DocumentSidebarTag } from './DocumentSidebarTag';
import './templates/GovUkAccordion.scss';
import { NotesIcon } from './templates/NotesIcon';

export const DocumentSidebarAccordionNoDocumentsAvailable = () => {
  return (
    <div
      style={{
        borderTop: 'solid 1px #b1b4b6',
        background: '#ffffff',
        height: '60px',
        padding: '12px'
      }}
    >
      There are no documents available.
    </div>
  );
};
export const DocumentSidebarAccordionDocumentTemplate = (p: {
  documentName: string;
  documentDate: string;
  ActiveDocumentTag?: boolean;
  NewVersionTag?: boolean;
  NewTag?: boolean;
  ReclassifiedTag?: boolean;
  UpdatedTag?: boolean;
  notesStatus: 'disabled' | 'newNotes' | 'none';
  showLeftBorder?: boolean;
  onDocumentClick: () => void;
  onNotesClick: () => void;
}) => {
  return (
    <div
      className={`document-select-accordion-document ${p.showLeftBorder ? 'show-left-border' : ''}`}
    >
      <div className="document-select-accordion-document--inner-wrapper">
        <div className="document-select-accordion-document--tag-wrapper">
          {p.ActiveDocumentTag && (
            <DocumentSidebarTag tagName="ActiveDocument" />
          )}
          {p.NewTag && <DocumentSidebarTag tagName="New" />}
          {p.NewVersionTag && <DocumentSidebarTag tagName="NewVersion" />}
          {p.ReclassifiedTag && <DocumentSidebarTag tagName="Reclassified" />}
          {p.UpdatedTag && <DocumentSidebarTag tagName="Updated" />}
        </div>
        <div>
          <a className="govuk-link" onClick={() => p.onDocumentClick()}>
            {p.documentName}
          </a>
        </div>
        <div>Date: {p.documentDate}</div>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}
      >
        <a
          className={`govuk-link ${p.notesStatus === 'disabled' ? 'disabled' : ''}`}
          onClick={() => {
            if (p.notesStatus !== 'disabled') p.onNotesClick();
          }}
        >
          <NotesIcon width={20} notesStatus={p.notesStatus} />
        </a>
      </div>
    </div>
  );
};
