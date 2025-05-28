// src/components/EmployeeSearch/EmployeeSearch.tsx

import React, { useState, FormEvent, useMemo } from "react";
import { Employee, EmployeeSearchCriteria } from "../../types/employee";
import "./EmployeeSearch.css";

// モックデータ: バックエンドAPIからのレスポンスを想定
const mockEmployees: Employee[] = [
  { id: "1", employeeNumber: "DC0001", name: "山田 太郎", department: "人事部", status: "加入中", hireDate: "2010-04-01", email: "taro.yamada@example.com" },
  { id: "2", employeeNumber: "DC0002", name: "佐藤 花子", department: "営業部", status: "未加入", hireDate: "2015-04-01", email: "hanako.sato@example.com" },
  { id: "3", employeeNumber: "DC0003", name: "鈴木 一郎", department: "開発部", status: "手続き中", hireDate: "2018-10-01", email: "ichiro.suzuki@example.com" },
  { id: "4", employeeNumber: "DC0004", name: "高橋 良子", department: "人事部", status: "加入中", hireDate: "2012-07-01", email: "ryoko.takahashi@example.com" },
  { id: "5", employeeNumber: "DC0005", name: "田中 健太", department: "経理部", status: "未加入", hireDate: "2020-04-01", email: "kenta.tanaka@example.com" },
];

// モック関数: API呼び出しをシミュレート (今回はクライアントサイドフィルタリング)
const fetchEmployees = async (criteria: EmployeeSearchCriteria): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 検索条件が両方空の場合は空の配列を返す (実際のAPIではエラーまたは全件取得など仕様による)
      if (!criteria.employeeNumber && !criteria.name) {
        resolve([]);
        return;
      }
      const filtered = mockEmployees.filter(emp =>
        (criteria.employeeNumber ? emp.employeeNumber.toLowerCase().includes(criteria.employeeNumber.toLowerCase()) : true) &&
        (criteria.name ? emp.name.toLowerCase().includes(criteria.name.toLowerCase()) : true)
      );
      resolve(filtered);
    }, 500); // 意図的な遅延でローディング状態を表現
  });
};


