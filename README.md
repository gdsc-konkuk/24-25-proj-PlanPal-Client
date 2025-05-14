## Getting Started

First, run the development server:
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More
```mermaid
flowchart LR
    subgraph "Client (Browser & UI)" 
        direction TB
        UI["Next.js App Router (src/app/)"]:::frontend
        Components["Reusable Components (src/components/)"]:::frontend
        UIUI["UI Components (src/components/ui/)"]:::frontend
        Hooks["Custom Hooks (src/hooks/use-api.ts)"]:::frontend
        Store["Auth Store (src/store/auth-store.ts)"]:::frontend
        Globals["Global CSS (src/app/globals.css)"]:::frontend
        Themes["Theme Styles (src/app/themes.css)"]:::frontend
        IndexCSS["Index CSS (src/index.css)"]:::frontend
        Tailwind["Tailwind Config (tailwind.config.ts)"]:::frontend
    end

    subgraph "Server (Next.js Runtime & APIs)"
        direction TB
        Server["Next.js Runtime"]:::backend
        Layouts["Server Components & Layouts"]:::backend
        AuthInit["Auth Initializer"]:::backend
        API_OAuth["OAuth API Endpoint"]:::backend
        API_Logout["Logout API Endpoint"]:::backend
        OAuthCallback["OAuth Callback Page"]:::backend
        AuthLayout["Auth Layout"]:::backend
        ChatPage["Chat Page"]:::backend
        ChatComp["Chat Component"]:::backend
        DashboardLayout["Dashboard Layout"]:::backend
        DashboardPage["Dashboard Page"]:::backend
        ExplorePage["Explore Page"]:::backend
        LandingPage["Landing Page"]:::backend
        LandingModal["Login Modal Component"]:::backend
        subgraph "Server Utilities"
            direction TB
            FetchAuth["fetch-auth Utility"]:::backend
            ServerFetch["server-fetch Utility"]:::backend
            Constants["Constants"]:::backend
            Utils["Misc Utils"]:::backend
        end
    end

    subgraph "External Services & Infrastructure"
        direction TB
        GoogleOAuth["Google OAuth"]:::external
        GoogleMaps["Google Maps API"]:::external
        Firebase["Firebase Hosting & Functions"]:::external
        Docker["Docker Configuration"]:::external
        CloudBuild["Cloud Build Pipeline"]:::external
        NextConfig["Next.js Config"]:::external
        ESLint["ESLint Config"]:::external
        Vercel["Vercel Platform (optional)"]:::external
    end

    %% Connections
    UI -->|"renders via SSR/CSR"| Layouts
    Components -->|used by| UI
    UIUI -->|used by| UI
    Hooks -->|calls| API_OAuth
    Hooks -->|calls| API_Logout
    Store -->|manages auth state for| UI
    API_OAuth -->|redirects to| GoogleOAuth
    OAuthCallback -->|updates| Store
    ServerFetch -->|calls| GoogleMaps
    FetchAuth -->|authenticates via| GoogleOAuth
    CloudBuild -->|builds image via| Docker
    CloudBuild -->|deploys to| Firebase
    NextConfig -->|configures| Server
    ESLint -->|lint code| Server

    %% Click Events
    click UI "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/app/"
    click Components "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/components/"
    click UIUI "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/components/ui/"
    click Hooks "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/hooks/use-api.ts"
    click Store "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/store/auth-store.ts"
    click Globals "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/globals.css"
    click Themes "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/themes.css"
    click IndexCSS "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/index.css"
    click Tailwind "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/tailwind.config.ts"
    click Layouts "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/app/"
    click API_OAuth "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/auth/api/oauth.ts"
    click API_Logout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/auth/api/logout.ts"
    click OAuthCallback "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/oauth/google/callback/page.tsx"
    click AuthLayout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/layout.tsx"
    click ChatPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/chat/page.tsx"
    click ChatComp "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/components/chat.tsx"
    click DashboardLayout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/dashboard/layout.tsx"
    click DashboardPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/dashboard/page.tsx"
    click ExplorePage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/explore/page.tsx"
    click LandingPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/page.tsx"
    click LandingModal "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/landing/ui/components/login-modal.tsx"
    click FetchAuth "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/fetch-auth.ts"
    click ServerFetch "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/server-fetch.ts"
    click Constants "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/constant.ts"
    click Utils "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/utils.ts"
    click Firebase "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/firebase.json"
    click Docker "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/dockerfile"
    click CloudBuild "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/cloudbuild.yaml"
    click NextConfig "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/next.config.mjs"
    click ESLint "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/eslint.config.mjs"

    %% Styles
    classDef frontend fill:#D0E8FF,stroke:#0366D6,color:#0366D6;
    classDef backend fill:#DDF5DD,stroke:#28A745,color:#28A745;
    classDef external fill:#FFEFD5,stroke:#EA5504,color:#EA5504;
```

## Deploy on GCP
This Service Deploy on GCP with Google Maps, Google Auth, Firebase.
