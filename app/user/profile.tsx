import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Définition du type des styles
type Styles = {
  container: ViewStyle;
  title: TextStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  profileContainer: ViewStyle;
  infoContainer: ViewStyle;
  label: TextStyle;
  value: TextStyle;
  card: ViewStyle;
  cardText: TextStyle;
  buttonsContainer: ViewStyle;
  spacer: ViewStyle;
};

// Définition des props pour le composant fonctionnel
type Props = {
  name: string;
  email: string;
  avatar: string;
};

const ProfileScreen: React.FC<Props> = ({  avatar }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null); // On stocke ici toutes les données de l'utilisateur
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData(user); // Récupère toutes les données utilisateur
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', onPress: () => router.replace('/auth/login') },
      ]
    );
  };

  // Fonction de modification du profil
  const handleEditProfile = () => {
    router.push('/user/edit-profile'); // Redirection vers la page de modification du profil
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil utilisateur</Text>

      {/* Photo de profil en haut */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </View>

      {/* Informations utilisateur */}
      <View style={styles.profileContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{userData?.firstName} {userData?.lastName || 'Nom non disponible'}</Text> {/* Affiche le prénom et nom */}
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{userData?.email || 'Email non disponible'}</Text> {/* Affiche l'email */}
        </View>
      </View>

      {/* Card contenant des informations supplémentaires */}
      <View style={styles.card}>
        <Text style={styles.cardText}>Informations supplémentaires...</Text>
      </View>

      {/* Boutons */}
      <View style={styles.buttonsContainer}>
        <Button title="Modifier le profil" onPress={handleEditProfile} />
        <View style={styles.spacer} />
        <Button title="Voir l'historique" onPress={() => router.push('/user/history')} />
        <View style={styles.spacer} />
        <Button title="Se déconnecter" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

// Définition des styles
const styles: Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Assurez-vous que les éléments sont en haut
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
    alignItems: 'center', // Centrer l'image horizontalement
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  profileContainer: {
    flexDirection: 'column', // Disposition verticale pour le nom et l'email
    alignItems: 'center', // Centrer les informations sous la photo
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '80%', // Limiter la largeur pour donner un peu d'espace
  },
  infoContainer: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    width: '80%', // Limiter la largeur pour un meilleur rendu
  },
  cardText: {
    fontSize: 16,
    color: '#555',
  },
  buttonsContainer: {
    marginTop: 30,
    width: '80%', // Largeur limitée pour les boutons
  },
  spacer: {
    height: 15,
  },
});

export default ProfileScreen;
