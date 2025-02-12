import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList, Modal, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importation de l'icône menu
import { useRouter } from 'expo-router'; // Importez useRouter

const screenWidth = Dimensions.get('window').width;

// Définir une interface pour les props du composant Column
interface ColumnProps {
  imageSource: any; // Type pour les sources d'images
  title: string; // Type pour le titre
  onPress?: () => void; // Fonction à exécuter lors du clic
}

// Définir une interface pour les articles de nouvelles
interface NewsArticle {
  id: string;
  title: string;
  image: any;
  description: string;
  content: string; // Ajouter un champ "content" pour le contenu complet
}

// Données fictives pour la liste d'actualités
const newsData: NewsArticle[] = [
  {
    id: '1',
    title: "Titre de l'article 1",
    image: require('@/assets/images/ecologistes.jpg'),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    content: "Voici le contenu complet de l'article 1. C'est ici que vous pouvez afficher tous les détails de l'article.",
  },
  {
    id: '2',
    title: "Titre de l'article 2",
    image: require('@/assets/images/dechet1.jpg'),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    content: "Voici le contenu complet de l'article 2. C'est ici que vous pouvez afficher tous les détails de l'article.",
  },
  {
    id: '3',
    title: "Titre de l'article 3",
    image: require('@/assets/images/globe.jpg'),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    content: "Voici le contenu complet de l'article 3. C'est ici que vous pouvez afficher tous les détails de l'article.",
  },
];

