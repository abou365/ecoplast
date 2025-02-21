import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import RadioGroup from 'react-native-radio-buttons-group';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://192.168.10.102:8000',  // Votre adresse IP WiFi réelle
  default: 'http://localhost:8000'
});

const USER_TYPES = [
  { id: 'CLIENT', label: 'Client', value: 'CLIENT' },
  { id: 'PRE_COLLECTOR', label: 'Pré-collecteur', value: 'PRE_COLLECTOR' }
];

const COLLECTOR_CATEGORIES = [
  { id: 'POUBELLE', label: 'Poubelle', value: 'POUBELLE' },
  { id: 'CENTRE_TRI', label: 'Centre de tri', value: 'CENTRE_TRI' },
  { id: 'DECHETTERIE', label: 'Déchetterie', value: 'DECHETTERIE' },
  { id: 'TOUS', label: 'Tous', value: 'TOUS' }
];

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    type: 'CLIENT',
    category: '',
    latitude: null,
    longitude: null,
  });

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à votre localisation.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      console.log('Coordonnées obtenues:', { latitude, longitude });

      if (latitude && longitude) {
        setFormData((prevData) => ({
          ...prevData,
          latitude,
          longitude,
        }));

        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (address && address[0]) {
          const formattedAddress = `${address[0].city}, ${address[0].region}, ${address[0].country}`;
          setAddress(formattedAddress);
          console.log('Adresse formatée:', formattedAddress);
          Alert.alert('Localisation obtenue', `Position: ${formattedAddress}`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la localisation:", error);
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
    } finally {
      setLocating(false);
    }
  };

  const handleRegister = async () => {
    if (loading) return;

    // Validation des champs
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.phoneNumber) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation spécifique pour les pré-collecteurs
    if (formData.type === 'PRE_COLLECTOR') {
      if (!formData.category) {
        Alert.alert('Erreur', 'Veuillez sélectionner une catégorie de pré-collecteur.');
        return;
      }
      if (!formData.latitude || !formData.longitude) {
        Alert.alert('Erreur', 'Veuillez définir votre localisation.');
        return;
      }
    }

    setLoading(true);

    try {
      console.log('URL de l\'API:', `${API_URL}/api/v1/users`);
      console.log('Données envoyées:', formData);

      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      const data = await response.json();
      console.log('Réponse de l\'API:', data);
      
      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => router.push('/auth/login') }
      ]);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      const errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={formData.firstName}
        onChangeText={(text) => setFormData({...formData, firstName: text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.lastName}
        onChangeText={(text) => setFormData({...formData, lastName: text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
      />

      <View style={styles.radioContainer}>
        <Text style={styles.selectLabel}>Type de compte</Text>
        <RadioGroup
          radioButtons={USER_TYPES}
          onPress={(selectedId) => setFormData({...formData, type: selectedId})}
          selectedId={formData.type}
          layout="row"
        />
      </View>

      {formData.type === 'PRE_COLLECTOR' && (
        <>
          <View style={styles.radioContainer}>
            <Text style={styles.selectLabel}>Type de point de collecte</Text>
            <View style={styles.categoriesContainer}>
              <RadioGroup
                radioButtons={COLLECTOR_CATEGORIES}
                onPress={(selectedId) => setFormData({...formData, category: selectedId})}
                selectedId={formData.category}
                layout="row"
                containerStyle={styles.categoriesGrid}
              />
            </View>
          </View>

          <View>
            <Text style={styles.selectLabel}>Localisation (ville, région, pays)</Text>
            <TextInput
              style={styles.input}
              placeholder="Localisation"
              value={address}
              editable={false}
            />
            <TouchableOpacity 
              style={[styles.locateButton, locating && styles.buttonDisabled]}
              onPress={getCurrentLocation}
              disabled={locating}
            >
              {locating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Obtenir ma position</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f9f9f9' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center', 
    marginTop: 40 
  },
  input: { 
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  radioContainer: { 
    marginBottom: 15 
  },
  categoriesContainer: {
    marginTop: 10
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  selectLabel: { 
    fontSize: 16, 
    marginBottom: 5, 
    color: '#333' 
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 10 
  },
  locateButton: { 
    backgroundColor: '#28a745', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 10 
  },
  buttonDisabled: { 
    backgroundColor: '#cccccc' 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  link: { 
    color: '#007bff', 
    marginTop: 15, 
    textAlign: 'center', 
    textDecorationLine: 'underline' 
  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  passwordInput: { 
    flex: 1, 
    height: 50 
  },
  icon: { 
    padding: 10 
  },
});