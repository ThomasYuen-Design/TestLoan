# Contributing to LOC Customer Portal

Thank you for your interest in contributing to the LOC Customer Portal! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/loc-customer-portal.git
   cd loc-customer-portal
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes** following the coding standards below
2. **Test your changes** by running:
   ```bash
   npm run dev
   ```
3. **Build the project** to ensure no build errors:
   ```bash
   npm run build
   ```
4. **Commit your changes** with a clear, descriptive commit message
5. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** against the main branch

## Coding Standards

### JavaScript/React
- Use functional components with hooks
- Follow React best practices and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure components are properly exported

### Code Style
- Use consistent indentation (2 spaces)
- Use semicolons at the end of statements
- Use single quotes for strings unless double quotes are needed
- Keep line length reasonable (prefer under 100 characters)

### File Organization
- Keep components in logical directories
- Use descriptive file names
- Export components as default exports when appropriate

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add payment history filtering
fix: resolve responsive layout issue on mobile
docs: update README with new setup instructions
refactor: simplify transaction component logic
```

## Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Screenshots**: Include screenshots for UI changes
- **Breaking Changes**: Clearly mark any breaking changes

## Reporting Issues

When reporting bugs, please include:

1. **Description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, browser, Node.js version)
5. **Screenshots** if applicable

## Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider implementation** complexity

## Code Review Process

- All code changes require review before merging
- Reviewers will check for:
  - Code quality and standards
  - Functionality and edge cases
  - Performance implications
  - Security considerations
- Address review feedback promptly
- Be respectful and constructive in discussions

## Questions?

If you have questions about contributing, please:

1. Check the existing issues and discussions
2. Create a new issue with the "question" label
3. Reach out to the maintainers

Thank you for contributing to the LOC Customer Portal!
