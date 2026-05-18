export const dynamic = 'force-dynamic'
export default function Home() {
  return (
    <div style={{background:'#07080f',minHeight:'100vh',color:'white',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:'system-ui'}}>
      <div style={{textAlign:'center'}}>
        <h1 style={{fontSize:32,fontWeight:800,marginBottom:12}}>Javari Components</h1>
        <p style={{color:'#9ca3af'}}>CR AudioViz AI design system and component library</p>
        <a href="https://craudiovizai.com/auth/signup"
           style={{display:'inline-block',marginTop:24,background:'#6366f1',
                   color:'white',borderRadius:8,padding:'10px 24px',
                   textDecoration:'none',fontWeight:700}}>
          Get Started Free →
        </a>
      </div>
    </div>
  )
}
