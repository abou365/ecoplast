import React, { useState, useEffect, useRef } from 'react';
import { 
  Platform, 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics'; // Retour tactile
import polyline from '@mapbox/polyline';
import { userApi } from '@/lib/api/client/userApi'; // Assurez-vous d'importer correctement votre API

// Interface Precollector
export interface Precollector {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  distance?: number; // Calculé côté client
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

const Explore = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearestCollectors, setNearestCollectors] = useState<(Precollector & { distance: number })[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<Precollector | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [userMarker, setUserMarker] = useState<Coordinate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRouteVisible, setIsRouteVisible] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  // Calcul de la distance entre deux points en km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Décodage des polylignes
  const decodePolyline = (encoded: string): Coordinate[] => {
    return polyline.decode(encoded).map(([latitude, longitude]: [number, number]) => ({
      latitude,
      longitude,
    }));
  };

  // Récupérer l'itinéraire entre l'utilisateur et un collecteur
  const fetchRoute = async (userLat: number, userLon: number, collectorLat: number, collectorLon: number): Promise<void> => {
    const apiKey = 'AIzaSyAtcBAF38xZYgCW3fjdASgFWVftQJ2mrgw'; // Remplacez par votre clé API Google Maps
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLat},${userLon}&destination=${collectorLat},${collectorLon}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
        setIsRouteVisible(true);

        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch {
      setErrorMsg("Erreur lors de la récupération de l'itinéraire");
    }
  };

  // Gérer la sélection d'un collecteur
  const handleSelectCollector = (collector: Precollector) => {
    setSelectedCollector(collector);
    Haptics.selectionAsync();
    if (location) {
      fetchRoute(
        location.coords.latitude,
        location.coords.longitude,
        collector.latitude || 0,
        collector.longitude || 0
      );
    }
  };

  // Obtenir la localisation de l'utilisateur et des collecteurs à proximité
  useEffect(() => {
    const getLocation = async () => {
      try {
        if (Platform.OS === 'android' && !Device.isDevice) {
          setErrorMsg("Cela ne fonctionne pas dans un émulateur Android, utilisez un appareil physique !");
          return;
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg("Permission d'accès à la localisation refusée");
          return;
        }

        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation(newLocation);
            setUserMarker({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });

            // Appel API pour récupérer les collecteurs à proximité
            userApi.findNearbyCollectors(newLocation.coords.latitude, newLocation.coords.longitude)
              .then((collectors: Precollector[]) => {
                const distances = collectors.map((collector) => {
                  const distance = calculateDistance(
                    newLocation.coords.latitude,
                    newLocation.coords.longitude,
                    collector.latitude || 0,
                    collector.longitude || 0
                  );
                  return { ...collector, distance };
                });

                const sortedCollectors = distances.sort((a, b) => a.distance - b.distance);
                setNearestCollectors(sortedCollectors.slice(0, 5)); // Limiter à 5 collecteurs
                setIsLoading(false);
              })
              .catch(() => {
                setErrorMsg("Erreur lors de la récupération des collecteurs à proximité");
              });
          }
        );

        return () => {
          locationSubscription.remove();
        };
      } catch {
        setErrorMsg("Erreur lors de la récupération de la localisation");
      }
    };

    getLocation();
  }, []);

  // Filtrer les collecteurs par type sélectionné
  const filteredCollectors = selectedType
    ? nearestCollectors.filter((collector) => collector.type === selectedType)
    : nearestCollectors;

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude || 0,
              longitude: location?.coords.longitude || 0,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
          >
            {filteredCollectors.map((collector) => (
              <Marker
                key={collector.id}
                coordinate={{
                  latitude: collector.latitude || 0,
                  longitude: collector.longitude || 0,
                }}
                pinColor="red"
                title={collector.firstName + ' ' + collector.lastName}
                onPress={() => handleSelectCollector(collector)}
              />
            ))}

            {userMarker && (
              <Marker
                coordinate={userMarker}
                pinColor="blue"
                title="Votre position"
              />
            )}

            {isRouteVisible && routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="blue"
                strokeWidth={5}
                lineDashPattern={[10, 10]}
              />
            )}
          </MapView>

          <View style={styles.filters}>
            {['poubelle', 'centre_tri', 'dechetterie', 'tous'].map((type) => (
              <TouchableOpacity 
                key={type} 
                onPress={() => setSelectedType(type === 'tous' ? null : type)} 
                style={[
                  styles.filterButton, 
                  selectedType === type && styles.activeFilterButton
                ]}
              >
                <Text style={styles.filterText}>{type === 'tous' ? 'Tous' : type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredCollectors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectCollector(item)}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.listItemText}>
                    Distance : {item.distance?.toFixed(2)} km
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '60%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    margin: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFF',
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#EEE',
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Explore;
