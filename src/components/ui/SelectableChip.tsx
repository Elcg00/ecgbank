export function SelectableChip({
  name,
  value,
  label,
  type = "checkbox",
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  type?: "checkbox" | "radio";
  defaultChecked?: boolean;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="inline-flex items-center rounded-full border border-divider bg-app px-4 py-2 text-[14px] font-semibold text-ink transition-colors peer-checked:border-accent-700 peer-checked:bg-accent-100 peer-checked:text-accent-800 dark:peer-checked:bg-accent-900/40 dark:peer-checked:text-accent-300">
        {label}
      </span>
    </label>
  );
}
