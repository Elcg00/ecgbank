export function SelectableCard({
  name,
  value,
  title,
  description,
  type = "radio",
  defaultChecked,
}: {
  name: string;
  value: string;
  title: string;
  description?: string;
  type?: "checkbox" | "radio";
  defaultChecked?: boolean;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
        required={type === "radio"}
      />
      <span className="block rounded-2xl border-2 border-divider bg-app px-4 py-3.5 transition-colors peer-checked:border-accent-700 peer-checked:bg-accent-100 dark:peer-checked:bg-accent-900/30">
        <span className="block font-semibold text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-[13px] text-ink-muted">{description}</span>}
      </span>
    </label>
  );
}
