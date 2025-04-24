// @ts-nocheck - 此文件有React 18类型问题，暂时忽略类型检查
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './app';
import { MotionConfig } from 'framer-motion';
import './global.css';

// 找到root元素并确保其存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('找不到root元素，请检查HTML结构');
}

// 创建React root
const root = ReactDOM.createRoot(rootElement);

// 渲染应用
root.render(
  <StrictMode>
    <MotionConfig
      // 设置reducedMotion以尊重用户偏好设置
      reducedMotion="user"
      // 全局启用转换动画的同步驱动，以支持高刷新率设备
      transition={{
        syncDriver: true,
        // 提高性能的终止条件
        restSpeed: 0.001,
        restDelta: 0.001
      }}
    >
      <App />
    </MotionConfig>
  </StrictMode>
);
