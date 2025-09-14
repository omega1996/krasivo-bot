# Krasivo Bot

A Telegram bot built with TypeScript that provides AI-powered responses and keyword-triggered actions. The bot uses MongoDB to store conversation history and model settings.

## Quick Start

### For Development

1. **Start MongoDB services** (required for bot functionality):
   ```bash
   docker-compose up mongo mongo-express -d
   ```
   This starts:
   - MongoDB database on port 27017
   - Mongo Express (web interface) on port 8081

2. **Set up environment and install dependencies**:
   ```bash
   cp .env.example .env  # Create your .env file
   # Edit .env with your actual tokens and settings
   bun install
   bun run index.ts
   ```

### For Production

Run the complete stack with Docker Compose:

```bash
docker-compose up -d
```

This starts all services including the Telegram bot container.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Telegram Bot Configuration
TELEGRAM_TOKEN=your_telegram_bot_token_here
ADMIN_CHAT_ID=your_admin_chat_id_here

# AI Model Configuration
MODEL=gemma3:12b
API_URL=https://your-api-endpoint.com/v1/
OPENAI_API_KEY=your_openai_api_key_here

# Debug Settings
DEBUG_BOT=true

# MongoDB Configuration
MONGO_DB_NAME=telegramBot
MONGO_ROOT_USER=root
MONGO_ROOT_PASS=your_mongo_password_here

# Mongo Express (Optional)
MONGOEXPRESS_LOGIN=root
MONGOEXPRESS_PASSWORD=your_mongo_express_password_here
```

### Required Variables

- `TELEGRAM_TOKEN`: Your Telegram bot token from [@BotFather](https://t.me/botfather)
- `ADMIN_CHAT_ID`: Your Telegram chat ID for admin commands
- `API_URL`: OpenAI-compatible API endpoint URL
- `OPENAI_API_KEY`: API key for the AI service

### Optional Variables

- `MODEL`: AI model name (default: `gemma3:12b`)
- `DEBUG_BOT`: Enable debug logging (default: `true`)
- `MONGO_*`: MongoDB connection settings (defaults provided)
- `MONGOEXPRESS_*`: Mongo Express web interface settings

## Architecture

The bot consists of several key components:

- **Telegram Bot**: Handles incoming messages and responses
- **MongoDB**: Stores conversation history per chat and bot settings
- **AI Integration**: Uses OpenAI-compatible API for generating responses
- **Keyword Actions**: Triggers specific actions based on message content

### Data Storage

MongoDB stores:
- **Conversation History**: Message threads organized by chat ID
- **Bot Settings**: Model configuration, cooldown settings, system prompts
- **Admin Settings**: Configuration managed through admin commands

## Contributing

We welcome contributions to improve the Krasivo Bot! Here's how you can get involved:

### Getting Started

1. **Fork the repository** - Click the "Fork" button on the GitHub page to create your own copy
2. **Clone your fork** - Download your forked repository to your local machine:
   ```bash
   git clone git@github.com:YOUR_USERNAME/krasivo-bot.git
   cd krasivo-bot
   ```
3. **Set up the project** - Install dependencies and set up your environment:
   ```bash
   bun install
   cp .env.example .env  # Create your own .env file with your tokens
   # Edit .env file with your actual tokens and settings
   docker-compose up mongo mongo-express -d  # Start MongoDB services
   ```

### Making Changes

1. **Create a feature branch** - Always work on a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Implement your feature** - Make your changes, add tests if applicable
3. **Test your changes** - Ensure everything works as expected
4. **Commit your changes** - Use clear, descriptive commit messages:
   ```bash
   git add .
   git commit -m "Add: new feature description"
   ```

### Submitting Changes

1. **Push your branch** - Upload your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Create a Pull Request** - Go to the original repository and click "New Pull Request"
3. **Fill out the PR template** - Describe your changes and any relevant information
4. **Wait for review** - Maintainers will review your code and provide feedback

### Development Guidelines

- **Code Style**: Follow the existing TypeScript patterns in the codebase
- **Testing**: Test your changes thoroughly before submitting
- **Documentation**: Update README or add comments for complex features
- **Security**: Never commit sensitive information like API keys or tokens
- **Issues**: Check existing issues before starting work, or create a new issue to discuss major changes

### What We're Looking For

- 🐛 Bug fixes
- ✨ New features and improvements
- 📚 Documentation improvements
- 🧪 Test coverage
- 🔧 Performance optimizations
- 🎨 UI/UX improvements

### Questions?

Feel free to open an issue if you have questions about contributing or need help getting started!

---

**Note**: Make sure to set up your own `.env` file with your Telegram bot token and other required environment variables before running the bot.
