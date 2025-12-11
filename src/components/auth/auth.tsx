import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button } from 'react-native'
import { supabase } from '../../utils/supabase'
import { TextInput } from 'react-native-gesture-handler'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className="flex-1 justify-center items-center gap-2">
      <View>
        <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
            className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        />
      </View>
      <View>
        <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor="#ccc"
            className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        />
      </View>
      <View className="w-72 mt-2">
        <Button  title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View className="w-72 mt-2">
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}