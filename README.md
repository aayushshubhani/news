# 📰 NewsHub - React Native News App

A feature-rich, modern news application built with React Native and Expo that delivers news from around the world with a beautiful, intuitive interface.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 📱 Core Features
- **7 News Categories**: Top Stories, Business, Technology, Sports, Entertainment, Health, Science
- **40+ Countries**: Select news from different countries worldwide
- **Search Functionality**: Search across all articles and categories
- **Detailed Article View**: Full article details with images and metadata
- **Pull-to-Refresh**: Easily refresh news feed
- **Smart Caching**: 15-minute cache to optimize API usage

### 🎨 UI/UX Features
- **Light & Dark Mode**: Toggle between themes with smooth transitions
- **Featured Stories**: Highlighted top news with full-width cards
- **Expandable Sections**: "See All" functionality for each category
- **Horizontal Scrolling**: Swipe through articles in each section
- **Responsive Design**: Optimized for all screen sizes
- **Modern UI**: Clean, intuitive interface with emoji icons

### ⚡ Technical Features
- **Rate Limit Protection**: Sequential API calls with delays to avoid hitting limits
- **Error Handling**: Comprehensive error messages and fallback mechanisms
- **Navigation**: React Navigation with smooth transitions
- **Performance Optimized**: Lazy loading and efficient state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AdityaSir1512/NewsHub.git
cd NewsHub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Key (Optional)**

The app comes with a GNews API key, but you can use your own:

- Visit [GNews.io](https://gnews.io)
- Sign up for a free account (100 requests/day)
- Replace the API key in `NewsScreen.js`:

```javascript
const API_KEY = 'your-gnews-api-key-here';
```

4. **Start the app**
```bash
npm start
# or
expo start
```

5. **Run on your device**
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser

## 📁 Project Structure

```
NewsHub/
├── App.js                      # Main navigation setup
├── NewsScreen.js               # Main news feed screen
├── NewsDetailScreen.js         # Article detail screen
├── CountrySelectionScreen.js   # Country selector screen
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── README.md                   # You are here!
```
NewsHub/
├── App.js                      # Main navigation setup
├── NewsScreen.js               # Main news feed screen
├── NewsDetailScreen.js         # Article detail screen
├── CountrySelectionScreen.js   # Country selector screen
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── README.md                   # You are here!
```

## 🎯 Usage Guide

### Main Screen
- **Theme Toggle**: Tap the moon/sun icon to switch themes
- **Country Selector**: Tap the flag icon to choose country
- **Search**: Tap the search icon to search articles
- **Category Sections**: Scroll through different news categories
- **See All**: Tap to expand/collapse category sections
- **Pull Down**: Refresh to get latest news

### Country Selection
- Browse 40+ countries with flags
- Search for specific countries
- "✓ Best" badge shows recommended countries
- Tap any country to update news

### Article Details
- Tap any article card to see full details
- View source, author, and publish date
- Read article description and content
- Tap "Read Full Article" to open in browser

## 📦 Core Dependencies

```json
{
  "react-native": "0.76.6",
  "expo": "~55.0.0",
  "axios": "^1.6.7",
  "@react-navigation/native": "^7.0.13",
  "@react-navigation/native-stack": "^7.2.3",
  "react-native-screens": "~4.23.0",
  "react-native-safe-area-context": "~5.6.2"
}
```

## 🌍 Supported Countries

🇺🇸 United States • 🇬🇧 United Kingdom • 🇨🇦 Canada • 🇦🇺 Australia • 🇮🇳 India • 🇩🇪 Germany • 🇫🇷 France • 🇮🇹 Italy • 🇪🇸 Spain • 🇯🇵 Japan • 🇰🇷 South Korea • 🇨🇳 China • 🇧🇷 Brazil • 🇲🇽 Mexico • 🇦🇷 Argentina • 🇿🇦 South Africa • 🇷🇺 Russia • 🇳🇱 Netherlands • 🇸🇪 Sweden • 🇨🇭 Switzerland • 🇦🇪 UAE • 🇸🇦 Saudi Arabia • 🇮🇱 Israel • 🇹🇷 Turkey • 🇪🇬 Egypt • 🇳🇬 Nigeria • 🇵🇭 Philippines • 🇹🇭 Thailand • 🇸🇬 Singapore • 🇲🇾 Malaysia • 🇮🇩 Indonesia • 🇳🇿 New Zealand • 🇵🇹 Portugal • 🇵🇱 Poland • 🇧🇪 Belgium • 🇦🇹 Austria • 🇳🇴 Norway • 🇩🇰 Denmark • 🇫🇮 Finland • 🇮🇪 Ireland

## 🔧 Technical Details

### API Integration
- **Provider**: GNews.io
- **Free Tier**: 100 requests/day
- **Article Delay**: 12 hours (free plan)
- **Rate Limiting**: Sequential requests with 1.5s delays
- **Caching**: 15-minute cache duration

### State Management
- React Hooks (useState, useEffect)
- Local state for news data, theme, country selection
- Cache management with timestamps

### Navigation
- React Navigation Stack Navigator
- Custom headers with theme support
- Smooth slide animations between screens

### Performance Optimizations
- Smart caching to reduce API calls
- Sequential API requests to avoid rate limits
- Lazy loading of images
- Efficient FlatList rendering

## ⚠️ Important Notes

### API Rate Limits
The free GNews API tier has a 100 requests/day limit. The app implements:
- **Sequential loading** (~10 seconds initial load)
- **15-minute caching** to reduce API calls
- **Smart refresh** only when needed

### Free Plan Limitations
- 12-hour article delay (not real-time)
- 100 requests per day
- Maximum 10 articles per category

### Tips for Best Experience
- Wait 15 minutes between refreshes
- Use recommended countries (marked with ✓)
- Avoid excessive country switching
- Pull-to-refresh only when needed

## 🐛 Troubleshooting

**Issue: Rate limit errors**
- Solution: Wait a few minutes before refreshing
- The app caches data for 15 minutes
- Check if you've exceeded 100 requests/day

**Issue: No articles loading**
- Check internet connection
- Try switching to a recommended country (🇺🇸 🇬🇧 🇨🇦)
- Pull down to refresh
- Verify API key is valid

**Issue: Images not loading**
- Some articles may not have images
- App displays "No Image" placeholder
- This is normal for certain news sources

**Issue: Slow initial load**
- Normal: Sequential API calls take ~10 seconds
- Subsequent loads are instant (cached)
- This prevents rate limiting

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer

Created by Aditya Sirohi

## 🙏 Acknowledgments

- [GNews.io](https://gnews.io) for the news API
- [Expo](https://expo.dev) for the development platform
- React Native community for excellent documentation

---

**Made with ❤️ using React Native & Expo**
