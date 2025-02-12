import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '@/lib/api/client/authApi';
import RadioGroup from 'react-native-radio-buttons-group';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Définition des types d'utilisateur pour le choix avec des boutons radio
const USER_TYPES = [
  { id: 'CLIENT', label: 'Client', value: 'CLIENT' },
  { id: 'PRE_COLLECTOR', label: 'Pré-collecteur', value: 'PRE_COLLECTOR' }
];

export default function RegisterScreen() {
  const router = useRouter(); // Permet la navigation dans l'application

  // Déclaration du state pour gérer les valeurs du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    type: 'CLIENT', // Valeur par défaut : Client
    location: '' // Champ pour stocker la localisation si nécessaire
  });

  const [loading, setLoading] = useState(false); // Gère l'affichage du chargement
  const [locating, setLocating] = useState(false); // Gère l'état du bouton de localisation
  const [showPassword, setShowPassword] = useState(false); // Contrôle l'affichage du mot de passe

  // Fonction pour récupérer la position actuelle
  const getCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à votre localisation.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;
      setFormData({ ...formData, location: locationString });

      Alert.alert('Localisation obtenue', `Position: ${locationString}`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
    } finally {
      setLocating(false);
    }
  };

  // Fonction de gestion de l'inscription
  const handleRegister = async () => {
    if (loading) return; // Empêche plusieurs soumissions en parallèle
    setLoading(true);
    
    try {
      // Vérifie si tous les champs sont remplis
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.password || !formData.phoneNumber || 
          (formData.type === 'PRE_COLLECTOR' && !formData.location)) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }

      console.log(formData); // Affiche les données dans la console pour debug

      // Appel à l'API pour enregistrer l'utilisateur
      await authApi.register(formData);

      // Message de confirmation et redirection vers la page de connexion
      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => router.push('/auth/login') }
      ]);
    } catch (error) {
      // Gestion correcte du typage de l'erreur
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // Désactive le chargement après la requête
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {/* Champ de saisie pour le prénom */}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={formData.firstName}
        onChangeText={(text) => setFormData({...formData, firstName: text})}
      />

      {/* Champ de saisie pour le nom */}
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.lastName}
        onChangeText={(text) => setFormData({...formData, lastName: text})}
      />

      {/* Champ de saisie pour l'email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
      />

      {/* Champ de saisie pour le mot de passe avec icône */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={24} 
            color="#888" 
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Champ de saisie pour le numéro de téléphone */}
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
      />

      {/* Boutons radio pour choisir le type de compte */}
      <View style={styles.radioContainer}>
        <Text style={styles.selectLabel}>Type de compte</Text>
        <RadioGroup
          radioButtons={USER_TYPES}
          onPress={(selectedId) => setFormData({...formData, type: selectedId})}
          selectedId={formData.type}
          layout="row"
        />
      </View>

      {/* Champ de localisation pour les pré-collecteurs */}
      {formData.type === 'PRE_COLLECTOR' && (
        <View>
          <Text style={styles.selectLabel}>Localisation (latitude, longitude)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 48.8566, 2.3522"
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
          />
          <TouchableOpacity 
            style={[styles.locateButton, locating && styles.buttonDisabled]}
            onPress={getCurrentLocation}
            disabled={locating}
          >
            {locating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Obtenir ma position</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* Bouton d'inscription */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading} // Désactive le bouton si chargement en cours
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
      </TouchableOpacity>

      {/* Lien vers la page de connexion */}
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


// Styles de l'interface utilisateur
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 40,
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
  radioContainer: {
    marginBottom: 15,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  locateButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  icon: {
    padding: 10,
  },
});

