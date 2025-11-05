import './GovUkLink.scss';

type TProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const GovUkLink = (p: TProps) => {
  const { className, ...otherProps } = p;
  return <a className={`govuk-link ${className}`} {...otherProps} />;
};
