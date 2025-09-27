import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  textColor: string;
  change?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  textColor,
  change,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-3 truncate">
            {label}
          </p>
          <p className={`text-2xl sm:text-3xl font-bold mb-2 ${textColor} truncate`}>
            {value}
          </p>
          {change && (
            <p className="text-sm text-emerald-600 font-semibold bg-emerald-50/80 px-3 py-1 rounded-full inline-block">
              {change} from last month
            </p>
          )}
          <div className="w-full bg-gray-200/50 rounded-full h-1.5 mt-3">
            <motion.div 
              className={`h-1.5 rounded-full ${color}`}
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: delay + 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg shadow-gray-900/10 ring-1 ring-white/20 ml-6 flex-shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;