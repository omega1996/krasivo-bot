# Krasivo Bot

A Telegram bot built with TypeScript and Bun that provides AI-powered responses and keyword-triggered actions.

## Quick Start

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

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
