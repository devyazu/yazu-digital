import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// #region agent log
fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'index.tsx:beforeCreateRoot',message:'bootstrap',data:{hasCreateRoot:typeof createRoot,hasRootElement:!!rootElement},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
// #endregion
const root = createRoot(rootElement);
// #region agent log
fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'index.tsx:afterCreateRoot',message:'createRoot done',data:{hasRoot:!!root,rootRender:typeof root?.render},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
// #endregion
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// #region agent log
fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'index.tsx:afterRender',message:'root.render called',data:{},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
// #endregion