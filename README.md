# News App - React Native Expo

A simple news application built with React Native and Expo that fetches and displays the latest US news headlines using the News API.

## Features

- ✅ Fetches latest news headlines using Axios
- ✅ Displays news articles with images and titles
- ✅ Loading and error state handling
- ✅ Pull-to-refresh functionality
- ✅ Responsive design
- ✅ Clean and modern UI

## Setup Instructions

### 1. Get Your News API Key

1. Visit [https://newsapi.org](https://newsapi.org)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure the API Key

Open `NewsScreen.js` and replace `YOUR_API_KEY` with your actual API key:

```javascript
const API_KEY = 'your-actual-api-key-here';
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
# Start the Expo development server
npm start

# Or run directly on a platform:
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

## Project Structure

```
News App/
├── App.js              # Main app entry point
├── NewsScreen.js       # News screen component with API integration
├── package.json        # Project dependencies
├── app.json           # Expo configuration
└── babel.config.js    # Babel configuration
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **Axios** - HTTP client for API calls
- **News API** - News data provider

## API Endpoint

The app uses the News API top headlines endpoint:
```
https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY
```

## Requirements Met

✅ Axios for API calls  
✅ News API integration  
✅ React hooks (useState, useEffect)  
✅ FlatList for displaying articles  
✅ Image and title display  
✅ Loading state handling  
✅ Error state handling  
✅ Functional components  
✅ Image on top, title below layout  

## Troubleshooting

**Issue: Getting API errors**
- Make sure you've replaced `YOUR_API_KEY` with your actual key
- Check if your API key is valid at newsapi.org
- Ensure you have an active internet connection

**Issue: Images not loading**
- Some news articles may not have images
- The app displays a placeholder for articles without images

## License

This project is open source and available for educational purposes.
