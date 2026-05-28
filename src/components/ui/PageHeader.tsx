interface PageHeaderProps {
  title: string
  description?: string
  compact?: boolean
  children?: React.ReactNode
}

export function PageHeader({ title, description, compact = false, children }: PageHeaderProps) {
  return (
    <div className={`flex flex-col border-b border-gray-200 md:flex-row md:justify-between ${
      compact ? 'mb-4 gap-2 pb-3 md:items-center' : 'mb-6 gap-4 pb-5 md:items-end'
    }`}>
      <div>
        {!compact && (
          <p className="mb-2 text-xs font-bold uppercase text-cidet-cyan-dark">CIDET Certificación</p>
        )}
        <h1 className={compact ? 'text-2xl font-extrabold text-gray-950' : 'text-3xl font-extrabold text-gray-950'}>
          {title}
        </h1>
        {description && (
          <p className={`${compact ? 'mt-1' : 'mt-2'} max-w-2xl text-sm text-gray-500`}>{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
