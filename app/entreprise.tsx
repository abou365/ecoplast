import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  Modal,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native';


type Entreprise = {
  id: number;
  name: string;
  description: string;
  location: { latitude: number; longitude: number };
  contact: { phone: string; email: string };
};

const Entreprises = () => {
  const entreprises: Entreprise[] = [
    {
        id: 1,
        name: 'Entreprise Aurore',
        description: 'Entreprise spécialisée dans le recyclage et la gestion des déchets électroniques. Nous offrons des solutions innovantes pour réduire l’empreinte écologique des entreprises tout en contribuant à la réduction des déchets électroniques. Notre équipe d’experts s’assure que les appareils électroniques en fin de vie sont démantelés, recyclés de manière responsable et réutilisés dans la production de nouveaux équipements.',
        location: { latitude: 5.359951, longitude: -4.008256 }, // Abidjan
        contact: { phone: '+2250123456789', email: 'contact@aurore.com' },
      },
      {
        id: 2,
        name: 'GreenLife Solutions',
        description: 'GreenLife Solutions se positionne comme un acteur clé dans le domaine des technologies écologiques. Nous offrons des solutions de gestion des déchets, d’énergies renouvelables et d’agriculture durable. Nous collaborons avec des entreprises de diverses industries pour promouvoir des pratiques respectueuses de l’environnement et pour soutenir les initiatives de développement durable à travers la Côte d’Ivoire.',
        location: { latitude: 6.851765, longitude: -5.280958 }, // Yamoussoukro
        contact: { phone: '+2250223456789', email: 'contact@greenlife.ci' },
      },
      {
        id: 3,
        name: 'BioEnergie CI',
        description: 'BioEnergie CI est une entreprise pionnière dans la production d’énergies renouvelables en Côte d’Ivoire. Nous sommes engagés dans la transformation de la biomasse et d’autres sources d’énergie propres pour générer de l’électricité de manière durable. Nos projets visent à réduire la dépendance aux énergies fossiles, tout en créant des solutions locales pour répondre aux besoins énergétiques des populations.',
        location: { latitude: 5.633222, longitude: -5.222458 }, // San-Pédro
        contact: { phone: '+2250323456789', email: 'contact@bioenergie.ci' },
      },
      {
        id: 4,
        name: 'EcoFriendly Abidjan',
        description: 'EcoFriendly Abidjan se consacre à la gestion durable des déchets plastiques. Nous proposons des services innovants pour collecter, trier et recycler les déchets plastiques afin de les transformer en matériaux réutilisables. Nous travaillons activement à la réduction de la pollution plastique dans la ville d’Abidjan, en sensibilisant la population et en offrant des solutions éco-responsables aux entreprises locales.',
        location: { latitude: 5.362408, longitude: -4.008826 }, // Abidjan, Cocody
        contact: { phone: '+2250423456789', email: 'contact@ecofriendly.com' },
      },
      {
        id: 5,
        name: 'IvoryClean',
        description: 'IvoryClean est une société de nettoyage écologique pour les entreprises et les particuliers. Nous utilisons des produits de nettoyage naturels et respectueux de l’environnement afin d’offrir des services de nettoyage de haute qualité tout en préservant la santé des utilisateurs et de la planète. Nous intervenons dans des secteurs tels que les bureaux, les commerces, ainsi que dans l’entretien des espaces verts.',
        location: { latitude: 9.571672, longitude: -5.201179 }, // Korhogo
        contact: { phone: '+2250523456789', email: 'contact@ivoryclean.ci' },
      },
      {
        id: 6,
        name: 'Recyclage Durable',
        description: 'Recyclage Durable est le leader du recyclage des métaux en Côte d’Ivoire. Nous mettons en œuvre des technologies avancées pour récupérer et recycler les métaux industriels et électroniques afin de les réutiliser dans la production de nouveaux produits. Notre mission est de promouvoir une économie circulaire et de réduire l’impact environnemental de l’industrie métallurgique.',
        location: { latitude: 6.890483, longitude: -5.365139 }, // Bouaké
        contact: { phone: '+2250623456789', email: 'contact@recyclagedurable.ci' },
      },
      {
        id: 7,
        name: 'Côte d’Ivoire Plastiques',
        description: 'Côte d’Ivoire Plastiques se spécialise dans la réduction et la réutilisation des plastiques industriels. Nous proposons des solutions de recyclage des plastiques et nous encourageons les entreprises à adopter des pratiques responsables pour minimiser leur consommation de plastique. Nous contribuons ainsi à la lutte contre la pollution plastique en Côte d’Ivoire.',
        location: { latitude: 5.200263, longitude: -3.743512 }, // Grand-Bassam
        contact: { phone: '+2250723456789', email: 'contact@ci-plastiques.ci' },
      },
      {
        id: 8,
        name: 'VertAfrique',
        description: 'VertAfrique est une entreprise dédiée à l’innovation dans les technologies vertes pour l’Afrique. Nous développons des solutions d’énergies renouvelables, de gestion des ressources naturelles et de réduction des gaz à effet de serre. Nos projets visent à améliorer la qualité de vie des communautés africaines tout en préservant l’environnement pour les générations futures.',
        location: { latitude: 7.684306, longitude: -5.104366 }, // Daloa
        contact: { phone: '+2250823456789', email: 'contact@vertafrik.com' },
      },
      {
        id: 9,
        name: 'CleanTech CI',
        description: 'CleanTech CI est une entreprise de technologies innovantes pour un environnement propre. Nous concevons et produisons des équipements écologiques pour le traitement des déchets, la purification de l’eau et la gestion des énergies renouvelables. Nos solutions sont destinées à des entreprises, des collectivités et des particuliers souhaitant participer activement à la protection de l’environnement.',
        location: { latitude: 8.137803, longitude: -7.801969 }, // Man
        contact: { phone: '+2250923456789', email: 'contact@cleantechci.ci' },
      },
      {
        id: 10,
        name: 'Pépinière Verte',
        description: 'Pépinière Verte est une entreprise spécialisée dans la production de plantes pour le reboisement et la reforestation en Afrique. Nous produisons une large gamme d’espèces végétales adaptées aux conditions locales pour soutenir les initiatives de reboisement et de conservation des ressources naturelles. Nous collaborons avec des organisations et des entreprises pour restaurer les écosystèmes et améliorer la biodiversité.',
        location: { latitude: 4.856136, longitude: -6.086166 }, // Sassandra
        contact: { phone: '+2251023456789', email: 'contact@pepiniereverte.ci' },
      },
      {
        id: 11,
        name: 'Cocoa Recyclage',
        description: 'Cocoa Recyclage est une entreprise innovante qui se spécialise dans le recyclage des déchets liés à l’industrie du cacao. Nous offrons des solutions de collecte et de valorisation des co-produits du cacao pour les transformer en matières premières réutilisables, comme le compost ou le biogaz. Nous contribuons à la durabilité de l’industrie du cacao tout en réduisant son impact environnemental.',
        location: { latitude: 6.003939, longitude: -5.474281 }, // Gagnoa
        contact: { phone: '+2251123456789', email: 'contact@cocoarecyclage.ci' },
      },
      {
        id: 12,
        name: 'AgricTech CI',
        description: 'AgricTech CI est une entreprise innovante qui développe des solutions technologiques durables pour améliorer l’agriculture ivoirienne. Nous fournissons des outils et des services pour aider les agriculteurs à adopter des pratiques agricoles écologiques et efficaces. Nos projets incluent l’irrigation intelligente, la gestion des sols, et la production durable de cultures.',
        location: { latitude: 6.906264, longitude: -5.365285 }, // Bouaké
        contact: { phone: '+2251223456789', email: 'contact@agrictechci.ci' },
      },
      {
        id: 13,
        name: 'Verte Côte CI',
        description: 'Verte Côte CI est une entreprise écoresponsable qui œuvre pour un environnement sain. Nous proposons des solutions pour la gestion des déchets solides, la réduction de la pollution de l’air et de l’eau, ainsi que la promotion de la biodiversité. Nous mettons en place des projets d’éducation et de sensibilisation sur les enjeux environnementaux dans toute la Côte d’Ivoire.',
        location: { latitude: 8.453986, longitude: -6.019219 }, // Séguéla
        contact: { phone: '+2251323456789', email: 'contact@verteci.ci' },
      },
      {
        id: 14,
        name: 'Revalorisation CI',
        description: 'Revalorisation CI est un expert en gestion des déchets organiques. Nous proposons des solutions de compostage et de recyclage des déchets organiques afin de les transformer en engrais naturels. Nous travaillons avec des exploitants agricoles, des collectivités locales et des entreprises pour promouvoir l’économie circulaire et réduire les déchets dans la nature.',
        location: { latitude: 5.497682, longitude: -6.003279 }, // Tabou
        contact: { phone: '+2251423456789', email: 'contact@revalorisation.ci' },
      },
      {
        id: 15,
        name: 'Energie Ivoire',
        description: 'Energie Ivoire est une société spécialisée dans les solutions énergétiques alternatives. Nous proposons des systèmes de production d’énergie solaire, de biomasse et d’éoliennes pour répondre aux besoins énergétiques de nos clients tout en préservant l’environnement. Nos projets permettent de réduire la dépendance aux énergies non renouvelables et d’améliorer l’accès à l’énergie dans les zones rurales.',
        location: { latitude: 7.378904, longitude: -3.894512 }, // Bondoukou
        contact: { phone: '+2251523456789', email: 'contact@energieivoire.ci' },
      },
      {
        id: 16,
        name: 'Plastic Free CI',
        description: 'Plastic Free CI est une organisation dédiée à la lutte contre la pollution plastique. Nous sensibilisons le public et les entreprises sur les alternatives durables au plastique, tout en développant des solutions pour réduire la production et la consommation de plastique. Nous menons des campagnes de nettoyage, organisons des événements de recyclage et soutenons des projets de réduction de plastique dans le pays.',
        location: { latitude: 5.326194, longitude: -3.977149 }, // Abidjan, Plateau
        contact: { phone: '+2251623456789', email: 'contact@plasticfreeci.ci' },
      },
      {
        id: 17,
        name: 'Technologie Verte',
        description: 'Technologie Verte est une entreprise spécialisée dans le développement d’outils technologiques durables pour les secteurs de l’agriculture, de l’énergie et de la gestion des ressources naturelles. Nous offrons des solutions innovantes pour aider les entreprises et les gouvernements à intégrer des technologies écologiques dans leurs opérations.',
        location: { latitude: 8.5922, longitude: -5.1736 }, // Odienné
        contact: { phone: '+2251723456789', email: 'contact@technologieverte.ci' },
      },
      {
        id: 18,
        name: 'EcoHabitat CI',
        description: 'EcoHabitat CI se consacre à la conception et la construction d’habitats écologiques en Côte d’Ivoire. Nous utilisons des matériaux durables et écoresponsables pour créer des logements modernes et respectueux de l’environnement. Nos projets visent à promouvoir la construction durable tout en réduisant l’impact environnemental des bâtiments.',
        location: { latitude: 5.44851, longitude: -4.01167 }, // Abidjan, Riviera
        contact: { phone: '+2251823456789', email: 'contact@ecohabitatci.ci' },
      },
      {
        id: 19,
        name: 'Zero Déchet CI',
        description: 'Zero Déchet CI milite pour l’adoption de pratiques zéro déchet en Côte d’Ivoire. Nous sensibilisons les entreprises et les particuliers à réduire, réutiliser et recycler les déchets afin de protéger l’environnement. Nous offrons des formations, des conseils et des solutions pour la gestion des déchets dans un cadre de développement durable.',
        location: { latitude: 7.25, longitude: -6.45 }, // Duekoué
        contact: { phone: '+2251923456789', email: 'contact@zerodechetci.ci' },
      },
      {
        id: 20,
        name: 'SolTech Afrique',
        description: 'SolTech Afrique se spécialise dans la production et la fourniture de panneaux solaires en Afrique. Nous proposons des solutions de production d’énergie solaire pour les entreprises, les foyers et les collectivités locales. Nos panneaux solaires sont conçus pour être durables, économiques et adaptés aux besoins énergétiques de la région.',
        location: { latitude: 6.15, longitude: -7.5 }, // Issia
        contact: { phone: '+2252023456789', email: 'contact@soltechafrique.ci' },
      },
  ];

  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleViewMore = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise);
    setModalVisible(true);
  };

  const renderButton = (
    title: string,
    onPress: () => void,
    color: string = '#007BFF',
    icon: React.ReactNode = null
  ) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
    >
      {icon}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderEntreprise = ({ item }: { item: Entreprise }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.buttonGroup}>
        {renderButton('Appeler', () => handleCall(item.contact.phone), '#28a745', <FontAwesome name="phone" size={18} color="white" style={styles.icon} />)}
        {renderButton('Email', () => handleEmail(item.contact.email), '#007BFF', <FontAwesome name="envelope" size={18} color="white" style={styles.icon} />)}
        {renderButton('Voir', () => handleViewMore(item), '#17a2b8', <FontAwesome name="info-circle" size={18} color="white" style={styles.icon} />)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des entreprises en Côte d'Ivoire</Text>
      <FlatList
        data={entreprises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEntreprise}
      />
      {selectedEntreprise && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.modalContent}
            >
                <ScrollView contentContainerStyle={styles.modalScrollContent}>

              <Text style={styles.modalTitle}>{selectedEntreprise.name}</Text>
              <Text style={styles.modalDescription}>{selectedEntreprise.description}</Text>
              <Text style={styles.modalContact}>Téléphone : {selectedEntreprise.contact.phone}</Text>
              <Text style={styles.modalContact}>Email : {selectedEntreprise.contact.email}</Text>
              <Text style={styles.modalLocation}>
                Localisation : {selectedEntreprise.location.latitude.toFixed(4)},{' '}
                {selectedEntreprise.location.longitude.toFixed(4)}
              </Text>

              {/* Affichage de la carte dans la modale */}
              <MapView
                style={styles.modalMap}
                initialRegion={{
                  latitude: selectedEntreprise.location.latitude,
                  longitude: selectedEntreprise.location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={selectedEntreprise.location}
                  title={selectedEntreprise.name}
                  description={selectedEntreprise.description}
                />
              </MapView>

              {/* Boutons */}
              <View style={styles.buttonGroup}>
                {renderButton('Appeler', () => handleCall(selectedEntreprise.contact.phone), '#28a745', <FontAwesome name="phone" size={18} color="white" style={styles.icon} />)}
                {renderButton('Email', () => handleEmail(selectedEntreprise.contact.email), '#007BFF', <FontAwesome name="envelope" size={18} color="white" style={styles.icon} />)}
              </View>
              </ScrollView>

              {/* Bouton Fermer - avec une icône uniquement */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                accessible={true}
              >
                <FontAwesome name="times-circle" size={24} color="white" />
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    marginRight: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '95%',
    height: '80%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    textAlign: 'justify',
  },
  modalContact: {
    fontSize: 14,
    marginBottom: 10,
    color: '#007BFF',
    textAlign: 'center',
  },
  modalLocation: {
    fontSize: 14,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  modalMap: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    marginBottom: 20,
  },
  modalScrollContent: {  // Nouveau style pour le ScrollView
    paddingBottom: 20, // Ajoutez un peu d'espace en bas pour que le contenu ne soit pas coincé
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 10,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
});

export default Entreprises;
