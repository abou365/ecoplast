import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Définition du type des styles
type Styles = {
  container: ViewStyle;
  title: TextStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  formContainer: ViewStyle; // Ajout de la clé formContainer
  input: TextStyle;
  label: TextStyle;
  buttonsContainer: ViewStyle;
  spacer: ViewStyle;
};

// Définition des props pour le composant fonctionnel
type Props = {
  name: string;
  email: string;
  avatar: string;
};

const EditProfileScreen: React.FC<Props> = ({ avatar }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [newAvatar, setNewAvatar] = useState(avatar);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData(user);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = { ...userData, firstName, lastName, email, avatar: newAvatar };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      Alert.alert('Succès', 'Profil mis à jour avec succès.');
      router.back(); // Retour à la page de profil
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  const handleCancel = () => {
    router.back(); // Annuler et revenir à la page précédente
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le profil</Text>

      {/* Photo de profil */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: newAvatar }} style={styles.avatar} />
        {/* Tu pourrais ajouter une fonctionnalité pour changer l'image de l'avatar ici */}
      </View>

      {/* Formulaire de modification */}
      <View style={styles.formContainer}> {/* Utilisation de formContainer ici */}
        <Text style={styles.label}>Prénom :</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Nom :</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Boutons */}
      <View style={styles.buttonsContainer}>
        <Button title="Sauvegarder" onPress={handleSaveProfile} />
        <View style={styles.spacer} />
        <Button title="Annuler" onPress={handleCancel} color="gray" />
      </View>
    </View>
  );
};

// Définition des styles
const styles: Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  formContainer: { // Définition de formContainer ici
    width: '80%',
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    marginTop: 30,
    width: '80%',
  },
  spacer: {
    height: 15,
  },
});

export default EditProfileScreen;
