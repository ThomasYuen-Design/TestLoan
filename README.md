# LOC Customer Portal

A React-based customer portal for Line of Credit (LOC) active members. This application provides a comprehensive dashboard for managing loan accounts, viewing transaction history, and accessing account services.

## Features

- **Account Overview**: View current balance, available credit, and account status
- **Transaction History**: Browse and filter transaction records
- **Payment Management**: Make payments and schedule future payments
- **Account Services**: Access various account-related services and tools
- **Responsive Design**: Optimized for desktop and mobile devices

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful, customizable SVG icons
- **JavaScript (JSX)**: Component-based architecture

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd loc-customer-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` and will automatically open in your default browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── src/
│   └── main.jsx                 # Application entry point
├── loc_customer_portal_active_member_mvp.jsx  # Main application component
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions about this application, please contact the development team.
