import './GovUkTextarea.scss';

type TTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TProps = Omit<TTextareaProps, 'onInput'> & {
  onInput: (x: string) => void;
};

export const GovUkTextarea = (p: TProps) => {
  const { className, onInput, ...otherProps } = p;

  return (
    <textarea
      className={`govuk-textarea ${className}`}
      onInput={(e) => {
        const x = (e.target as unknown as { value: string }).value;
        onInput(x);
      }}
      {...otherProps}
    />
  );
};
