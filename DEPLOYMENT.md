# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js application.

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Meteor Impact Simulator"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Deploy to Netlify

1. **Build your app**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Or use Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `.next` folder

## Deploy to Your Own Server

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start npm --name "meteor-simulator" -- start

# Save the process list
pm2 save

# Set up startup script
pm2 startup
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t meteor-simulator .
docker run -p 3000:3000 meteor-simulator
```

## Environment Variables

This app doesn't require any environment variables, but you can add them in `.env.local`:

```env
# Optional: Custom API keys if you switch map providers
NEXT_PUBLIC_MAP_API_KEY=your_key_here
```

## Performance Optimization

### Enable Compression

Add to `next.config.ts`:

```typescript
const nextConfig = {
  compress: true,
  // ... other config
};
```

### Image Optimization

Already built-in with Next.js Image component.

### Static Export (Optional)

If you want to export as static HTML:

```bash
npm run build
npm run export
```

Note: This will disable some Next.js features but works on any static hosting.

## Custom Domain

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Other Providers
Point your domain's DNS to your hosting provider's servers.

## Monitoring

### Vercel Analytics (Free)

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting Deployment

### Build Fails
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies are in `package.json`

### Map Not Loading
- Check that CSP headers allow loading from `tile.openstreetmap.org`
- Ensure JavaScript is enabled

### Performance Issues
- Enable Next.js image optimization
- Use CDN for static assets
- Enable compression

## Security Best Practices

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

2. **Set security headers** in `next.config.ts`:
   ```typescript
   const nextConfig = {
     headers: async () => [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
         ],
       },
     ],
   };
   ```

3. **Use HTTPS** - Most hosting providers enable this automatically

## Cost Estimates

- **Vercel**: Free tier supports this app completely
- **Netlify**: Free tier sufficient
- **AWS/GCP**: ~$5-10/month for small instance
- **Digital Ocean**: $5/month for basic droplet

## Support

For deployment issues:
- Check Next.js deployment docs: https://nextjs.org/docs/deployment
- Vercel support: https://vercel.com/support
- GitHub Issues: Create an issue in your repo

## Post-Deployment Checklist

- [ ] Test on mobile devices
- [ ] Verify map loads correctly
- [ ] Check all preset scenarios work
- [ ] Test calculation accuracy
- [ ] Set up analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate
- [ ] Test performance with Lighthouse
- [ ] Share with NASA Space Apps community! 🚀
