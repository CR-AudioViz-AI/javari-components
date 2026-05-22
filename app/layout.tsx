import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Javari Components | CR AudioViz AI Design System',
  description: 'Component library for the Javari ecosystem',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07080f' }}>
        {children}
      <footer style={{background:"#040912",padding:"12px 20px",textAlign:"center",fontFamily:"system-ui"}}>
          <p style={{color:"#374151",fontSize:11,margin:0}}>© 2026 CR AudioViz AI, LLC — EIN: 39-3646201 · <a href="https://craudiovizai.com/auth/signup" style={{color:"#FF0800",textDecoration:"none",fontWeight:600}}>Sign Up Free</a></p>
        </footer>
      </body>
    </html>
  )
}
