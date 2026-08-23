import { LANGUAGES } from '../../utils/constants'

export const LanguageSelect = ({ value, onChange, disabled }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Select Programming Language"
      className="px-3 py-1.5 bg-elevated border border-border rounded-button text-text-primary text-xs font-semibold cursor-pointer transition-colors duration-200 hover:border-accent-red/40 focus:outline-none focus:border-accent-red disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id} className="bg-surface text-text-primary">
          {lang.label} ({lang.ext})
        </option>
      ))}
    </select>
  )
}
