import express from 'express';
import authRoutes from './authRoutes.js';
import imageRoutes from './imageRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = express.Router();

// 挂载各个子路由
router.use('/', authRoutes);         // /api/login, /api/logout, /api/check-auth
router.use('/images', imageRoutes);  // /api/images/*
router.use('/stats', statsRoutes);   // /api/stats
router.use('/', uploadRoutes);       // /api/upload (管理后台上传)

export default router;

