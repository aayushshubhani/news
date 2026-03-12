import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸', recommended: true },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', recommended: true },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', recommended: true },
  { code: 'au', name: 'Australia', flag: '🇦🇺', recommended: true },
  { code: 'in', name: 'India', flag: '🇮🇳', recommended: true },
  { code: 'de', name: 'Germany', flag: '🇩🇪', recommended: true },
  { code: 'fr', name: 'France', flag: '🇫🇷', recommended: true },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'cn', name: 'China', flag: '🇨🇳' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'ar', name: 'Argentina', flag: '🇦🇷' },
  { code: 'za', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'ae', name: 'UAE', flag: '🇦🇪' },
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'il', name: 'Israel', flag: '🇮🇱' },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷' },
  { code: 'eg', name: 'Egypt', flag: '🇪🇬' },
  { code: 'ng', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'th', name: 'Thailand', flag: '🇹🇭' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'my', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { code: 'pl', name: 'Poland', flag: '🇵🇱' },
  { code: 'be', name: 'Belgium', flag: '🇧🇪' },
  { code: 'at', name: 'Austria', flag: '🇦🇹' },
  { code: 'no', name: 'Norway', flag: '🇳🇴' },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { code: 'fi', name: 'Finland', flag: '🇫🇮' },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪' },
];

const CountrySelectionScreen = ({ route, navigation }) => {
  const { currentCountry, theme } = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (countryCode) => {
    navigation.navigate('NewsHome', { selectedCountry: countryCode });
  };

  const renderCountryItem = ({ item }) => {
    const isSelected = item.code === currentCountry;
    
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          { backgroundColor: theme.cardBackground },
          isSelected && { backgroundColor: '#FF6B6B20', borderColor: '#FF6B6B', borderWidth: 2 }
        ]}
        onPress={() => handleCountrySelect(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <View style={styles.countryNameRow}>
            <Text style={[styles.countryName, { color: theme.text }]}>
              {item.name}
            </Text>
            {item.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>✓ Best</Text>
              </View>
            )}
          </View>
          <Text style={[styles.countryCode, { color: theme.tertiaryText }]}>
            {item.code.toUpperCase()}
          </Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backIcon, { color: theme.headerText }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>
            Select Country
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>
            Choose your news region
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search countries..."
            placeholderTextColor={theme.tertiaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.infoBox, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoText, { color: theme.secondaryText }]}>
            💡 Countries marked with "✓ Best" have the most comprehensive news coverage
          </Text>
        </View>
      </View>

      {/* Countries List */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {filteredCountries.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌍</Text>
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
            No countries found
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
  },
  countryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendedBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  recommendedText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  countryCode: {
    fontSize: 12,
  },
  checkmark: {
    fontSize: 24,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CountrySelectionScreen;
