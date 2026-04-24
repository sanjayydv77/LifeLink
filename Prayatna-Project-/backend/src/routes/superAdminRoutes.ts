import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Hospital from '../models/Hospital';
import AmbulanceDriver from '../models/AmbulanceDriver';
import EmergencyRequest from '../models/EmergencyRequest';
import Appointment from '../models/Appointment';
import AmbulanceHospitalNotification from '../models/AmbulanceHospitalNotification';

const router = Router();

const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || 'sanjay';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'yadav';
const SUPER_ADMIN_JWT_SECRET =
  process.env.SUPER_ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'LifeLink_super_admin_secret';

const authSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SUPER_ADMIN_JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'super_admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    (req as any).superAdmin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// POST /api/super-admin/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (username !== SUPER_ADMIN_USERNAME || password !== SUPER_ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { role: 'super_admin', username: SUPER_ADMIN_USERNAME },
    SUPER_ADMIN_JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    success: true,
    message: 'Login successful',
    data: { token },
  });
});

// GET /api/super-admin/stats
router.get('/stats', authSuperAdmin, async (req: Request, res: Response) => {
  try {
    const [totalUsers, patients, drivers, hospitalAdmins] = await Promise.all([
      User.count(),
      User.count({ where: { type: 'patient' } }),
      User.count({ where: { type: 'ambulance_driver' } }),
      User.count({ where: { type: 'hospital_admin' } }),
    ]);

    const [
      totalHospitals,
      totalAmbulanceDrivers,
      totalEmergencies,
      totalAppointments,
      totalAmbulanceNotifications,
    ] = await Promise.all([
      Hospital.count(),
      AmbulanceDriver.count(),
      EmergencyRequest.count(),
      Appointment.count(),
      AmbulanceHospitalNotification.count(),
    ]);

    return res.json({
      success: true,
      message: 'Stats fetched',
      data: {
        users: {
          total: totalUsers,
          patient: patients,
          ambulance_driver: drivers,
          hospital_admin: hospitalAdmins,
        },
        entities: {
          hospitals: totalHospitals,
          ambulanceDrivers: totalAmbulanceDrivers,
          emergenciesAndBedBookings: totalEmergencies,
          appointments: totalAppointments,
          ambulanceNotifications: totalAmbulanceNotifications,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch stats' });
  }
});

export default router;


