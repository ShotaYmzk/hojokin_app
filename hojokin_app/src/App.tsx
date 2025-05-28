// src/App.tsx

import React from 'react';
import EmployeeSearch from './components/EmployeeSearch/EmployeeSearch';
// src/App.tsx または src/index.tsx
import '@fortawesome/fontawesome-free/css/all.min.css';
// Font Awesome の CSS をインポート (プロジェクトのセットアップ方法によって異なります)
// 例: import '@fortawesome/fontawesome-free/css/all.min.css';
// もし create-react-app などで public/index.html にCDNリンクを記述している場合は不要です。

function App() {
  return (
    <div className="App">
      <EmployeeSearch />
    </div>
  );
}

export default App;