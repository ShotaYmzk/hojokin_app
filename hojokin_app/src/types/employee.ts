// src/types/employee.ts

/**
 * 従業員情報の型定義
 */
export interface Employee {
    id: string;                 // システム内部用ID
    employeeNumber: string;     // 従業員番号
    name: string;               // 氏名
    department: string;         // 所属部署
    status: "加入中" | "未加入" | "手続き中"; // 加入状況
    hireDate?: string;          // 入社年月日 (詳細情報として例示)
    email?: string;             // メールアドレス (詳細情報として例示)
  }
  
  /**
   * 検索条件の型定義
   */
  export interface EmployeeSearchCriteria {
    employeeNumber: string;
    name: string;
  }