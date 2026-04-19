import Image from 'next/image'

interface UserAvatarProps {
  name: string | null | undefined
  image: string | null | undefined
  size?: number
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserAvatar({ name, image, size = 32, className = '' }: UserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? 'User'}
        width={size}
        height={size}
        className={`rounded-lg object-cover ${className}`}
      />
    )
  }

  const initials = name ? getInitials(name) : '?'

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.35) }}
    >
      {initials}
    </div>
  )
}
