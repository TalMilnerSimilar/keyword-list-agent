# Keyword List Agent

A React-based web application for generating and managing keyword lists with AI assistance. This application provides an intuitive interface for creating keyword lists with hierarchical organization and intelligent grouping.

## Features

- **AI-Powered Keyword Generation**: Generate relevant keywords using Guy's Assistant API
- **Hierarchical Organization**: Keywords are automatically grouped into relevant categories
- **Smart Selection**: Select individual keywords or entire groups with intelligent checkbox behavior
- **50-Keyword Limit**: Built-in limit management with visual feedback
- **Real-time Loading**: Smooth loading states with animated GIF
- **Responsive Design**: Modern UI with Tailwind CSS styling

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **API Integration**: Custom API service for keyword generation
- **NLP**: Compromise library for intelligent group naming
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd keyword-list-agent
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Create a Keyword List**: Click the "Create a keyword list" button
2. **Enter a Topic**: Type your topic in the AI input field
3. **Generate Keywords**: Click "Create" to generate keywords using AI
4. **Select Keywords**: Choose individual keywords or entire groups
5. **Save and Analyze**: Use the selected keywords for your analysis

## API Integration

The application integrates with the Shopper Agents API:
- **Base URL**: `https://shopper-agents-api.sandbox.similarweb.com/agent`
- **Agent**: Guy's Assistant (ID: `ddc14fc3-3351-462d-b7e3-9da802fa87e1`)
- **Domain**: Amazon.com (hardcoded)

## Project Structure

```
src/
├── components/
│   ├── KeywordListAgent.js    # Main container component
│   ├── KeywordDetails.js      # Main panel with input fields
│   └── KeywordList.js         # Hierarchical keyword display
├── services/
│   └── api.js                 # API service for keyword generation
└── App.js                     # Root application component
```

## Key Features

### Hierarchical Checkbox Behavior
- **Select All**: Checks all keywords in the list
- **Group Selection**: Checks all keywords within a group
- **Individual Selection**: Checks specific keywords
- **Intermediate States**: Visual feedback for partial selections
- **50-Keyword Limit**: Prevents exceeding the maximum selection

### Loading States
- **Immediate Panel Opening**: Secondary panel opens instantly when generating
- **Animated Loader**: 200x200px GIF animation during API calls
- **Progress Feedback**: Clear messaging about generation status

### UI/UX Features
- **Smooth Animations**: Panel sliding and transitions
- **Responsive Design**: Works on various screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful error messages and fallbacks

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub. 