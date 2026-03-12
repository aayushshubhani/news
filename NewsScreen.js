import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

// GNews API - Better international coverage and reliability
const API_KEY = '8664e7e6b22a20fa95587e8005cfa30e';
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

// Country flags mapping
const COUNTRY_FLAGS = {
  us: '🇺🇸', gb: '🇬🇧', ca: '🇨🇦', au: '🇦🇺', in: '🇮🇳',
  de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹', es: '🇪🇸', jp: '🇯🇵',
  kr: '🇰🇷', cn: '🇨🇳', br: '🇧🇷', mx: '🇲🇽', ar: '🇦🇷',
  za: '🇿🇦', ru: '🇷🇺', nl: '🇳🇱', se: '🇸🇪', ch: '🇨🇭',
  ae: '🇦🇪', sa: '🇸🇦', il: '🇮🇱', tr: '🇹🇷', eg: '🇪🇬',
  ng: '🇳🇬', ph: '🇵🇭', th: '🇹🇭', sg: '🇸🇬', my: '🇲🇾',
  id: '🇮🇩', nz: '🇳🇿', pt: '🇵🇹', pl: '🇵🇱', be: '🇧🇪',
  at: '🇦🇹', no: '🇳🇴', dk: '🇩🇰', fi: '🇫🇮', ie: '🇮🇪',
};

// News categories with icons and colors
const CATEGORIES = [
  { id: 'general', name: 'Top Stories', icon: '🔥', color: '#FF6B6B' },
  { id: 'business', name: 'Business', icon: '💼', color: '#4ECDC4' },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#45B7D1' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#FFA07A' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#DDA15E' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#90BE6D' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#B392AC' },
];

// Theme colors
const THEMES = {
  light: {
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    headerBackground: '#1A1A2E',
    headerText: '#FFFFFF',
    headerSubtext: '#B0B0B0',
    text: '#1A1A2E',
    secondaryText: '#666666',
    tertiaryText: '#999999',
    overlay: 'rgba(0, 0, 0, 0.7)',
    placeholderBg: '#E0E0E0',
    featuredOverlayText: '#FFFFFF',
    shadowColor: '#000000',
  },
  dark: {
    background: '#121212',
    cardBackground: '#1E1E1E',
    headerBackground: '#0A0A0F',
    headerText: '#FFFFFF',
    headerSubtext: '#888888',
    text: '#FFFFFF',
    secondaryText: '#B0B0B0',
    tertiaryText: '#707070',
    overlay: 'rgba(0, 0, 0, 0.85)',
    placeholderBg: '#2A2A2A',
    featuredOverlayText: '#FFFFFF',
    shadowColor: '#000000',
  },
};

