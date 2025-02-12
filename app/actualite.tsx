import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Modal, Button, ScrollView, Dimensions } from 'react-native';

// Définir le type pour une actualité
type News = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  content: string; // Contenu complet de l'article
};

const Actualite = () => {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  // Gestion des erreurs

  const [modalVisible, setModalVisible] = useState<boolean>(false); // État pour contrôler la modal
  const [selectedNews, setSelectedNews] = useState<News | null>(null); // Actualité sélectionnée pour afficher dans la modal

  // Fonction pour charger les actualités (simulée)
  const fetchNews = async () => {
    setLoading(true);
    setError(null); // Réinitialiser les erreurs avant chaque nouvelle tentative de chargement

    try {
      // Simulation de l'appel API pour récupérer toutes les actualités
      const allNews = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Actualité ${i + 1}`,
        description: `Voici la description de l'actualité ${i + 1}.`,
        imageUrl: 'https://via.placeholder.com/150',
        content: `Contenu complet de l'actualité ${i + 1}.\n\n` + 
                 `Voici des détails supplémentaires sur l'article. Ce texte peut être très long.\n` +
                 `Les articles peuvent contenir des paragraphes supplémentaires, des images ou des liens.\n\n` +
                 `Exemple d'un article long avec plusieurs paragraphes. Chaque paragraphe peut inclure des informations détaillées.\n` +
                 `Pour ajouter plus de contenu, nous pouvons continuer à ajouter du texte et simuler des articles longs.` + 
                 `Voici des détails supplémentaires sur l'article. Ce texte peut être très long.\n` +
                 `Les articles peuvent contenir des paragraphes supplémentaires, des images ou des liens.\n\n` +
                 `Exemple d'un article long avec plusieurs paragraphes. Chaque paragraphe peut inclure des informations détaillées.\n` +
                 `Pour ajouter plus de contenu, nous pouvons continuer à ajouter du texte et simuler des articles longs.` + 
                 `Voici des détails supplémentaires sur l'article. Ce texte peut être très long.\n` +
                 `Les articles peuvent contenir des paragraphes supplémentaires, des images ou des liens.\n\n` +
                 `Exemple d'un article long avec plusieurs paragraphes. Chaque paragraphe peut inclure des informations détaillées.\n` +
                 `Pour ajouter plus de contenu, nous pouvons continuer à ajouter du texte et simuler des articles longs.` + 
                 `Voici des détails supplémentaires sur l'article. Ce texte peut être très long.\n` +
                 `Les articles peuvent contenir des paragraphes supplémentaires, des images ou des liens.\n\n` +
                 `Exemple d'un article long avec plusieurs paragraphes. Chaque paragraphe peut inclure des informations détaillées.\n` +
                 `Pour ajouter plus de contenu, nous pouvons continuer à ajouter du texte et simuler des articles longs.`
      }));

      setNewsData(allNews);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des actualités.');
    } finally {
      setLoading(false);
    }
  };

  // Charge toutes les actualités au moment du premier rendu
  useEffect(() => {
    fetchNews();
  }, []);

  // Composant pour chaque actualité
  const renderNewsItem = ({ item }: { item: News }) => (
    <View style={styles.newsCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>
      <Button
        title="Voir plus"
        onPress={() => {
          setSelectedNews(item); // Sélectionner l'actualité
          setModalVisible(true); // Ouvrir la modal
        }}
      />
    </View>
  );

  // Composant de la fenêtre modale
  const renderModal = () => {
    if (!selectedNews) return null;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Fermer la modal
        transparent={true} // Utiliser transparent pour créer un fond en dehors de la modal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedNews.title}</Text>
            
            {/* Image de l'article */}
            <Image source={{ uri: selectedNews.imageUrl }} style={styles.modalImage} />

            {/* Utiliser ScrollView pour permettre le défilement du contenu long */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalContent}>{selectedNews.content}</Text>
            </ScrollView>

            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actualités</Text>

      {error && <Text style={styles.errorText}>{error}</Text>} {/* Afficher l'erreur si elle existe */}

      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsItem} /* Fonction renderItem directement ici */
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />

      {/* Afficher un message lorsque toutes les actualités sont chargées */}
      {!loading && newsData.length > 0 && (
        <Text style={styles.endMessage}>Toutes les actualités sont chargées.</Text>
      )}

      {/* Render Modal */}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  newsCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  endMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre pour la modal
  },
  modalContainer: {
    width: '90%', // 90% de la largeur de l'écran
    height: '85%', // 85% de la hauteur de l'écran
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 20, // Pour éviter que le contenu ne soit trop collé en bas
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: 'cover', // L'image prend la totalité de la largeur et s'adapte proportionnellement
  },
});

export default Actualite;
