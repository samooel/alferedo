'use client'

import { Clock, Headphones, Heart, Volume2, Bell } from 'lucide-react'
import SoundCard from '@/src/components/SoundCard'
import Loader from '@/src/components/Loader'
import { useProfilePage } from './Profile.hook'

export default function ProfilePage() {
  const {
    user,
    favorites,
    volume,
    setVolume,
    notifications,
    setNotifications,
    favoriteSounds,
    loadingSounds,
    handleLogout,
  } = useProfilePage()

  if (!user) return <Loader fullPage />

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* User info */}
        <div className="bg-white/15 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 shadow-xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border border-white/30 object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-3xl font-semibold uppercase">
                {user.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-white/60 mt-0.5 text-sm">@{user.username}</p>
              <p className="text-white/50 text-sm">{user.email}</p>
              {user.registeredDate && (
                <p className="text-white/40 text-xs mt-1">
                  Member since {new Date(user.registeredDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-full transition-all shrink-0"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { Icon: Clock,      label: 'Time Listened', value: '12h 34m' },
            { Icon: Headphones, label: 'Sessions',       value: '47'      },
            { Icon: Heart,      label: 'Favorites',      value: String(favorites.length) },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="bg-white/15 backdrop-blur-xl rounded-[24px] p-6 border border-white/20 shadow-xl flex items-center gap-4">
              <Icon size={22} className="text-white/60 shrink-0" />
              <div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-white/60 text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Favorite sounds */}
        <div className="bg-white/15 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Heart size={18} /> Favorite Sounds
          </h2>
          {loadingSounds ? (
            <Loader />
          ) : favoriteSounds.length === 0 ? (
            <p className="text-white/50 text-sm">No favorites yet — tap the heart on a sound card to save one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteSounds.map(sound => (
                <SoundCard key={sound.id} sound={sound} />
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white/15 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-6">Settings</h2>
          <div className="flex flex-col divide-y divide-white/10">

            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-white/60" />
                <div>
                  <p className="font-medium text-sm">Default Volume</p>
                  <p className="text-white/40 text-xs mt-0.5">Applied when a sound starts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-28 accent-white cursor-pointer"
                />
                <span className="text-white/60 text-sm w-9 text-right">{volume}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-white/60" />
                <div>
                  <p className="font-medium text-sm">Notifications</p>
                  <p className="text-white/40 text-xs mt-0.5">Session reminders and tips</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full border transition-all relative ${notifications ? 'bg-white/40 border-white/50' : 'bg-white/10 border-white/20'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
