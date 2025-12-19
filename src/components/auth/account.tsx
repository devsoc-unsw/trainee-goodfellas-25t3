import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { View, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useSession } from '../../contexts/SessionContext'
import { TextInput } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'

/**
 * Account Component
 * Handles user profile information and authentication
 */
export default function Account() {
  const { session } = useSession()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='gap-4'>
      {/* Email Field (Read-only) */}
      <View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="mail" size={16} color="#9ca3af" />
          <Text className="text-gray-400 text-sm ml-2">Email Address</Text>
        </View>
        <TextInput 
          className="w-full h-12 px-4 rounded-lg bg-neutral-900 text-gray-400 border border-neutral-700" 
          placeholder="Email" 
          value={session?.user?.email} 
          editable={false} 
          placeholderTextColor='#6b7280'
        />
      </View>

      {/* Username Field */}
      <View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="person" size={16} color="#9ca3af" />
          <Text className="text-gray-400 text-sm ml-2">Username</Text>
        </View>
        <TextInput 
          className="w-full h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
          placeholder="Enter your username" 
          value={username || ''} 
          onChangeText={setUsername} 
          placeholderTextColor='#6b7280'
        />
      </View>

      {/* Update Profile Button */}
      <TouchableOpacity
        onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
        disabled={loading}
        className={`rounded-lg p-4 items-center flex-row justify-center ${
          loading ? 'bg-blue-600/50' : 'bg-blue-600'
        }`}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Updating...</Text>
          </>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Update Profile</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', onPress: () => supabase.auth.signOut(), style: 'destructive' },
            ]
          );
        }}
        className="rounded-lg border border-red-500/50 bg-red-900/20 p-4 items-center flex-row justify-center"
      >
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text className="text-red-400 font-semibold ml-2">Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}