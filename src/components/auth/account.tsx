import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { StyleSheet, View, Alert, Button } from 'react-native'
import { useSession } from '../../contexts/SessionContext'
import { TextInput } from 'react-native-gesture-handler'

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
    <View className='gap-2'>
      <View>
        <TextInput 
          className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-gray-400 border border-neutral-700" 
          placeholder="Email" 
          value={session?.user?.email} 
          editable={false} 
          placeholderTextColor='#ccc'
        />
      </View>
      <View>
        <TextInput 
          className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
          placeholder="Username" 
          value={username || ''} 
          onChangeText={setUsername} 
          placeholderTextColor='#ccc'
        />
      </View>
      <View>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  )
}