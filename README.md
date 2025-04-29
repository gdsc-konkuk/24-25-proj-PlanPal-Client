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
flowchart TD
    %% Client/UI Layer
    subgraph "Client/UI" 
        direction TB
        AppLayout["App Layout (src/app/layout.tsx)"]:::presentation
        AuthLayout["Auth Layout (src/app/(auth)/layout.tsx)"]:::presentation
        ChatPage["Chat Page (src/app/(auth)/chat/page.tsx)"]:::presentation
        DashboardPage["Dashboard Page (src/app/(auth)/dashboard/page.tsx)"]:::presentation
        ExplorePage["Explore Page (src/app/explore/page.tsx)"]:::presentation
        RootPage["Root Page (src/app/page.tsx)"]:::presentation
        ComponentsLib["Components Library (src/components/)"]:::presentation
        UILib["UI Library (src/components/ui/)"]:::presentation
        ChatComponent["Chat Component (src/components/chat.tsx)"]:::presentation
        CalendarComponent["Calendar Component (src/components/calendar.tsx)"]:::presentation
        WeeklySchedule["Weekly Schedule View (src/components/weekly-schedule-view.tsx)"]:::presentation
        AddEventForm["Add Event Form (src/components/add-event-form.tsx)"]:::presentation
        LoginModal["Login Modal (src/app/modules/landing/ui/components/login-modal.tsx)"]:::presentation
        GoogleMapComp["Google Map Component (src/components/google-map.tsx)"]:::presentation
        UseAPI["use-api Hook (src/hooks/use-api.ts)"]:::business
        AuthStore["Auth Store (src/store/auth-store.ts)"]:::business
    end

    %% Server/API Layer
    subgraph "Server/API" 
        direction TB
        NextServer["Next.js SSR & API Server"]:::business
        APILogout["Logout API (src/app/modules/auth/api/logout.ts)"]:::business
        APIOAuth["OAuth API (src/app/modules/auth/api/oauth.ts)"]:::business
        OAuthCallback["OAuth Callback Page (src/app/oauth/google/callback/page.tsx)"]:::business
        FetchAuthUtil["fetch-auth Utility (src/lib/fetch-auth.ts)"]:::business
        ServerFetch["server-fetch Utility (src/lib/server-fetch.ts)"]:::business
        UtilsLib["Utils (src/lib/utils.ts)"]:::business
    end

    %% External Services
    FirebaseAuth["Firebase Auth"]:::data
    FirestoreDB["Firestore/RTDB"]:::data
    GoogleOAuth["Google OAuth"]:::data
    GoogleMapsAPI["Google Maps API"]:::data

    %% Infrastructure & Deployment
    subgraph "Infrastructure & Deployment"
        direction TB
        Dockerfile["Dockerfile"]:::infra
        DockerIgnore[".dockerignore"]:::infra
        CloudBuild["cloudbuild.yaml"]:::infra
        NextConfig["next.config.mjs"]:::infra
        TSConfig["tsconfig.json"]:::infra
        TailwindConfig["tailwind.config.ts"]:::infra
        FirebaseConfig["firebase.json & .firebaserc"]:::infra
        Hosting["Firebase Hosting / Vercel"]:::infra
    end

    %% Connections
    RootPage -->|"renders via SSR"| NextServer
    AppLayout --> NextServer
    AuthLayout --> NextServer
    ChatPage --> NextServer
    DashboardPage --> NextServer
    ExplorePage --> NextServer

    ChatPage --> ChatComponent
    DashboardPage --> CalendarComponent
    DashboardPage --> WeeklySchedule
    DashboardPage --> AddEventForm
    ExplorePage --> LoginModal
    ChatPage --> GoogleMapComp

    AppLayout --> ComponentsLib
    AppLayout --> UILib
    ChatPage --> UseAPI
    DashboardPage --> UseAPI
    RootPage --> UseAPI
    UseAPI -->|uses| ServerFetch
    UseAPI -->|uses| FetchAuthUtil
    DashboardPage --> AuthStore
    ChatPage --> AuthStore

    NextServer -->|validates token| FirebaseAuth
    NextServer -->|reads/writes| FirestoreDB
    NextServer -->|redirect| GoogleOAuth
    OAuthCallback --> NextServer
    BrowserClient[Browser Client]:::presentation -->|SSR page request| NextServer
    BrowserClient -->|API calls| APILogout
    BrowserClient -->|API calls| APIOAuth
    BrowserClient -->|direct fetch| GoogleMapsAPI

    CloudBuild --> Dockerfile
    Dockerfile --> Hosting
    NextServer --> Hosting
    FirebaseConfig --> Hosting

    %% Click Events
    click AppLayout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/layout.tsx"
    click AuthLayout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/layout.tsx"
    click ChatPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/chat/page.tsx"
    click DashboardPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/(auth)/dashboard/page.tsx"
    click ExplorePage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/explore/page.tsx"
    click RootPage "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/page.tsx"
    click ComponentsLib "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/components/"
    click UILib "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/src/components/ui/"
    click APILogout "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/auth/api/logout.ts"
    click APIOAuth "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/auth/api/oauth.ts"
    click OAuthCallback "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/oauth/google/callback/page.tsx"
    click ChatComponent "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/components/chat.tsx"
    click CalendarComponent "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/components/calendar.tsx"
    click WeeklySchedule "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/components/weekly-schedule-view.tsx"
    click AddEventForm "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/components/add-event-form.tsx"
    click LoginModal "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/app/modules/landing/ui/components/login-modal.tsx"
    click UseAPI "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/hooks/use-api.ts"
    click AuthStore "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/store/auth-store.ts"
    click FetchAuthUtil "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/fetch-auth.ts"
    click ServerFetch "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/server-fetch.ts"
    click UtilsLib "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/src/lib/utils.ts"
    click FirebaseConfig "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/firebase.json"
    click Dockerfile "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/tree/main/dockerfile"
    click CloudBuild "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/cloudbuild.yaml"
    click NextConfig "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/next.config.mjs"
    click TSConfig "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/tsconfig.json"
    click TailwindConfig "https://github.com/gdsc-konkuk/24-25-proj-planpal-client/blob/main/tailwind.config.ts"

    %% Styles
    classDef presentation fill:#E0F7FA,stroke:#006064,color:#004D40
    classDef business fill:#E8F5E9,stroke:#1B5E20,color:#2E7D32
    classDef data fill:#FFF3E0,stroke:#E65100,color:#BF360C
    classDef infra fill:#ECEFF1,stroke:#37474F,color:#263238
```

## Deploy on GCP
This Service Deploy on GCP with Google Maps, Google Auth, Firebase.