const EmployeeSearch: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<EmployeeSearchCriteria>({
    employeeNumber: "",
    name: "",
  });
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // 検索実行フラグ

  // 検索条件の入力ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };

  // 検索実行ハンドラ
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // 検索開始時に前回のエラーをクリア

    // バリデーション
    if (!searchCriteria.employeeNumber.trim() && !searchCriteria.name.trim()) {
        setError("従業員番号または氏名のいずれかを入力してください。");
        setIsLoading(false); // ローディング状態を解除
        setSearchResults([]); // 既存の検索結果をクリア
        setHasSearched(true); // 検索試行はされたとみなす
        return;
    }

    setIsLoading(true);
    setHasSearched(true); // 検索が実行されたことを記録

    try {
      // API呼び出しをシミュレート
      const results = await fetchEmployees(searchCriteria);
      setSearchResults(results);
    } catch (err) {
      console.error("検索エラー:", err);
      // ユーザーフレンドリーなエラーメッセージを設定
      if (err instanceof Error) {
        setError(`検索処理中にエラーが発生しました: ${err.message}`);
      } else {
        setError("検索処理中に不明なエラーが発生しました。しばらくしてから再度お試しください。");
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索結果テーブルのメモ化 (パフォーマンス考慮)
  const resultsTable = useMemo(() => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <div role="status" aria-live="polite" className="flex flex-col items-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <p className="text-gray-600 mt-2">検索中です...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow" role="alert">
          <div className="flex">
            <div className="py-1"><i className="fas fa-exclamation-triangle mr-2 text-red-500"></i></div>
            <div>
              <p className="font-bold">エラー</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!hasSearched) { // 初回表示時や検索条件クリア後は何も表示しない
        return null;
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-10 text-gray-600 bg-white shadow-sm rounded-lg">
          <i className="fas fa-info-circle text-2xl mr-2 text-blue-500"></i>
          <p className="mt-2">該当する従業員は見つかりませんでした。</p>
          <p className="text-sm text-gray-500">検索条件を変更して再度お試しください。</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">従業員番号</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属部署</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加入状況</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searchResults.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.employeeNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    emp.status === "加入中" ? "bg-green-100 text-green-800" :
                    emp.status === "未加入" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => alert(`従業員ID: ${emp.id} (${emp.name}) の詳細を表示します。\n（実際の画面では詳細ページへ遷移またはモーダル表示）`)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    aria-label={`${emp.name}さんの詳細を表示`}
                  >
                    詳細表示
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [isLoading, error, searchResults, hasSearched]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col"> {/* 背景色: #F5F5F5 に近い Tailwind の gray-50 */}
      {/* ヘッダー (共通コンポーネントを想定) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0">
                {/* ここにロゴ画像を配置できます。例: <img className="h-8 w-auto" src="/logo.svg" alt="System Logo" /> */}
                <span className="font-bold text-xl text-blue-700"> {/* 強調色: #007BFF に近い Tailwind の blue-700 */}
                  確定拠出年金事務局支援システム
                </span>
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">ダッシュボード</a>
              <a href="#" className="text-blue-600 bg-blue-100 px-3 py-2 rounded-md text-sm font-medium" aria-current="page">従業員検索</a>
              {/* 他のナビゲーション項目を追加 */}
            </nav>
            <div className="hidden md:flex items-center">
              {/* ユーザー情報やログアウトボタンなど */}
              <span className="text-sm text-gray-600 mr-4">ようこそ、事務局担当者 様</span>
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <i className="fas fa-sign-out-alt mr-1"></i>ログアウト
              </button>
            </div>
            {/* モバイルメニューボタン (ハンバーガーメニュー) */}
            <div className="md:hidden">
                <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded="false">
                    <span className="sr-only">メインメニューを開く</span>
                    <i className="fas fa-bars text-xl"></i>
                </button>
            </div>
          </div>
        </div>
        {/* モバイル用メニュー (展開時) - 必要に応じてJSで制御 */}
        {/*
        <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">ダッシュボード</a>
                <a href="#" className="text-blue-600 bg-blue-100 block px-3 py-2 rounded-md text-base font-medium" aria-current="page">従業員検索</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                    <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">事務局担当者 様</div>
                    </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">ログアウト</a>
                </div>
            </div>
        </div>
        */}
      </header>

      {/* メインコンテンツ */}
      <main className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">従業員情報検索</h1>
            <p className="mt-1 text-sm text-gray-600">従業員番号または氏名で従業員情報を検索します。</p>
          </div>

          {/* 検索条件セクション */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <form onSubmit={handleSearch} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="employeeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    従業員番号
                  </label>
                  <input
                    type="text"
                    name="employeeNumber"
                    id="employeeNumber"
                    value={searchCriteria.employeeNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    placeholder="例: DC0001"
                    aria-describedby="employeeNumberHelp"
                    maxLength={10} // 桁数制限
                  />
                  <p id="employeeNumberHelp" className="mt-1 text-xs text-gray-500">半角英数字10桁以内で入力してください。</p>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    氏名
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={searchCriteria.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    placeholder="例: 山田 太郎"
                    aria-describedby="nameHelp"
                    maxLength={50} // 桁数制限
                  />
                   <p id="nameHelp" className="mt-1 text-xs text-gray-500">一部でも検索可能です (50文字以内)。</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                 <button
                  type="button" // type="reset" はフォーム全体をリセットするため、ここでは手動でクリア
                  onClick={() => {
                    setSearchCriteria({ employeeNumber: "", name: "" });
                    setSearchResults([]);
                    setError(null);
                    setHasSearched(false);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                  aria-label="検索条件をクリア"
                >
                  クリア
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? (
                    <svg aria-hidden="true" className="w-5 h-5 animate-spin text-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  ) : (
                    <><i className="fas fa-search mr-2"></i>検索</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 検索結果セクション */}
          <div className="mt-8">
            {/* resultsTableがnullでない（つまり、検索実行後かエラー発生時）場合にタイトルを表示 */}
            {(hasSearched || error) && (
                <h2 className="text-xl font-semibold text-gray-800 mb-4">検索結果</h2>
            )}
            {resultsTable}
          </div>
        </div>
      </main>

      {/* フッター (共通コンポーネントを想定) */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 確定拠出年金事務局支援システム. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default EmployeeSearch;