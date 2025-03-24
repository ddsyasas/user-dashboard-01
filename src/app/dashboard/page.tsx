'use client';

import { Card, CardBody } from '@nextui-org/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const stats = [
  { name: 'Total Users', value: '2,543' },
  { name: 'Active Users', value: '1,876' },
  { name: 'Revenue', value: '$45,678' },
  { name: 'Growth', value: '+23.45%' },
];

export default function DashboardPage() {
  return (
    <div className="h-full">
      {/* Add your dashboard content here */}
    </div>
  );
} 