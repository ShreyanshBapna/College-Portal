import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  textColor: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  textColor,
  change
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-sm font-medium truncate">
            {label}
          </p>
          <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-2 ${textColor} truncate`}>
            {value}
          </p>
          {change && (
            <p className="text-sm text-green-600 font-medium mt-1">{change} from last month</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ml-4 flex-shrink-0`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;