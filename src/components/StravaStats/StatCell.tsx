interface StatCellProps {
  value: string
  label: string
  border?: boolean
}

export default function StatCell({ value, label, border = true }: StatCellProps) {
  return (
    <div className={`px-4 py-4 ${border ? 'border-r border-ink/10' : ''}`}>
      <p className="font-display text-xl md:text-2xl text-ink tracking-wide leading-none">{value}</p>
      <p className="font-mono text-xs text-muted mt-1">{label}</p>
    </div>
  )
}