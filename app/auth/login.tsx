import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '../../lib/api/client/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
  
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
  
      // Sauvegarder le token
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      console.log(response)
  
      // Rediriger vers la page de profil
      router.replace('/user/profile');
    } catch (error: any) {
      // Loguer l'erreur pour mieux la comprendre
      console.error('Erreur de connexion:', error);
  
      // Afficher l'alerte avec le message d'erreur
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Une erreur est survenue lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <Button title="Se connecter" onPress={handleLogin} disabled={loading} />
      )}
      <Text 
        style={styles.link} 
        onPress={() => !loading && router.push('/auth/register')}
      >
        Pas encore de compte ? S'inscrire
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  link: {
    color: '#007bff',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: 10,
  },
});