# Task Progress Tracker

## Completed: 0/18

### Phase 1: Setup & DB (4 steps)
- [ ] 1. Install multer in server: `cd server && npm install multer`
- [ ] 2. Create public/uploads directory
- [ ] 3. Create upload middleware: server/middleware/upload.js
- [ ] 4. DB Migration: Create server/migrations/add_image_columns.sql & add columns (avatar_image, banner_image to testimonials; image to hero_slides/blogs)

### Phase 2: Backend Updates (6 steps)
- [ ] 5. Update server/routes/testimonialRoutes.js: Handle avatar/banner uploads
- [ ] 6. Update server/routes/heroRoutes.js: Handle image uploads
- [ ] 7. Update server/routes/blogRoutes.js: Handle blog_image uploads
- [ ] 8. Update server/routes/enquiryRoutes.js: Add /export-csv with separate date/time
- [ ] 9. Register upload middleware in server/index.js
- [ ] 10. Update serviceRoutes.js if needed for new services

### Phase 3: Frontend Admin & Context (4 steps)
- [ ] 11. Update src/pages/Admin.jsx: Add file inputs for images in forms
- [ ] 12. Update src/contexts/AdminContext.jsx: Handle FormData with images in API calls
- [ ] 13. Update Home about section: Add page selector dropdown for cta_url

### Phase 4: Frontend UI Fixes (4 steps)
- [ ] 14. src/components/layout/Header.jsx: Make mobile/desktop phone tel: clickable
- [ ] 15. src/pages/Testimonials.jsx: Fix stars to SVG, add slider with review/rating display
- [ ] 16. src/components/HeroSlider.jsx: Display images
- [ ] 17. src/pages/Blog.jsx & BlogDetail.jsx: Display blog images

### Phase 5: Content & Test
- [ ] 18. Replace services with new list via admin, test all features (CSV, dialer, slider, uploads)

**Next:** Run `npm install` in server if needed, execute migrations manually via psql (provide DB details if automated), `npm run dev` to test.

**Status:** Ready for Phase 1.

