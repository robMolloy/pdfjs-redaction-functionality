import { ReactNode, useEffect, useState } from 'react';
import './GovUkAccordion.scss';

export const GovUkAccordionSectionTemplate = (p: {
  title: string;
  children: ReactNode;
  isExpandedController: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(p.isExpandedController);
  }, [p.isExpandedController]);

  return (
    <>
      <div className="govuk-accordion__section">
        <div className="govuk-accordion__section-header">
          <h2 className="govuk-accordion__section-heading">
            <div>
              <button
                type="button"
                aria-controls="accordion-default-content"
                className="govuk-accordion__section-button"
                aria-expanded={isExpanded}
                aria-label={p.title}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="govuk-accordion__section-toggle">
                  <span className="govuk-accordion__section-toggle-focus">
                    <span className="govuk-accordion__section-toggle-text">
                      {p.title}
                    </span>
                    <span className="govuk-accordion-nav__chevron-wrapper">
                      <span
                        className={`govuk-accordion-nav__chevron${!isExpanded ? ' govuk-accordion-nav__chevron--down' : ''}`}
                      />
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </h2>
        </div>
      </div>
      <div hidden={!isExpanded}>
        <div className="govuk-accordion-content-wrapper">{p.children}</div>
      </div>
    </>
  );
};

export const GovUkAccordionTemplate = (p: { children: ReactNode }) => {
  return (
    <div className="govuk-accordion" data-testid="accordion">
      {p.children}
    </div>
  );
};
export const GovUkAccordionOpenCloseLinkTemplate = (p: {
  isExpandedController: boolean;
  onClick: () => void;
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'end' }}>
      <a
        className="govuk-link"
        onClick={() => p.onClick()}
        style={{ paddingBottom: '8px', cursor: 'pointer' }}
      >
        {p.isExpandedController ? 'Close' : 'Open'} all sections
      </a>
    </div>
  );
};
