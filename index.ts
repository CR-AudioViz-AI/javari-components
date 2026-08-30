/**
 * CR AudioViz AI - Central Components Library
 * 
 * This library provides ALL shared components per Henderson Standard.
 * Import from here to ensure consistency across apps.
 * 
 * @package javari-components
 * @version 1.0.0
 */

// UI Components
export { JavariChat } from './components/JavariChat';
export { CrossSell } from './components/CrossSell';

// Client Libraries (Central Services)
export * from './lib/central-auth';
export * from './lib/central-payments';
export * from './lib/central-ops';
// 2026-08-29: NOT a blanket re-export. lib/error-handler.ts and lib/central-ops.ts
// BOTH export reportError and setupGlobalErrorHandler, so `export *` from both
// raised TS2308 twice and the whole barrel failed to compile.
//
// central-ops is the fuller module — 290 lines covering logActivity, logPageView,
// logFeatureUse, createTicket, getUserTickets and sendNotification as well as the
// two error functions — so it keeps them. error-handler is 145 lines and its only
// export central-ops does NOT have is createErrorBoundaryHandler.
//
// The file is KEPT rather than deleted: it has one unique export and nothing in
// this repo imports it except this barrel, so deleting it would remove a working
// function to fix a name collision. Named export instead.
export { createErrorBoundaryHandler } from './lib/error-handler';

// Usage Example:
// import { JavariChat, CrossSell, signIn, createCheckout, reportError } from 'javari-components';
