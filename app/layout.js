
// app/layout.js
import ThemeProvider from './ThemeProvider';  // Import the ThemeProvider component

export const metadata = {
  title: 'Pantry Tracker',
  description: 'Track your pantry items efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
