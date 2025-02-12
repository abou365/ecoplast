import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView, Linking, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { userApi } from "@/lib/api/client/userApi";

// Types mis à jour
interface Location {
  latitude: number;
  longitude: number;
}

interface Precollecteur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

interface PrecollecteurDetail extends Precollecteur {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

const Precollecteurs = () => {
  const [precollecteurs, setPrecollecteurs] = useState<Precollecteur[]>([]);
  const [selectedPrecollecteur, setSelectedPrecollecteur] = useState<PrecollecteurDetail | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrecollecteurs = async () => {
      setLoading(true);
      try {
        const data = await userApi.getAllPrecollecteurs();
        setPrecollecteurs(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrecollecteurs();
  }, []);

  const ouvrirModale = async (precollecteur: Precollecteur) => {
    setModalVisible(true);
    setDetailLoading(true);
    try {
      const detailData = await userApi.getById(precollecteur.id);
      setSelectedPrecollecteur(detailData);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const fermerModale = () => {
    setSelectedPrecollecteur(null);
    setModalVisible(false);
  };

  const appeler = (telephone: string) => {
    Linking.openURL(`tel:${telephone}`);
  };

  const envoyerEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Précollecteurs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={precollecteurs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{`${item.firstName} ${item.lastName}`}</Text>
              <Text style={styles.cardDescription}>{item.type}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => appeler(item.phoneNumber)}>
                  <FontAwesome name="phone" size={20} color="white" />
                  <Text style={styles.buttonText}>Appeler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => envoyerEmail(item.email)}>
                  <FontAwesome name="envelope" size={20} color="white" />
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => ouvrirModale(item)}>
                  <FontAwesome name="eye" size={20} color="white" />
                  <Text style={styles.buttonText}>Voir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      {modalVisible && (
        <Modal animationType="slide" transparent visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                {detailLoading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : selectedPrecollecteur ? (
                  <>
                    <Text style={styles.modalTitle}>
                      {`${selectedPrecollecteur.firstName} ${selectedPrecollecteur.lastName}`}
                    </Text>
                    <Text style={styles.modalText}>Email : {selectedPrecollecteur.email}</Text>
                    <Text style={styles.modalText}>Téléphone : {selectedPrecollecteur.phoneNumber}</Text>
                    <Text style={styles.modalText}>Créé le : {selectedPrecollecteur.createdAt}</Text>
                    {selectedPrecollecteur.latitude && selectedPrecollecteur.longitude && (
                      <View style={styles.mapContainer}>
                        <MapView
                          style={styles.map}
                          initialRegion={{
                            latitude: selectedPrecollecteur.latitude,
                            longitude: selectedPrecollecteur.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          }}
                        >
                          <Marker
                            coordinate={{
                              latitude: selectedPrecollecteur.latitude,
                              longitude: selectedPrecollecteur.longitude,
                            }}
                            title={`${selectedPrecollecteur.firstName} ${selectedPrecollecteur.lastName}`}
                          />
                        </MapView>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.modalText}>Aucune donnée disponible</Text>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={fermerModale}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f5f5f5" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 3 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  cardDescription: { 
    fontSize: 14, 
    color: "#666", 
    marginVertical: 10 
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  button: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 10, 
    backgroundColor: "#4CAF50", 
    borderRadius: 5 
  },
  buttonText: { 
    color: "white", 
    marginLeft: 5 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 20, 
    margin: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  modalText: { 
    fontSize: 14, 
    marginBottom: 10 
  },
  closeButton: { 
    backgroundColor: "#f44336", 
    padding: 10, 
    borderRadius: 5, 
    alignItems: "center",
    marginTop: 10 
  },
  closeButtonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  mapContainer: {
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  map: {
    flex: 1
  }
});

export default Precollecteurs;