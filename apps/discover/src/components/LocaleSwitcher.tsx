import { localeSegment, locales } from "../discover-data.js";

type LocaleSwitcherProps = {
  locale: string;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  return (
    <select
      className="discover-locale-switcher"
      aria-label="Language"
      defaultValue={locale}
      onChange={event => {
        window.location.href = `/${localeSegment(event.currentTarget.value)}/`;
      }}
    >
      {locales.map(item => (
        <option key={item.locale} value={item.locale}>{item.label}</option>
      ))}
    </select>
  );
}