// Composant pour afficher une liste d'actualités
const NewsList = ({ onPressItem }: { onPressItem: (article: NewsArticle) => void }) => {
  const renderItem = ({ item }: { item: NewsArticle }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => onPressItem(item)}>
        <Text style={styles.buttonText}>Lire plus</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={newsData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// Composant principal
const Index = () => {
  const router = useRouter(); // Hook pour la navigation

  const [modalVisible, setModalVisible] = useState(false); // État pour la modal
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null); // Article sélectionné

  const navigateToShop = () => {
    router.push('./shop'); // Navigue vers la page shop.tsx
  };

  const navigateToCart = () => {
    router.push('./CartScreen'); // Navigue vers la page CartScreen.tsx
  };

  const navigateToExplore = () => {
    router.push('/explore'); // Navigue vers la page Explore.tsx
  };

  const navigateToEntreprise = () => {
    router.push('/entreprise'); // Navigue vers la page Entreprise.tsx
  };

  const navigateToPrecollecteur = () => {
    router.push('/precollecteur'); // Navigue vers la page Precollecteur.tsx
  };

  const navigateToActualite = () => {
    router.push('/actualite'); // Navigue vers la page Actualité
  };

  // Fonction pour ouvrir la modal et afficher l'article sélectionné
  const handlePressItem = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedArticle(null); // Réinitialiser l'article sélectionné
  };

  return (
    <>
      {/* Header avec logo, icône panier et icône menu */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo-EcoplastInnov.png')} // Remplace avec ton logo
          style={styles.logo}
        />
        <View style={styles.headerIcons}>
          {/* Icône panier */}
          <TouchableOpacity onPress={navigateToCart} style={styles.iconButton}>
            <Icon name="shopping-cart" size={24} color="#000" />
          </TouchableOpacity>

          {/* Icône menu */}
          <AnimatedMenuButton />
        </View>
      </View>

      {/* Contenu défilant */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image ajustée */}
        <Image
          source={require('@/assets/images/hand1.jpg')}
          style={styles.bannerImage}
        />
        <View style={styles.rowContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            <Column imageSource={require('@/assets/images/man.png')} 
              title="Gestion des déchets" 
              onPress={navigateToExplore} // Navigue vers la page Precollecteur.tsx
              />

            <Column imageSource={require('@/assets/images/recycle-bin.png')} title="Gestion des collectes" />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <Column imageSource={require('@/assets/images/garbage-truck.png')} 
              title="Annuaire des précollecteurs" 
              onPress={navigateToPrecollecteur} // Navigue vers la page Precollecteur.tsx
              />
              
            <Column
              imageSource={require('@/assets/images/industry.png')}
              title="Annuaire des entreprises"
              onPress={navigateToEntreprise} // Navigue vers la page Entreprise.tsx
            />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <Column
              imageSource={require('@/assets/images/bin.png')}
              title="Les produits"
              onPress={navigateToShop} // Navigue vers la page shop.tsx
            />
          </View>
        </View>

        {/* Liste d'actualités */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Actualités</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText} onPress={navigateToActualite} >Plus d'actualités</Text>
          </TouchableOpacity>
        </View>

        <NewsList onPressItem={handlePressItem} />

        {/* Espace vide en bas */}
        <View style={styles.emptySpace} />
      </ScrollView>

      {/* Modal pour afficher le contenu complet de l'article */}
      {selectedArticle && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal} // Fermer la modal
          transparent={true} // Fond sombre derrière la modal
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Image source={selectedArticle.image} style={styles.modalImage} />
              <ScrollView style={styles.modalContentContainer}>
                <Text style={styles.modalContent}>{selectedArticle.content}</Text>
              </ScrollView>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

// Composant Column pour réutilisation
const Column: React.FC<ColumnProps> = ({ imageSource, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.column}>
    <Image
      source={imageSource}
      style={styles.columnImage}
      accessibilityLabel={title}
      accessible={true}
    />
    <Text style={styles.columnTitle}>{title}</Text>
  </TouchableOpacity>
);

// Animation pour le bouton Menu
const AnimatedMenuButton = () => {
  const [scale, setScale] = useState(new Animated.Value(1));
  const router = useRouter(); // Hook pour la navigation

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const navigateToProfile = () => {
    router.push('/user/profile'); // Navigue vers la page "Profile"
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.menuButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={navigateToProfile} // Ajout de l'événement pour ouvrir "Profile"
      >
        <Icon name="bars" size={24} color="#000000" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingTop: 100, // Espacement pour le header fixe
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40, // Padding supplémentaire en haut
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, // Ligne sous le header
    borderBottomColor: '#E2E8F0', // Couleur de la ligne sous le header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Ajoute une légère ombre
  },
  logo: {
    width: 120, // Taille du logo agrandie
    height: 60,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row', // Aligne les icônes horizontalement
  },
  iconButton: {
    padding: 10,
    marginLeft: 20, // Ajout d'un espace entre les icônes
  },
  menuButton: {
    padding: 10, // Plus de padding pour un bouton plus visible
    backgroundColor: 'transparent', // Fond transparent
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: screenWidth * 0.95,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
    resizeMode: 'cover',
  },
  rowContainer: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligne les éléments à gauche
    width: '95%',
    marginBottom: 15,
  },
  column: {
    width: (screenWidth - 40) / 2, // Chaque colonne prend une largeur égale
    backgroundColor: '#FFFFFF',
    padding: 12,
    margin: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  columnImage: {
    width: 80, // Largeur uniforme de l'image
    height: 80, // Hauteur uniforme de l'image
    borderRadius: 8,
  },
  columnTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Titre à gauche et bouton à droite
    width: '95%', // S'assurer que l'espace est suffisant
    marginVertical: 25,
  },
  headerText: {
    fontSize: 28, // Agrandir la taille de la police
    fontWeight: '700',
    color: '#1A202C',
  },
  moreButton: {
    marginVertical: 10, // Ajout d'espace au-dessus et en dessous
  },
  moreButtonText: {
    fontSize: 12, // Petite taille de police
    color: '#3182CE',
    fontWeight: '600',
  },
  newsImage: {
    width: 175,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  newsTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  description: {
    marginVertical: 5,
    fontSize: 12,
    color: '#718096',
  },
  button: {
    backgroundColor: '#3182CE',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptySpace: {
    height: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: screenWidth * 0.5, // Largeur des cartes
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  // Style modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre
  },
  modalContainer: {
    width: '90%', // 90% de la largeur de l'écran
    height: '85%', // 85% de la hauteur de l'écran
    backgroundColor: '#fff',
    //width: screenWidth * 0.8,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalImage: {
    width: screenWidth * 0.8,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  modalContentContainer: {
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#3182CE',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Index;
