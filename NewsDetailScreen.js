import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const NewsDetailScreen = ({ route, navigation }) => {
  const { article, theme } = route.params;

  const handleReadMore = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        <Text style={[styles.headerTitle, { color: theme.headerText }]} numberOfLines={1}>
          News Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Image */}
        {article.urlToImage ? (
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mainImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        {/* Content Container */}
        <View style={[styles.contentContainer, { backgroundColor: theme.cardBackground }]}>
          {/* Category Badge */}
          {article.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            {article.title}
          </Text>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            {article.source?.name && (
              <View style={styles.sourceContainer}>
                <Text style={styles.sourceIcon}>📰</Text>
                <Text style={[styles.sourceName, { color: theme.secondaryText }]}>
                  {article.source.name}
                </Text>
              </View>
            )}
            {article.author && (
              <View style={styles.authorContainer}>
                <Text style={styles.authorIcon}>✍️</Text>
                <Text style={[styles.authorName, { color: theme.secondaryText }]}>
                  {article.author}
                </Text>
              </View>
            )}
            {article.publishedAt && (
              <View style={styles.dateContainer}>
                <Text style={styles.dateIcon}>🕒</Text>
                <Text style={[styles.dateText, { color: theme.tertiaryText }]}>
                  {formatDate(article.publishedAt)}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {article.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
              <Text style={[styles.description, { color: theme.secondaryText }]}>
                {article.description}
              </Text>
            </View>
          )}

          {/* Content */}
          {article.content && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Full Story</Text>
              <Text style={[styles.content, { color: theme.secondaryText }]}>
                {article.content.replace(/\[\+\d+ chars\]/, '...')}
              </Text>
            </View>
          )}

          {/* Read More Button */}
          {article.url && (
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={handleReadMore}
              activeOpacity={0.8}
            >
              <Text style={styles.readMoreText}>Read Full Article</Text>
              <Text style={styles.readMoreIcon}>🔗</Text>
            </TouchableOpacity>
          )}

          {/* Additional Info */}
          <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.infoText, { color: theme.tertiaryText }]}>
              📱 Tap "Read Full Article" to view the complete story on the source website
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  mainImage: {
    width: width,
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: 400,
  },
  categoryBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 20,
  },
  metaContainer: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sourceName: {
    fontSize: 15,
    fontWeight: '600',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateText: {
    fontSize: 13,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
  },
  readMoreButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  readMoreIcon: {
    fontSize: 18,
  },
  infoBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default NewsDetailScreen;
