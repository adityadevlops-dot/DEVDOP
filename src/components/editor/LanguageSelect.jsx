import { LANGUAGES } from '../../utils/constants'

export const LanguageSelect = ({ value, onChange, disabled }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="px-3 py-2 bg-elevated border border-border rounded-button text-text-primary text-sm font-medium transition-colors duration-200 focus:outline-none focus:border-accent-red disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}
