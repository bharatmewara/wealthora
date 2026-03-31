# Wealthora

Wealthora is a full-stack business-services platform:
- Frontend: React + Vite + Tailwind
- Backend: Express + PostgreSQL (inside `server/`)

## Project structure

```text
wealthora/
  src/
    App.jsx
    main.jsx
    components/
      HeroSlider.jsx
      layout/
        AppLayout.jsx
        Header.jsx
        Footer.jsx
    contexts/
      AdminContext.jsx
    pages/
      Home.jsx
      Services.jsx
      ServiceDetail.jsx
      EnquiryForm.jsx
      Blog.jsx
      Testimonials.jsx
      Contact.jsx
      About.jsx
      Admin.jsx
      NotFound.jsx
  server/
    index.js
    db.js
    routes/
      serviceRoutes.js
      blogRoutes.js
      enquiryRoutes.js
      testimonialRoutes.js
      heroRoutes.js
```

## Run frontend

```bash
npm install
npm run dev
```

Frontend runs on Vite and proxies `/api` calls to `http://localhost:5000`.

## Run backend

```bash
cd server
npm install
npm run dev
```

Create `.env` in `server/` with:

```env
DB_USER=your_user
DB_HOST=localhost
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=false
PORT=5000
```

## Production build

```bash
npm run build
```

Build status: successful after refactor.