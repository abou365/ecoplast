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

const USER_TYPES = [
  { id: 'CLIENT', label: 'Client', value: 'CLIENT' },
  { id: 'PRE_COLLECTOR', label: 'Pré-collecteur', value: 'PRE_COLLECTOR' }
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
    latitude: null,  // Latitude de localisation
    longitude: null, // Longitude de localisation
  });

  const [address, setAddress] = useState(''); // Nouveau state pour stocker l'adresse
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

      console.log("Coordonnées obtenues : ", latitude, longitude);

      if (latitude && longitude) {
        // Mise à jour de formData avec les coordonnées
        setFormData((prevData) => ({
          ...prevData,
          latitude,   // Mettre à jour latitude
          longitude,  // Mettre à jour longitude
        }));

        // Géocodage inverse pour obtenir l'adresse
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (address && address[0]) {
          const formattedAddress = `${address[0].city}, ${address[0].region}, ${address[0].country}`;
          
          // Mise à jour du champ address pour afficher l'adresse sans l'envoyer au backend
          setAddress(formattedAddress);

          console.log("Adresse obtenue: ", formattedAddress);
          Alert.alert('Localisation obtenue', `Position: ${formattedAddress}`);
        } else {
          Alert.alert('Erreur', 'Adresse introuvable pour cette position.');
        }
      } else {
        Alert.alert('Erreur', 'Les coordonnées sont introuvables.');
      }

    } catch (error) {
      console.error("Erreur lors de la récupération de la localisation: ", error);
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
    } finally {
      setLocating(false);
    }
  };

  // Fonction de gestion de l'inscription
  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      console.log("Données du formulaire avant l'inscription: ", formData);

      // Validation des champs obligatoires pour un pré-collecteur
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.password || !formData.phoneNumber || 
          formData.type === 'PRE_COLLECTOR' && (!formData.latitude || !formData.longitude)) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }

      // Appel API pour l'enregistrement de l'utilisateur
      const response = await authApi.register({
        ...formData,
        // Envoi uniquement des coordonnées latitude et longitude
        latitude: formData.latitude, 
        longitude: formData.longitude, 
      });

      console.log("Réponse de l'API lors de l'inscription: ", response);

      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => router.push('/auth/login') }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription';
      console.error("Erreur lors de l'inscription: ", errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {/* Champs pour les informations personnelles */}
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

      {/* Champ de localisation pour les pré-collecteurs */}
      {formData.type === 'PRE_COLLECTOR' && (
        <View>
          <Text style={styles.selectLabel}>Localisation (ville, région, pays)</Text>
          <TextInput
            style={styles.input}
            placeholder="Localisation"
            value={address}  // Afficher l'adresse sans la stocker dans formData
            editable={false}  // Le champ est en lecture seule
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
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', marginTop: 40 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  radioContainer: { marginBottom: 15 },
  selectLabel: { fontSize: 16, marginBottom: 5, color: '#333' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginTop: 10 },
  locateButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginTop: 10 },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#007bff', marginTop: 15, textAlign: 'center', textDecorationLine: 'underline' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  passwordInput: { flex: 1, height: 50 },
  icon: { padding: 10 },
});
