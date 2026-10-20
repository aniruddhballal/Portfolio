interface StatCellProps {
  value: string
  label: string
  border?: boolean
}

export default function StatCell({ value, label, border = true }: StatCellProps) {
  return (
    <div className={`px-4 py-5 ${border ? 'border-r border-ink/10' : ''}`}>
      <p className="font-display text-2xl md:text-3xl text-ink tracking-wide leading-none">{value}</p>
      <p className="font-mono text-xs text-ink/55 mt-1.5">{label}</p>
    </div>
  )
}
