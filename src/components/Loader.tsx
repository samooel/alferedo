const BARS = [
  { delay: '0.0s' },
  { delay: '0.3s' },
  { delay: '0.1s' },
  { delay: '0.4s' },
  { delay: '0.2s' },
]

interface LoaderProps {
  fullPage?: boolean
  message?: string
}

export default function Loader({ fullPage = false, message }: LoaderProps) {
  const visual = (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-end gap-1.5 h-12">
        {BARS.map((bar, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-white"
            style={{
              height: '100%',
              transformOrigin: 'bottom',
              animation: `eq 0.85s ease-in-out infinite`,
              animationDelay: bar.delay,
            }}
          />
        ))}
      </div>
      {message && (
        <p className="text-white/60 text-sm tracking-wide">{message}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 flex items-center justify-center">
        {visual}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {visual}
    </div>
  )
}
