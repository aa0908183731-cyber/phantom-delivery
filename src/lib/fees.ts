// 外送費與服務費（固定）。放在無 "use client" 的模組，
// 讓 Server Action 與 Client 元件都能安全 import。
export const DELIVERY_FEE = 35;
export const SERVICE_FEE = 10;
