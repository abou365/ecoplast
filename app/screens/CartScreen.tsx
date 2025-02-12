import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useCart } from '../../context/CartContext';

const CartScreen = () => {
  const { cart } = useCart(); // Accéder à la liste des produits dans le panier

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemPrice}>{item.price} €</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Votre Panier</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Votre panier est vide</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
        />
      )}
      <Button title="Continuer l'achat" onPress={() => { /* Ajouter la logique de paiement */ }} />
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
  cartItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#555',
  },
  emptyCart: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
});

export default CartScreen;
