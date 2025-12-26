# CR AudioViz AI - Central Components Library

**The one-stop shop for ALL shared components and services.**

Per **Henderson Standard**: Every app MUST use these centralized components.

## Installation

```bash
npm install @craudiovizai/components
# or use directly from GitHub
npm install github:CR-AudioViz-AI/crav-components
```

## Components

### JavariChat - AI Assistant Embed
```tsx
import { JavariChat } from 'crav-components';

// In your app layout
<JavariChat 
  appId="your-app-id"
  userId={user?.id}
  position="bottom-right"
  primaryColor="#3B82F6"
/>
```

### CrossSell - Product Recommendations
```tsx
import { CrossSell } from 'crav-components';

// Anywhere in your app
<CrossSell 
  currentApp="javari"
  userId={user?.id}
  maxItems={3}
/>
```

## Client Libraries

### Authentication
```tsx
import { signIn, signUp, signOut, getSession } from 'crav-components';

// Sign in
const { data, error } = await signIn(email, password);

// Get current session
const session = await getSession();
```

### Payments
```tsx
import { createCheckout, getCreditsBalance, spendCredits } from 'crav-components';

// Create Stripe checkout
const { url } = await createCheckout({ priceId: 'price_xxx' });

// Check credits
const balance = await getCreditsBalance(userId);
```

### Error Handling
```tsx
import { reportError, setupGlobalErrorHandler } from 'crav-components';

// Setup once in your app
setupGlobalErrorHandler();

// Report errors manually
try {
  // risky operation
} catch (error) {
  await reportError(error, { userId, route: '/dashboard' });
}
```

### Activity Logging
```tsx
import { logActivity } from 'crav-components';

// Log any action
await logActivity('page_view', { page: '/dashboard' });
await logActivity('feature_use', { feature: 'ai-generate' });
```

## Environment Variables Required

```env
NEXT_PUBLIC_CENTRAL_API=https://craudiovizai.com/api
NEXT_PUBLIC_APP_ID=your-app-id
NEXT_PUBLIC_SUPABASE_URL=https://kteobfyferrukqeolofj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Henderson Standard Compliance

Using these components ensures your app meets:
- ✅ Central authentication (not custom)
- ✅ Central payment processing (Stripe + PayPal)
- ✅ Universal credit system
- ✅ Activity logging
- ✅ Javari AI chat embedded
- ✅ Cross-sell component
- ✅ Auto error ticketing

---

**CR AudioViz AI** | Your Story. Our Design.
