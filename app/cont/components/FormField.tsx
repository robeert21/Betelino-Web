type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
};

export function FormField({ label, name, error, ...props }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-umber-soft">{label}</span>
      <input
        name={name}
        className={`rounded-[8px] border bg-warm-cream px-4 py-3 text-ink-umber outline-none transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-sage-trust ${
          error ? "border-signal-red" : "border-border-sand"
        }`}
        {...props}
      />
      {error && <span className="text-sm text-signal-red">{error}</span>}
    </label>
  );
}