const NewsScreen = ({ navigation, route }) => {
  const [newsData, setNewsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [cachedCountry, setCachedCountry] = useState(null);

  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  
  // Cache duration: 15 minutes
  const CACHE_DURATION = 15 * 60 * 1000;

  // Handle country change from navigation
  useEffect(() => {
    if (route.params?.selectedCountry) {
      setSelectedCountry(route.params.selectedCountry);
    }
  }, [route.params?.selectedCountry]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  // Navigate to country selection
  const openCountrySelector = () => {
    navigation.navigate('CountrySelection', { 
      currentCountry: selectedCountry,
      theme 
    });
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Navigate to detail screen
  const handleArticlePress = (article, category) => {
    navigation.navigate('NewsDetail', { 
      article: { ...article, category },
      theme 
    });
  };

  // Fetch news for a specific category
  const fetchCategoryNews = async (category) => {
    try {
      // GNews API parameters: country, category, max (limit), apikey, lang
      let url = `${BASE_URL}?country=${selectedCountry}&category=${category}&max=10&apikey=${API_KEY}&lang=en`;
      
      let response = await axios.get(url);
      
      // GNews returns data in 'articles' array
      if (response.data && response.data.articles && Array.isArray(response.data.articles) && response.data.articles.length > 0) {
        // GNews format is similar to NewsAPI, just ensure proper mapping
        const articles = response.data.articles
          .filter(article => article && article.title && article.title !== '[Removed]')
          .map(article => ({
            title: article.title || 'No Title',
            description: article.description || '',
            content: article.content || article.description || '',
            url: article.url || '',
            urlToImage: article.image || null, // GNews uses 'image' instead of 'urlToImage'
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source || { name: 'Unknown Source' },
            author: article.source?.name || null,
          }));
        
        if (articles.length > 0) {
          return articles;
        }
      }
      
      // If no articles found, return empty array (don't spam with fallbacks)
      return [];
    } catch (err) {
      // Check if it's a rate limit error
      if (err.response?.data?.errors) {
        const errorMsg = err.response.data.errors[0];
        if (errorMsg.includes('too many requests')) {
          console.error(`⏱️ Rate limit hit for ${category}`);
        } else {
          console.error(`❌ Error fetching ${category}:`, errorMsg);
        }
      } else {
        console.error(`❌ Error fetching ${category}:`, err.message);
      }
      return [];
    }
  };

  // Helper function to add delay between requests
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Check if cache is valid
  const isCacheValid = () => {
    if (!lastFetchTime || cachedCountry !== selectedCountry) {
      return false;
    }
    const timeSinceLastFetch = Date.now() - lastFetchTime;
    return timeSinceLastFetch < CACHE_DURATION;
  };

  // Fetch news for all categories (sequential with delays to avoid rate limiting)
  const fetchAllNews = async (forceRefresh = false) => {
    try {
      // Use cached data if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && Object.keys(newsData).length > 0) {
        console.log('📦 Using cached data (still fresh)');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setError(null);
      console.log(`\n📰 Fetching news for country: ${selectedCountry.toUpperCase()}`);
      
      const data = {};
      let totalArticles = 0;
      
      // Fetch categories SEQUENTIALLY with delays to avoid rate limiting
      for (let i = 0; i < CATEGORIES.length; i++) {
        const cat = CATEGORIES[i];
        console.log(`[${i + 1}/${CATEGORIES.length}] Fetching ${cat.name}...`);
        
        const articles = await fetchCategoryNews(cat.id);
        data[cat.id] = articles;
        totalArticles += articles.length;
        
        // Add delay between requests (except after the last one)
        if (i < CATEGORIES.length - 1) {
          await delay(1500); // 1.5 second delay between requests
        }
      }
      
      console.log(`\n📊 Total articles fetched: ${totalArticles}`);
      console.log('Articles per category:', CATEGORIES.map(cat => 
        `${cat.name}: ${data[cat.id]?.length || 0}`
      ).join(', '));
      
      if (totalArticles === 0) {
        console.warn('⚠️ No articles found');
        setError(`Unable to load news for ${selectedCountry.toUpperCase()}.\n\nPossible reasons:\n• API rate limit reached (100 requests/day)\n• Country not supported\n• No recent articles available\n\nTip: Wait a few minutes, then pull down to refresh.`);
      } else {
        console.log('✅ News loaded successfully!\n');
        setLastFetchTime(Date.now());
        setCachedCountry(selectedCountry);
      }
      
      setNewsData(data);
    } catch (err) {
      console.error('❌ Error fetching news:', err);
      setError(`Failed to load news.\n\nError: ${err.message}\n\nPlease check your internet connection and try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch news on component mount and country change
  useEffect(() => {
    // Only show loading if no cached data
    if (!isCacheValid() || cachedCountry !== selectedCountry) {
      setLoading(true);
    }
    fetchAllNews();
  }, [selectedCountry]);

  // Handle pull-to-refresh (force new data)
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    setIsSearchActive(false);
    fetchAllNews(true); // Force refresh, bypass cache
  };

  // Render featured/top story
  const renderFeaturedStory = () => {
    // Don't show featured section when searching
    if (searchQuery.trim()) return null;
    
    const topStories = newsData['general'] || [];
    if (topStories.length === 0) return null;
    
    const featured = topStories[0];
    if (!featured || !featured.title) return null;
    
    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.featuredLabel, { color: '#FF6B6B' }]}>FEATURED</Text>
        <TouchableOpacity 
          style={[styles.featuredCard, { backgroundColor: theme.cardBackground }]} 
          activeOpacity={0.9}
          onPress={() => handleArticlePress(featured, 'Top Stories')}
        >
          {featured.urlToImage ? (
            <Image
              source={{ uri: featured.urlToImage }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.featuredImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>BREAKING NEWS</Text>
            </View>
            <Text style={[styles.featuredTitle, { color: theme.featuredOverlayText }]} numberOfLines={3}>
              {featured.title}
            </Text>
            {featured.description && (
              <Text style={[styles.featuredDescription, { color: theme.featuredOverlayText }]} numberOfLines={2}>
                {featured.description}
              </Text>
            )}
            {featured.source?.name && (
              <Text style={styles.featuredSource}>{featured.source.name}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Render horizontal news card
  const renderHorizontalCard = ({ item }, category) => {
    if (!item || !item.title) return null;
    
    return (
    <TouchableOpacity 
      style={[styles.horizontalCard, { backgroundColor: theme.cardBackground }]} 
      activeOpacity={0.8}
      onPress={() => handleArticlePress(item, category)}
    >
      {item.urlToImage ? (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.horizontalImage, styles.placeholderImage]}>
          <Text style={styles.placeholderTextSmall}>No Image</Text>
        </View>
      )}
      <View style={styles.horizontalContent}>
        <Text style={[styles.horizontalTitle, { color: theme.text }]} numberOfLines={3}>
          {item.title}
        </Text>
        {item.source?.name && (
          <Text style={[styles.horizontalSource, { color: theme.secondaryText }]}>{item.source.name}</Text>
        )}
        {item.publishedAt && (
          <Text style={[styles.horizontalTime, { color: theme.tertiaryText }]}>
            {getTimeAgo(item.publishedAt)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
    );
  };

  // Render vertical news card (for expanded view)
  const renderVerticalCard = ({ item }, category) => {
    if (!item || !item.title) return null;
    
    return (
    <TouchableOpacity 
      style={[styles.verticalCard, { backgroundColor: theme.cardBackground }]} 
      activeOpacity={0.8}
      onPress={() => handleArticlePress(item, category)}
    >
      <View style={styles.verticalContent}>
        {item.urlToImage ? (
          <Image
            source={{ uri: item.urlToImage }}
            style={styles.verticalImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.verticalImage, styles.placeholderImage]}>
            <Text style={styles.placeholderTextSmall}>No Image</Text>
          </View>
        )}
        <View style={styles.verticalTextContent}>
          <Text style={[styles.verticalTitle, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[styles.verticalDescription, { color: theme.secondaryText }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.verticalMeta}>
            {item.source?.name && (
              <Text style={[styles.verticalSource, { color: theme.secondaryText }]}>{item.source.name}</Text>
            )}
            {item.publishedAt && (
              <Text style={[styles.verticalTime, { color: theme.tertiaryText }]}>
                {getTimeAgo(item.publishedAt)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  // Render category section
  const renderCategorySection = (category) => {
    const articles = newsData[category.id] || [];
    if (articles.length === 0) return null;
    
    // Filter out articles without titles
    const validArticles = articles.filter(article => article && article.title);
    if (validArticles.length === 0) return null;
    
    // Filter articles based on search query
    const filteredArticles = searchQuery.trim()
      ? validArticles.filter(article => 
          article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : validArticles;
    
    if (filteredArticles.length === 0) return null;
    
    const isExpanded = expandedCategories[category.id];
    // When searching, show all filtered articles; otherwise skip first (used in featured)
    const displayArticles = searchQuery.trim() ? filteredArticles : filteredArticles.slice(1);
    const articlesToShow = isExpanded ? displayArticles : displayArticles.slice(0, 5);
    const hasMore = displayArticles.length > 5 && !searchQuery.trim();
    
    return (
      <View key={category.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryTitle, { color: theme.text }]}>{category.name}</Text>
            {!searchQuery.trim() && (
              <Text style={[styles.articleCount, { color: theme.tertiaryText }]}>({displayArticles.length})</Text>
            )}
          </View>
          {hasMore && (
            <TouchableOpacity onPress={() => toggleCategory(category.id)} activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: category.color }]}>
                {isExpanded ? '← Show Less' : 'See All →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isExpanded ? (
          <View style={styles.verticalList}>
            {articlesToShow.map((item, index) => (
              <View key={`${category.id}-vertical-${item.url || index}`}>
                {renderVerticalCard({ item }, category.name)}
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            horizontal
            data={articlesToShow}
            renderItem={(props) => renderHorizontalCard(props, category.name)}
            keyExtractor={(item, index) => `${category.id}-${item.url || index}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </View>
    );
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return 'Recently';
    } catch (err) {
      return 'Recently';
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={[styles.loadingText, { color: theme.secondaryText }]}>
          Loading news from {COUNTRY_FLAGS[selectedCountry] || '🌍'} {selectedCountry.toUpperCase()}...
        </Text>
        <Text style={[styles.loadingSubtext, { color: theme.tertiaryText }]}>
          Please wait
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorText, { color: '#FF6B6B' }]}>{error}</Text>
        <View style={styles.errorActions}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              fetchAllNews(true); // Force refresh
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>🔄 Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.retryButton, styles.changeCountryButton]}
            onPress={openCountrySelector}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>🌍 Change Country</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main content
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: theme.headerText }]}>NewsHub</Text>
            <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>Stay informed, stay ahead</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={toggleSearch}
              activeOpacity={0.7}
            >
              <Text style={styles.headerButtonIcon}>{isSearchActive ? '✕' : '🔍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={openCountrySelector}
              activeOpacity={0.7}
            >
              <Text style={styles.countryFlag}>{COUNTRY_FLAGS[selectedCountry] || '🌍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isSearchActive && (
          <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search news..."
              placeholderTextColor={theme.tertiaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
      >
        {renderFeaturedStory()}
        {!searchQuery.trim() && (
          <View style={styles.countryIndicator}>
            <Text style={[styles.countryIndicatorText, { color: theme.secondaryText }]}>
              Showing news from: {COUNTRY_FLAGS[selectedCountry] || '🌍'} {selectedCountry.toUpperCase()}
            </Text>
            {isCacheValid() && lastFetchTime && (
              <Text style={[styles.cacheIndicatorText, { color: theme.tertiaryText }]}>
                📦 Cached • Updates every 15 min • Pull to refresh
              </Text>
            )}
          </View>
        )}
        {searchQuery.trim() !== '' && (
          <View style={styles.searchResultsHeader}>
            <Text style={[styles.searchResultsText, { color: theme.secondaryText }]}>
              🔍 Search results for "{searchQuery}"
            </Text>
          </View>
        )}
        {CATEGORIES.map(category => renderCategorySection(category))}
        {searchQuery.trim() !== '' && !CATEGORIES.some(cat => {
          const articles = newsData[cat.id] || [];
          return articles.filter(a => a && a.title).some(article => 
            article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }) && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={[styles.noResultsTitle, { color: theme.text }]}>No results found</Text>
            <Text style={[styles.noResultsText, { color: theme.secondaryText }]}>
              Try searching with different keywords
            </Text>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.tertiaryText }]}>Powered by NewsAPI.org</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  countryFlag: {
    fontSize: 24,
  },
  themeIcon: {
    fontSize: 22,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  searchResultsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countryIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  countryIndicatorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  cacheIndicatorText: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
    fontStyle: 'italic',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 15,
    opacity: 0.4,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 13,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  changeCountryButton: {
    backgroundColor: '#4ECDC4',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Featured Section
  featuredSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  featuredBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.9,
  },
  featuredSource: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  // Category Section
  categorySection: {
    marginTop: 25,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  articleCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 15,
  },
  // Horizontal Card
  horizontalCard: {
    width: width * 0.75,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  horizontalImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0E0E0',
  },
  horizontalContent: {
    padding: 15,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 10,
  },
  horizontalSource: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  horizontalTime: {
    fontSize: 11,
  },
  // Vertical List (Expanded View)
  verticalList: {
    paddingHorizontal: 20,
  },
  verticalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  verticalContent: {
    flexDirection: 'row',
    padding: 12,
  },
  verticalImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  verticalTextContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  verticalTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  verticalDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  verticalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalSource: {
    fontSize: 11,
    fontWeight: '500',
  },
  verticalTime: {
    fontSize: 10,
  },
  // Placeholder
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderTextSmall: {
    color: '#999',
    fontSize: 12,
  },
  // Footer
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default NewsScreen;
