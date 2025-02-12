import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const router = useRouter();

  // Données simulées pour l'historique
  const historyData = [
    { id: '1', date: '2024-11-22', action: 'Connexion réussie' },
    { id: '2', date: '2024-11-20', action: 'Modification du profil' },
    { id: '3', date: '2024-11-15', action: 'Inscription à l’application' },
  ];

  const renderHistoryItem = ({ item }: { item: { id: string; date: string; action: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.action}>{item.action}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des activités</Text>
      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noData}>Aucune activité enregistrée.</Text>
      )}
      <TouchableOpacity onPress={() => router.push('/user/profile')} style={styles.button}>
        <Text style={styles.buttonText}>Retour au profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  action: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
