import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Image } from 'react-native';

// Définir le type pour un produit avec l'image
type Product = {
  id: number;
  name: string;
  price: string;
  image: string; // URL de l'image ou chemin local
};

const Shop = () => {
  // Liste de produits simulés avec des images
  const [products] = useState<Product[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Produit recyclé ${i + 1}`,
      price: (Math.random() * 50 + 10).toFixed(2), // Prix aléatoire entre 10 et 60
      image: 'https://via.placeholder.com/150', // Remplacer par l'URL de ton image
    }))
  );

  // Ajouter au panier (fonction simulée)
  const addToCart = (product: Product) => {
    Alert.alert('Ajouté au panier', `${product.name} a été ajouté au panier.`);
  };

  // Composant pour chaque produit
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price} €</Text>
      <Button title="Ajouter au panier" onPress={() => addToCart(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produits recyclés</Text>
      <FlatList<Product>
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        numColumns={2} // Spécifie qu'il y a 2 colonnes
        contentContainerStyle={styles.listContent} // Style pour ajuster l'espacement
      />
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
  listContent: {
    flexDirection: 'row', // Alignement en ligne
    flexWrap: 'wrap', // Permet de passer à la ligne suivante quand c'est nécessaire
    justifyContent: 'space-between', // Ajoute un espace entre les éléments
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    width: '49%', // Chaque carte fait 50% de la largeur
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 5,
  },
  productImage: {
    width: '100%',
    height: 150, // Taille de l'image, peut être ajustée
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default Shop;
