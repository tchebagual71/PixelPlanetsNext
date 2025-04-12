// app/layout.js

export const metadata = {
    title: "Pixel Planets",
    description: "Create and customize your own procedural pixel planets",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head>
          {/* Link your favicon */}
          <link rel="shortcut icon" href="/TemplateData/favicon.ico" />
          {/* Link your main CSS from public/TemplateData */}
          <link rel="stylesheet" href="/TemplateData/style.css" />
        </head>
        <body>{children}</body>
      </html>
    );
  }
  